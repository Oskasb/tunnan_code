define([
	'particle_simulator/ParticlesAPI'
],
function(
	ParticlesAPI
) {


	function SimpleParticles(goo) {
		this.goo = goo;
		this.particlesAPI = new ParticlesAPI(false);
	}


	SimpleParticles.prototype.createSystem = function(id, particleSettings, texture) {
		this.particlesAPI.createParticleSystem(this.goo, id, particleSettings, texture);
	};

	SimpleParticles.prototype.spawn = function(id, position, normal, effectData) {
		this.particlesAPI.spawnParticles(id, position, normal, effectData)

	};

	SimpleParticles.prototype.update = function(tpf) {
		this.particlesAPI.requestFrameUpdate(tpf);
	};

	return SimpleParticles;
});