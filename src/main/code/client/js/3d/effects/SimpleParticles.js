define([
	'particle_system/ParticlesAPI',
	'particle_system/defaults/ExampleEffects',
	'particle_system/defaults/DefaultRendererConfigs',
	'particle_system/defaults/DefaultSpriteAtlas',
	'particle_system/defaults/DefaultSimulators',
	'goo/renderer/TextureCreator',
	'goo/math/Vector3'

],
function(
	ParticlesAPI,
	ExampleEffects,
	DefaultRendererConfigs,
	DefaultSpriteAtlas,
	DefaultSimulators,
	TextureCreator,
	Vector3

) {


	function SimpleParticles(goo) {
		this.goo = goo;
		this.particlesAPI = new ParticlesAPI(goo);
		this.ready = false;
	}

	SimpleParticles.prototype.createSystems = function() {

		var atlases = {};

		for (var i = 0; i < DefaultSpriteAtlas.atlases.length; i++) {
			atlases[DefaultSpriteAtlas.atlases[i].id] = DefaultSpriteAtlas.atlases[i];
		}

		var txLoaded = function() {
			this.particlesAPI.createParticleSystems(DefaultSimulators, DefaultRendererConfigs, DefaultSpriteAtlas.atlases[0], texture);
			this.ready = true;
		}.bind(this);

		var textureCreator = new TextureCreator();

		var texture = textureCreator.loadTexture2D(atlases[DefaultSpriteAtlas.atlases[0].id].textureUrl.value, {
			magFilter:"NearestNeighbor",
			minFilter:"NearestNeighborNoMipMaps",
			wrapS: 'EdgeClamp',
			wrapT: 'EdgeClamp'
		}, function() {
			txLoaded();
		});

	};

	SimpleParticles.prototype.createSystem = function() {
	//	this.particlesAPI.createParticleSystem(this.goo, id, particleSettings, texture);
	};

	SimpleParticles.prototype.spawn = function(simulatorId, position, normal, effectData, callbacks) {
		if (!this.ready) return;
		this.particlesAPI.spawnParticles(simulatorId, position, normal, effectData, callbacks);

	//	this.particlesAPI.spawnParticles(id, position, normal, effectData)
	};




	SimpleParticles.prototype.update = function(tpf) {
		this.particlesAPI.requestFrameUpdate(tpf);
	};

	return SimpleParticles;
});