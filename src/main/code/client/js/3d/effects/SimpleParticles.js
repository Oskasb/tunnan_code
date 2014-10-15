define([
	'goo/math/Vector3',
	'goo/math/MathUtils',
	'goo/renderer/MeshData',
	'goo/renderer/Shader',
	'goo/renderer/Material',
	'goo/renderer/TextureCreator'
],
function(
	Vector3,
	MathUtils,
	MeshData,
	Shader,
	Material,
	TextureCreator
) {


	function SimpleParticles(goo) {
		this.goo = goo;
		this.simulators = {};
		this.groups = {};
	}

	function Particle(entity) {
		this.entity = entity;
		this.position = new Vector3();
		this.velocity = new Vector3();
		this.stretch = 1;
		this.alpha = 1;
		this.gravity = 0;
		this.lifeSpan = 0;
		this.lifeSpanTotal = 0;
		this.dead = true;
	};

	function Simulator(path, goo, particleSettings) {
		var texture = new TextureCreator().loadTexture2D(path+particleSettings.texture, {
			wrapS: 'EdgeClamp',
			wrapT: 'EdgeClamp'
		});
		// texture.wrapS = 'EdgeClamp';
		// texture.wrapT = 'EdgeClamp';

	// particle.size, particle.gravity, 'CustomBlending', particle.color, particle.spread, particle.strength, particle.lifespan, particle.count

		this.particleSettings = particleSettings;
		particleSettings.poolCount = particleSettings.poolCount !== undefined ? particleSettings.poolCount : 500;
		
		particleSettings.size = particleSettings.size !== undefined ? particleSettings.size : [10, 10];
		particleSettings.growth = particleSettings.growth !== undefined ? particleSettings.growth : [0, 0];
		particleSettings.rotation = particleSettings.rotation !== undefined ? particleSettings.rotation : [0, 360];
		particleSettings.spin = particleSettings.spin !== undefined ? particleSettings.spin : [0, 0];

		particleSettings.gravity = particleSettings.gravity !== undefined ? particleSettings.gravity : -5;
		particleSettings.color = particleSettings.color !== undefined ? particleSettings.color : [1, 1, 1, 1];
		particleSettings.spread = particleSettings.spread !== undefined ? particleSettings.spread : 1;
		particleSettings.acceleration = particleSettings.acceleration !== undefined ? particleSettings.acceleration : 0.999;
		particleSettings.strength = particleSettings.strength !== undefined ? particleSettings.strength : 1;
		particleSettings.lifespan = particleSettings.lifespan !== undefined ? particleSettings.lifespan : [3, 3];
		particleSettings.count = particleSettings.count !== undefined ? particleSettings.count : 1;

		var attributeMap = MeshData.defaultMap([MeshData.POSITION, MeshData.COLOR]);
		attributeMap.DATA = MeshData.createAttribute(4, 'Float');
		var meshData = new MeshData(attributeMap, particleSettings.poolCount);
		meshData.vertexData.setDataUsage('DynamicDraw');
		meshData.indexModes = ['Points'];
		this.meshData = meshData;

		var material = new Material('ParticleMaterial', particleShader);
		material.setTexture('PARTICLE_MAP', texture);
		if ( particleSettings.blending === 'additive') {
			material.blendState.blending = 'AdditiveBlending';
		} else {
			material.blendState.blending = 'CustomBlending';
		}

		//
		// material.blendState.blending = 'SubtractiveBlending';
		material.depthState.write = false;
		material.renderQueue = 3010;
		var entity = goo.world.createEntity(meshData, material);
		entity.name = 'Simulator';
		entity.meshRendererComponent.cullMode = 'Never';
		entity.addToWorld();

		this.particles = [];
		for (var i = 0; i < particleSettings.poolCount; i++) {
			var particle = new Particle(entity);
			this.particles[i] = particle;
		}
		
		if (particleSettings.color === "inherit") {
			this.inheritColor = true;
		} else {
			this.inheritColor = false;
		}

		// var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
		// for (var i = 0; i < particleSettings.poolCount; i++) {
		// 	col[4 * i + 0] = color[0];
		// 	col[4 * i + 1] = color[1];
		// 	col[4 * i + 2] = color[2];
		// 	col[4 * i + 3] = color[3];
		// }

		this.aliveParticles = 0;
		this.meshData.indexLengths = [0];
		this.meshData.indexCount = 0;
	}

	function randomBetween(min, max) {
		return Math.random() * (max - min) + min;
	}
	var calcVec = new Vector3();
	Simulator.prototype.spawn = function(position, normal, effectData) {
		var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
		var data = this.meshData.getAttributeBuffer('DATA');
		
		var color = this.particleSettings.color;
		if (this.inheritColor) {
			if (effectData != undefined) {


				if (effectData.particleColor === undefined) {
					color = [1,1,1,1];
				} else {
					color = effectData.particleColor;
				}
			}
		}


		var count = this.particleSettings.count;

		if (effectData) {
			if (effectData.intensity) count = Math.floor(count*effectData.intensity);
		}

		var strength = this.particleSettings.strength;
		var spread = this.particleSettings.spread;
		var size = this.particleSettings.size;
		var growth = this.particleSettings.growth;
		var rotation = this.particleSettings.rotation;
		var spin = this.particleSettings.spin;
		var lifeSpan = this.particleSettings.lifespan;
		for (var i = 0, l = this.particles.length; i < l && count > 0; i++) {
			var particle = this.particles[i];

			if (particle.dead) {
				var ratio = -particle.stretch * (this.particleSettings.count-count) * 4/this.particleSettings.count;
				particle.lifeSpanTotal = particle.lifeSpan = randomBetween(lifeSpan[0], lifeSpan[1]);
				position.data[0] += normal.data[0]*ratio;
				position.data[1] += normal.data[1]*ratio;
				position.data[2] += normal.data[2]*ratio;
				particle.position.setv(position);
			//	var mult = (1 + Math.random() * 4) * strength;

				particle.velocity.set(
					(Math.random() -0.5) * (2*spread) + (1-spread)*normal.data[0], // + 1.0 - spread * 0.5,
					(Math.random() -0.5) * (2*spread) + (1-spread)*normal.data[1], // + 1.0 - spread * 0.5,
					(Math.random() -0.5) * (2*spread) + (1-spread)*normal.data[2]  // + 1.0 - spread * 0.5
				);
				calcVec.set(normal);
				calcVec.mul(ratio);
				particle.position.add(calcVec);
			//	particle.velocity.normalize();
				particle.velocity.mul(strength);
				particle.dead = false;
				this.aliveParticles++;
				count--;

				var rand = Math.random() * 0.1 - 0.05;
				
				col[4 * i + 0] = color[0] + rand;
				col[4 * i + 1] = color[1] + rand;
				col[4 * i + 2] = color[2] + rand;

				data[4 * i + 0] = randomBetween(size[0], size[1]); // size
				data[4 * i + 1] = randomBetween(growth[0], growth[1]); // size change
				data[4 * i + 2] = randomBetween(rotation[0], rotation[1]) * MathUtils.DEG_TO_RAD; // rot
				data[4 * i + 3] = randomBetween(spin[0], spin[1]) * MathUtils.DEG_TO_RAD; // spin
			}
		}
	};

	Simulator.prototype.update = function(tpf) {

		var pos = this.meshData.getAttributeBuffer(MeshData.POSITION);
		var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
		var data = this.meshData.getAttributeBuffer('DATA');
		var lastAlive = 0;
		var alpha = this.inheritColor ? 1.0 : this.particleSettings.color[3];
		var gravity = this.particleSettings.gravity;
		var acceleration = this.particleSettings.acceleration;
		for (var i = 0, l = this.particles.length; i < l; i++) {
			var particle = this.particles[i];

			if (particle.dead) {
				continue;
			}

			particle.lifeSpan -= tpf;
			if (particle.lifeSpan <= 0) {
				particle.dead = true;
				particle.position.setd(0, 0, 0);
				pos[3 * i + 0] = 0;
				pos[3 * i + 1] = -1000;
				pos[3 * i + 2] = 0;
				this.aliveParticles--;
				continue;
			}

			calcVec.setv(particle.velocity).muld(tpf, tpf, tpf);
			particle.position.addv(calcVec);
			particle.velocity.muld(acceleration, acceleration, acceleration);
			particle.velocity.add_d(0, gravity * tpf, 0);
			particle.alpha = alpha * particle.lifeSpan / particle.lifeSpanTotal;

			pos[3 * i + 0] = particle.position.data[0];
			pos[3 * i + 1] = particle.position.data[1];
			pos[3 * i + 2] = particle.position.data[2];

			col[4 * i + 3] = particle.alpha;

			data[4 * i + 0] += data[4 * i + 1] * tpf;
			data[4 * i + 2] += data[4 * i + 3] * tpf;
			lastAlive = i;
		}

		this.meshData.indexLengths = [lastAlive];
		this.meshData.indexCount = lastAlive;

		this.meshData.setVertexDataUpdated();
	};


	SimpleParticles.prototype.addGroup = function(id, group) {
		this.groups[id] = group;
	};

	SimpleParticles.prototype.spawnGroup = function(id, position, normal, effectData) {
		var group = this.groups[id];

		if (!group) {
			console.log("No particle group: ", id, group, this.groups)
			return;
		}

		for (var i = 0; i < group.length; i++) {
			var name = group[i];
			this.spawn(name, position, normal, effectData);
		}
	};

	SimpleParticles.prototype.createSystem = function(path, id, particleSettings) {
		if (this.simulators[id]) {
			for (var i = 0; i < this.simulators[id].particles.length; i++) {
				this.simulators[id].particles[i].dead = true;
				this.simulators[id].particles[i].entity.removeFromWorld();
			}
			this.simulators[id].update();
			delete this.simulators[id];
		}
		this.simulators[id] = new Simulator(path, this.goo, particleSettings);
	};

	SimpleParticles.prototype.spawn = function(id, position, normal, overrideColor, count) {
		var simulator = this.simulators[id];
		if (simulator) {
			simulator.spawn(position, normal, overrideColor, count);
		}
	};

	SimpleParticles.prototype.update = function(tpf) {
		for (var simulatorId in this.simulators) {
			var simulator = this.simulators[simulatorId];
			if (simulator.aliveParticles > 0) {
				simulator.update(tpf);
			}
		}
	};

	var particleShader = {
		attributes: {
			vertexPosition: MeshData.POSITION,
			vertexColor: MeshData.COLOR,
			vertexData: 'DATA'
		},
		uniforms: {
			viewProjectionMatrix: Shader.VIEW_PROJECTION_MATRIX,
			worldMatrix: Shader.WORLD_MATRIX,
			particleMap: 'PARTICLE_MAP'
		},
		vshader: [
			'attribute vec3 vertexPosition;',
			'attribute vec4 vertexColor;',
			'attribute vec4 vertexData;',
			'uniform mat4 viewProjectionMatrix;',
			'uniform mat4 worldMatrix;',

			'varying vec4 color;',
			'varying mat3 spinMatrix;',

			'void main(void) {',
				'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition.xyz, 1.0);',
				'gl_PointSize = vertexData.x * 1.4142 / gl_Position.w;',
				'color = vertexColor;',
				'float c = cos(vertexData.z);',
				'float s = sin(vertexData.z);',
				'spinMatrix = mat3(c, s, 0.0, -s, c, 0.0, (s-c+1.0)*0.5, (-s-c+1.0)*0.5, 1.0);',
			'}'
		].join('\n'),
		fshader: [
			'uniform sampler2D particleMap;',

			'varying vec4 color;',
			'varying mat3 spinMatrix;',

			'void main(void)',
			'{',
				'vec2 coords = ((spinMatrix * vec3(gl_PointCoord, 1.0)).xy - 0.5) * 1.4142 + 0.5;',
				'vec4 col = color * texture2D(particleMap, coords);',
			//	'if (col.a <= 0.0) discard;',
				'gl_FragColor = col;',
			'}'
		].join('\n')
	};

	return SimpleParticles;
});