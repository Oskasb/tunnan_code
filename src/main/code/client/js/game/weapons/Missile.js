"use strict";

define([
	"game/weapons/WeaponData",
	"game/weapons/FireDamage",
	'game/GameConfiguration',
	"game/ModelDefinitions",
	"application/EventManager",
	'goo/math/Matrix3x3',
	'goo/math/Vector3',
	'goo/entities/SystemBus',
	'game/world/PhysicalWorld',
	'3d/GooEffectController'
],
	function(
		weaponData,
		FireDamage,
		gameConfig,
		modelDefinitions,
		event,
		Matrix3x3,
		Vector3,
		SystemBus,
		physicalWorld,
		GooEffectController
		) {

		var activeMissiles = [];
		var bulletCount = 0;
		var calcVec = new Vector3();

		var registerMissile = function(bullet, caliber, visible) {
			bulletCount += 1;



			var callback = function(entity) {
				bullet.id = entity.id;
				bullet.entity = entity;
				entity.spatial = bullet.spatial;
				entity.pieceData = bullet.bulletData;
				event.fireEvent(event.list().REGISTER_ACTIVE_ENTITY, {entity:bullet.entity});            };

			event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:"bullet_"+bulletCount, callback:callback});

			activeMissiles.push(bullet);
		};




		var Missile = function(pos, vel, bulletData, cannonData, callback, originatorId, targetSpatial) {

			this.targetSpatial = targetSpatial;

			var rot = new Matrix3x3();
			this.aimRot = new Matrix3x3();
			this.warheadActivationTime = 5000;
			this.activationTime = 1300;
			this.detonationRange = 80;
			this.engineOn = false;
			this.enginePower = 0.15;
			this.engineForce = new Vector3(0, 0, this.enginePower);

			this.hitVec = new Vector3();
			this.hitNormal = new Vector3();
			this.originatorId = originatorId;
			this.onHitEffects = bulletData.onHitEffects;
			this.bulletData = bulletData;
			this.spatial = {
				visualPos:new Vector3(0, 0, 0),
				pos: pos,
				rot: rot,
				velocity: new Vector3(vel),
				audioVel:new Vector3([0, 0.000001, 0])
			};

			vel.mul(-1);
			this.spatial.rot.lookAt(vel, Vector3.UNIT_Y);

			this.caliber = cannonData.caliber;
			this.lifetime = cannonData.lifetime;
			this.age = 0;
			this.lifeTime = bulletData.lifeTime;
			this.hitCallback = callback;
			registerMissile(this, this.caliber, this.visible);
			this.particles = [];

			if (bulletData.trailEffects) {
				for (var i = 0; i < bulletData.trailEffects.length; i++) {
					this.attachTrailEffect(this.spatial, bulletData.trailEffects[i]);
				}
			}

			this.removed = false;
			this.updateMissile(0.01);
		};

		Missile.prototype.attachTrailEffect = function(spatial, bulletEffect) {

			var onParticleDead = function(particle) {
				this.particles.splice(this.particles.indexOf(particle), 1);
			}.bind(this);

			var onParticleAdded = function(particle) {
				this.particles.push(particle);
			}.bind(this);

			var particleUpdate = function(particle) {
				particle.lifeSpan = this.lifeTime - this.age*3;
				particle.position.setVector(spatial.pos);
			}.bind(this);

			var callbacks = {
				particleUpdate:particleUpdate,
				onParticleAdded:onParticleAdded,
				onParticleDead:onParticleDead
			};

			var effect_data = bulletEffect.effectData;
			var sourceSize = bulletEffect.effectData.growthFactor[0];
			effect_data.size = [0.1 + this.caliber*0.003 * sourceSize, 0.1+this.caliber*0.005 * sourceSize];
			effect_data.lifespan = [this.age, this.age];

			SystemBus.emit('playParticles', {simulatorId:bulletEffect.simulatorId, pos:this.spatial.pos, vel:this.hitNormal, effectData:effect_data, callbacks:callbacks});

		};


		Missile.prototype.remove = function() {
			//    console.log("Remove Missile")

			var bulletIndex = activeMissiles.indexOf(this);
			activeMissiles.splice(bulletIndex, 1);
			//    console.log("active bullets: ", activeMissiles);

			this.lifeTime = 0;
			this.removed = true;
			this.delete();
		};

		Missile.prototype.delete = function() {
			for (var i = 0; i < this.particles.length; i++) {
				this.particles[i].killParticle();
			}
			event.fireEvent(event.list().REMOVE_GAME_ENTITY, {entityId:this.id});
			delete this;
		};


		Missile.prototype.disappear = function() {
			this.hitCallback(this.spatial, "nothing");
			this.remove();
		};

		var applyHitDamage = function(hit, damageData) {
			for (var index in damageData) {
				if (index == "fire") new FireDamage(hit.entity, hit.part, damageData[index]);
				if (index == "kinetic") event.fireEvent(event.list().DAMAGE_ENTITY, {entity:hit.entity, damage:damageData[index].points});
			}
		};


		Missile.prototype.playHitSound = function(hit) {
			var selection =  Math.floor(Math.random()*this.bulletData.onHitSounds.length);
			event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()[this.bulletData.onHitSounds[selection]], pos:hit.pos, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
		};

		Missile.prototype.waterSplash = function(pos) {
			var count = Math.ceil(Math.random()*this.caliber*0.25);
			var fxPos = [pos[0], 0, pos[2]]
			this.hitVec.set(pos);
			this.hitNormal.set(0, count, 0);

			event.fireEvent(event.list().SPLASH_WATER, {pos:fxPos, count:4+count, dir:[0, count, 0]});
			if (Math.random() < 0.2*count) event.fireEvent(event.list().SPLASH_RINGLET, {pos:fxPos, count:1, dir:[0, 0, 0]});
			if (Math.random() < 0.05*count) event.fireEvent(event.list().SPLASH_FOAM, {pos:fxPos, count:1, dir:[0, 0, 0]});

		};

		Missile.prototype.hit = function(hit) {
			this.hitCallback(this.spatial, hit);
			var pos = hit.pos;

			if (hit.part=="water") {
				this.waterSplash(pos);
				return;
			}

			//    console.log("HIT!", hit)
			var vel = this.spatial.velocity.data;
			for (var i = 0; i < this.onHitEffects.length; i++) {


				SystemBus.emit('playParticles', {simulatorId:this.onHitEffects[i].simulatorId, pos:new Vector3(pos), vel:Vector3.UNIT_Y, effectData:this.onHitEffects[i].effectData});
			}

			if (hit.entity) {
				for (var i = 0; i < this.bulletData.damageEffects.length; i++) {
					applyHitDamage(hit, this.bulletData.damageEffects[i]);
				}
			} else {
				physicalWorld.renderGroundHitEffect(pos)
			}


			this.playHitSound(hit);
		};


		var triggerData = {
			"color":[0.1, 0.1, 0.1, 1],
			"count":2,
			"opacity":[0.08, 0.3],
			"alpha":"zeroOneZero",
			"growthFactor":[1.1, 2],
			"growth":"zeroToOne",
			"stretch":0.4,
			"strength":5,
			"spread":1,
			"acceleration":0.98,
			"gravity":0,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[0,2.3],
			"lifespan":[0.1, 0.2],
			"spinspeed":[-0.1, 0.1],
			"sprite":"smokey",
			"loopcount":1,
			"trailsprite":"projectile_1",
			"trailwidth":1
		};


		var vaporData = {
			"color":[1,1, 1, 1],
			"count":1,
			"opacity":[0.2, 0.9],
			"alpha":"zeroOneZero",
			"growthFactor":[5, 18],
			"growth":"zeroToOne",
			"stretch":0.4,
			"strength":5,
			"spread":1,
			"acceleration":0.98,
			"gravity":0,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[0.1,2.3],
			"lifespan":[0.1, 2],
			"spinspeed":[-0.1, 0.1],
			"sprite":"smokey",
			"loopcount":1,
			"trailsprite":"projectile_1",
			"trailwidth":1
		};

		var smokeData = {
			"color":[0.1, 0.1, 0.1, 1],
			"count":1,
			"opacity":[0.05, 0.1],
			"alpha":"zeroOneZero",
			"growthFactor":[5.1, 28],
			"growth":"zeroToOne",
			"stretch":0.4,
			"strength":5,
			"spread":0.5,
			"acceleration":0.98,
			"gravity":0,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[0.1,2.3],
			"lifespan":[0.01, 0.2],
			"spinspeed":[-0.1, 0.1],
			"sprite":"smokey",
			"loopcount":1,
			"trailsprite":"projectile_1",
			"trailwidth":1
		};

		Missile.prototype.activateMissileEngine = function() {
			SystemBus.emit('playParticles', {simulatorId:"AdditiveParticle", pos:this.spatial.pos, vel:this.spatial.velocity, effectData:triggerData});
			this.engineOn = true;
		};

		var calcVec2 = new Vector3();

		Missile.prototype.applyEngineForce = function() {


			if (lineRenderSystem.passive == false) {
				lineRenderSystem.drawLine(this.spatial.pos, this.targetSpatial.pos, lineRenderSystem.RED);
			}

			this.engineForce.setDirect(0, 0, 1);

			calcVec.setVector(this.spatial.pos);
			calcVec.sub(this.targetSpatial.pos);



		//	calcVec.mul(-1)
			this.aimRot.lookAt(calcVec, Vector3.UNIT_Y);

			this.aimRot.applyPost(this.engineForce);

			calcVec.setVector(this.spatial.velocity);
			calcVec.normalize();
			calcVec.lerp(this.engineForce , 0.7);


		//	calcVec.setVector(this.engineForce);
			calcVec.normalize();


			calcVec.mul(this.enginePower);

			this.spatial.velocity.addVector(calcVec);


			this.spatial.rot.lookAt(calcVec, Vector3.UNIT_Y);

			if (Math.random() < 0.6) {
				SystemBus.emit('playParticles', {simulatorId:"StandardParticle", pos:this.spatial.pos, vel:this.spatial.velocity, effectData:smokeData});
			}

			if (Math.random() < 0.1) {
				SystemBus.emit("playVaporEffect", {pos:this.spatial.pos, vel:Vector3.UNIT_Y, effectData:vaporData});
			}

		};

		Missile.prototype.updateMissile = function(time) {
			this.age+=time;

			var checkHit = physicalWorld.checkSpatialConflict(this, time);

			if (this.age > this.activationTime) {
				 if (!this.engineOn) {
					 this.activateMissileEngine();
				 } else {
					 this.applyEngineForce();

					 if (this.age > this.warheadActivationTime) {

						 if (this.spatial.pos.distance(this.targetSpatial.pos) < this.detonationRange) {
							 this.hit({part:"ground", entity:null, pos:this.spatial.pos});
							 this.remove();
						 }

					 }

				 }
			}

			this.dragFactor = 0.007;
			this.spatial.velocity.mul(1-this.dragFactor);

			if (checkHit) {
				this.hit(checkHit);
				this.remove();
				return;
			}

			if (this.spatial.pos.data[1] <= 0) {
				this.hitCallback(this.spatial, "water");
				this.remove();
				return;
			}
			this.hitNormal.set(this.spatial.velocity);
			this.hitNormal.mul(2)

			if (this.age > this.lifeTime) {
				this.disappear();
			}
		};


		var updateActiveMissiles = function(time) {
			for (var i = 0; i < activeMissiles.length; i++) {
				activeMissiles[i].updateMissile(time);
			}
		};

		var handleTick = function(e) {
			var time = event.eventArgs(e).frameTime;
			updateActiveMissiles(time);
		};

		event.registerListener(event.list().UPDATE_ACTIVE_ENTITIES, handleTick);
//		event.registerListener(event.list().UPDATE_GAMEPIECE_EFFECTS, handleUpdateEffects);
		return Missile;

	});