define([
	'goo/math/Vector3',
	'goo/math/MathUtils',
	'goo/renderer/MeshData',
	'goo/renderer/Shader',
	'goo/renderer/Material'
],
function(
	Vector3,
	MathUtils,
	MeshData,
	Shader,
	Material
) {


	function SimpleParticles(goo) {
		this.goo = goo;
		this.simulators = {};
		this.groups = {};
	}

	function Particle(entity) {
		this.frameCount = 0;
		this.entity = entity;
		this.position = new Vector3();
		this.velocity = new Vector3();
		this.progress = 0;
		this.frameOffset = 0;
		this.stretch = 1;
		this.alpha = 1;
		this.gravity = 0;
		this.lifeSpan = 0;
		this.lifeSpanTotal = 0;
		this.dead = true;
	};


		var alphaCurve = [[0, 0], [0.5,1], [1, 0]];
		var sizeCurve = [[0, 1], [0.5,1], [1, 1]];


	function Simulator(goo, particleSettings, texture) {

		this.particleSettings = particleSettings;
		particleSettings.poolCount = particleSettings.poolCount !== undefined ? particleSettings.poolCount : 500;

		particleSettings.alphaCurve = particleSettings.alphaCurve !== undefined ? particleSettings.alphaCurve : alphaCurve;
		particleSettings.stretch = particleSettings.stretch !== undefined ? particleSettings.stretch : 0;

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

		if (particleSettings.reflectable == true) {

		} else {
			entity.meshRendererComponent.isReflectable = false;
		}

		entity.addToWorld();
		this.entity = entity;

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
		var tpf = this.entity._world.tpf;

		var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
		var data = this.meshData.getAttributeBuffer('DATA');


		var stretch = this.particleSettings.stretch;
		var color = this.particleSettings.color;
		var count = this.particleSettings.count;
		var size = [this.particleSettings.size[0],this.particleSettings.size[1]];
		var growth = [this.particleSettings.growth[0],this.particleSettings.growth[1]];
		var strength = this.particleSettings.strength;
		var gravity = this.particleSettings.gravity;
		var spread = this.particleSettings.spread;
		var lifeSpan = this.particleSettings.lifespan;

		var alphaCurve = this.particleSettings.alphaCurve;

		if (effectData) {

			if (effectData.alphaCurve) {
				alphaCurve = effectData.alphaCurve
			}

			if (effectData.lifespan) {
				lifeSpan[0] = effectData.lifespan*0.8;
				lifeSpan[1] = effectData.lifespan;
			}
			if (effectData.intensity) {
				count = Math.ceil(count*effectData.intensity);
			}
			if (effectData.count) {
				count = effectData.count;
			}
			if (effectData.color) {
				color = effectData.color;
			}
			if (effectData.strength) {
				strength = effectData.strength;
			}

			if (effectData.size) {
				size[0] = effectData.size;
				size[1] = effectData.size;
			}
			if (effectData.growth) {
				growth[0] = effectData.growth;
				growth[1] = effectData.growth;
			}
			if (effectData.gravity) {
				gravity = effectData.gravity;
			}
			if (effectData.scale) {
				size[0] = size[0] * effectData.scale;
				size[1] = size[1] * effectData.scale;
				growth[0] = growth[0] * effectData.scale;
				growth[1] = growth[1] * effectData.scale;
				strength *= effectData.scale;
			}
			if (effectData.spread) {
				spread = effectData.spread;
			}
		}


		var rotation = this.particleSettings.rotation;
		var spin = this.particleSettings.spin;

		var effectCount = count;
		for (var i = 0, l = this.particles.length; i < l && count > 0; i++) {
			var particle = this.particles[i];

			if (particle.dead) {
				particle.frameCount = 0;
				var ratio = particle.stretch * (this.particleSettings.count-count) /  this.particleSettings.count;

				particle.position.x = position.x + normal.x*ratio;
				particle.position.y = position.y + normal.y*ratio;
				particle.position.z = position.z + normal.z*ratio;
				particle.alphaCurve = alphaCurve;

				particle.lifeSpanTotal = particle.lifeSpan = randomBetween(lifeSpan[0], lifeSpan[1]);

				particle.frameOffset = count/effectCount;

				particle.velocity.set(
					strength*((Math.random() -0.5) * (2*spread) + (1-spread)*normal.x),
					strength*((Math.random() -0.5) * (2*spread) + (1-spread)*normal.y),
					strength*((Math.random() -0.5) * (2*spread) + (1-spread)*normal.z)
				);

				particle.dead = false;
				this.aliveParticles++;
				particle.gravity = gravity;
				count--;

				col[4 * i + 0] = color[0];
				col[4 * i + 1] = color[1];
				col[4 * i + 2] = color[2];

				particle.alpha = color[3];
				data[4 * i + 0] = randomBetween(size[0], size[1]); // size
				data[4 * i + 1] = randomBetween(growth[0], growth[1]); // size change
				data[4 * i + 2] = randomBetween(rotation[0], rotation[1]) * MathUtils.DEG_TO_RAD; // rot
				data[4 * i + 3] = randomBetween(spin[0], spin[1]) * MathUtils.DEG_TO_RAD; // spin
			}
		}
	};


	Simulator.prototype.getInterpolatedInCurveAboveIndex = function(value, curve, index) {
		return curve[index][1] + (value - curve[index][0]) / (curve[index+1][0] - curve[index][0])*(curve[index+1][1]-curve[index][1]);
	};

	Simulator.prototype.fitValueInCurve = function(value, curve) {
		for (var i = 0; i < curve.length; i++) {
			if (!curve[i+1]) return 0;
			if (curve[i+1][0] > value) return this.getInterpolatedInCurveAboveIndex(value, curve, i)
		}
		return 0;
	};

	Simulator.prototype.update = function(tpf) {



		var pos = this.meshData.getAttributeBuffer(MeshData.POSITION);
		var col = this.meshData.getAttributeBuffer(MeshData.COLOR);
		var data = this.meshData.getAttributeBuffer('DATA');
		var lastAlive = 0;
		var gravity = this.particleSettings.gravity;
		var acceleration = this.particleSettings.acceleration;
		for (var i = 0, l = this.particles.length; i < l; i++) {
			var particle = this.particles[i];

			if (particle.dead) {
				continue;
			}

			var deduct = tpf;
			if (!particle.frameCount) {
				deduct = 0.016;
			}

			particle.lifeSpan -= deduct;



			if (particle.lifeSpan <= 0) {
				particle.dead = true;
				particle.position.setd(0, 0, 0);
				pos[3 * i + 0] = 0;
				pos[3 * i + 1] = -1000;
				pos[3 * i + 2] = 0;
				this.aliveParticles--;
				continue;
			}
			particle.progress = 1-((particle.lifeSpan - particle.frameOffset*0.016)  / particle.lifeSpanTotal);
			//	particle.frameOffset;



			calcVec.setv(particle.velocity).muld(deduct, deduct, deduct);
			particle.position.addv(calcVec);
			particle.velocity.muld(acceleration, acceleration, acceleration);
			particle.velocity.add_d(0, gravity * deduct, 0);

			pos[3 * i + 0] = particle.position.data[0];
			pos[3 * i + 1] = particle.position.data[1];
			pos[3 * i + 2] = particle.position.data[2];

			col[4 * i + 3] = particle.alpha * this.fitValueInCurve(particle.progress, particle.alphaCurve);

			data[4 * i + 0] += data[4 * i + 1] * particle.progress;
			data[4 * i + 2] += data[4 * i + 3] * particle.progress;
			particle.frameCount += 1;
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

	SimpleParticles.prototype.createSystem = function(id, particleSettings, texture) {
		if (this.simulators[id]) {
			for (var i = 0; i < this.simulators[id].particles.length; i++) {
				this.simulators[id].particles[i].dead = true;
				this.simulators[id].particles[i].entity.removeFromWorld();
			}
			this.simulators[id].update();
			delete this.simulators[id];
		}
		this.simulators[id] = new Simulator(this.goo, particleSettings, texture);
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
			particleMap: 'PARTICLE_MAP',
			resolution: Shader.RESOLUTION
		},
		vshader: [
			'attribute vec3 vertexPosition;',
			'attribute vec4 vertexColor;',
			'attribute vec4 vertexData;',
			'uniform mat4 viewProjectionMatrix;',
			'uniform mat4 worldMatrix;',
			'uniform vec2 resolution;',

			'varying vec4 color;',
			'varying mat3 spinMatrix;',

			'void main(void) {',
			'gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition.xyz, 1.0);',
			'gl_PointSize = vertexData.x * resolution.y / 1000.0 / gl_Position.w;',
			'color = vertexColor;',
			'float c = cos(vertexData.z); float s = sin(vertexData.z);',
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
			'if (col.a <= 0.0) discard;',
			'gl_FragColor = col;',
			'}'
		].join('\n')
	};


	var bulletShader = {
		attributes: {
			vertexPosition: MeshData.POSITION
		},
		uniforms: {
			viewProjectionMatrix: Shader.VIEW_PROJECTION_MATRIX,
			worldMatrix: Shader.WORLD_MATRIX
			// pointSize: 1.0
		},
		vshader: [
			'attribute vec3 vertexPosition;',
			'uniform mat4 viewProjectionMatrix;',
			'uniform mat4 worldMatrix;',

			'varying float pointSize;',

			'void main(void) {',
			'	gl_Position = viewProjectionMatrix * worldMatrix * vec4(vertexPosition.xyz, 1.0);',
			'	pointSize = 10.0 / gl_Position.w;',
			'	gl_PointSize = pointSize;',
			'}'
		].join('\n'),
		fshader: [
			// 'uniform sampler2D particleMap;',

			'varying float pointSize;',

			'void main(void)',
			'{',
			// '	gl_FragColor = vec4(0.0, 0.0, 0.0, 0.15);',
			'	gl_FragColor = vec4(0.0, 0.0, 0.0, smoothstep(0.1, 0.5, pointSize)) * 0.2;',
			'}'
		].join('\n')
	};


	SimpleParticles.getBulletShader = function() {
		return bulletShader;
	};

	return SimpleParticles;
});