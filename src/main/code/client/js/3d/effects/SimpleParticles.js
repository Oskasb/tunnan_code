define([
	'particle_system/ParticlesAPI',
	'particle_system/defaults/ExampleEffects',
	'particle_system/defaults/DefaultRendererConfigs',
	'particle_system/defaults/DefaultSpriteAtlas',
	'particle_system/defaults/DefaultSimulators',
	'goo/math/Vector3'

],
function(
	ParticlesAPI,
	ExampleEffects,
	DefaultRendererConfigs,
	DefaultSpriteAtlas,
	DefaultSimulators,
	Vector3

) {


	function SimpleParticles(goo) {
		this.goo = goo;
		this.particlesAPI = new ParticlesAPI(goo);
	}

	SimpleParticles.prototype.createSystems = function() {
		this.particlesAPI.createParticleSystems(DefaultSimulators, DefaultRendererConfigs, DefaultSpriteAtlas);
	};

	SimpleParticles.prototype.createSystem = function() {
	//	this.particlesAPI.createParticleSystem(this.goo, id, particleSettings, texture);
	};

	SimpleParticles.prototype.spawn = function(rendererId, position, normal, effectData, callbacks) {

		this.particlesAPI.spawnParticles(rendererId, position, normal, effectData, callbacks);

	//	this.particlesAPI.spawnParticles(id, position, normal, effectData)
	};




	SimpleParticles.prototype.update = function(tpf) {
		this.particlesAPI.requestFrameUpdate(tpf);
	};

	return SimpleParticles;
});