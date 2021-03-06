"use strict";

define([
	"game/weapons/WeaponData",
	"game/weapons/FireDamage",
	'game/GameConfiguration',
	"game/ModelDefinitions",
	"application/EventManager",
	'goo/math/Matrix3x3',
	'goo/math/Vector3',
		'goo/math/Quaternion',
	'goo/math/MathUtils',
	'goo/entities/SystemBus',
	'game/world/PhysicalWorld'
],
	function(
		weaponData,
		FireDamage,
		gameConfig,
		modelDefinitions,
		event,
		Matrix3x3,
		Vector3,
		Quaternion,
		MathUtils,
		SystemBus,
		physicalWorld
		) {

		var activeMissiles = [];
		var missileCount = 0;
		var calcVec = new Vector3();

		var registerMissile = function(bullet, caliber, visible, ready) {
			missileCount += 1;

			var callback = function(entity) {

				var register = function() {
					bullet.id = entity.id;
					bullet.entity = entity;
					entity.spatial = bullet.spatial;
					entity.pieceData = bullet.bulletData;
					event.fireEvent(event.list().REGISTER_ACTIVE_ENTITY, {entity:bullet.entity});
					activeMissiles.push(bullet);
					ready(bullet);
				};

				var visualEntityReady = function(gooEntity) {
					if (entity.geometries[0]) entity.geometries[0].removeFromWorld();
					gooEntity.transformComponent.children[0].transform.rotation.rotateX(Math.PI * 0.5);
					gooEntity.transformComponent.children[0].setUpdated();
					entity.geometries[0] = gooEntity;
					entity.geometries[0].addToWorld();
					register();
				};


				if (bullet.bulletData.modelName) {
					event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:'bundles', modelPath:bullet.bulletData.modelName, callback:visualEntityReady});
				} else {
					register();
				}
			};

			event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:"missile_"+missileCount, callback:callback});

		};




		var Missile = function(pos, vel, bulletData, cannonData, callback, originatorId, targetSpatial) {

			this.targetSpatial = targetSpatial;

			this.xStability = 3 + Math.random();
			this.yStability = 3 + Math.random();
			this.xOffset = 3.5 * Math.random();
			this.yOffset = 3.2 * Math.random();



			var rot = new Matrix3x3();
			this.aimRot = new Matrix3x3();
			this.warheadActivationTime = 8000;
			this.homingActivationTime = 3000;
			this.activationTime = 700;
			this.detonationRange = 80;
			this.engineOn = false;
			this.engineMaxPower = 0.3;
			this.enginePower = 0;
			this.engineForce = new Vector3(0, 0, this.enginePower);

			this.hitVec = new Vector3();
			this.hitNormal = new Vector3();
			this.originatorId = originatorId;
			this.onHitEffects = bulletData.onHitEffects;
			this.bulletData = bulletData;

			this.enginePosOffset = new Vector3();

			this.spatial = {
				visualPos:new Vector3(0, 0, 0),
				pos: pos,
				rot: rot,
				velocity: new Vector3(vel),
				audioVel:new Vector3([0, 0.000001, 0])
			};

			vel.mul(-1);
			this.spatial.rot.lookAt(vel, Vector3.UNIT_Y);

			this.spatial.velocity.y -= 0.04;

			this.caliber = cannonData.caliber;
			this.lifetime = cannonData.lifetime;
			this.age = 0;
			this.lifeTime = bulletData.lifeTime;
			this.hitCallback = callback;

			this.particles = [];
			var ready = function(missile) {




				missile.removed = false;
				missile.updateMissile(0.01);
			};

			registerMissile(this, this.caliber, this.visible, ready);

		};

		Missile.prototype.attachTrailEffect = function(spatial, bulletEffect) {

			var onParticleDead = function(particle) {
				this.particles.splice(this.particles.indexOf(particle), 1);
			}.bind(this);

			var onParticleAdded = function(particle) {
				this.particles.push(particle);
			}.bind(this);

			var particleUpdate = function(particle) {

				this.enginePosOffset.setArray(this.bulletData.enginePosOffset);
				this.spatial.rot.applyPost(this.enginePosOffset);
				this.enginePosOffset.addVector(this.spatial.pos);

				particle.lifeSpan = this.lifeTime - this.age*3;
				particle.position.setVector(this.enginePosOffset);
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
			"color0":[0.2,0.2, 0.1],
			"color1":[0.7,0.6, 0.4],
			"colorRandom":0.01,
			"count":2,
			"opacity":[0.08, 0.3],
			"alpha":"oneToZero",
			"growthFactor":[1.1, 2],
			"growth":"oneToZero",
			"stretch":0.4,
			"strength":1,
			"spread":1,
			"acceleration":0.98,
			"gravity":0,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[0,2.3],
			"lifespan":[0.01, 0.1],
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
			"growthFactor":[4, 12],
			"growth":"oneToZero",
			"stretch":0.4,
			"strength":1,
			"spread":1,
			"acceleration":0.98,
			"gravity":0,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[0,0],
			"lifespan":[0.2, 8],
			"spinspeed":[-0.1, 0.1],
			"sprite":"smokey",
			"loopcount":1,
			"trailsprite":"projectile_1",
			"trailwidth":1
		};

		var smokeData = {
			"color0":[0.0,0.0, 0.0],
			"color1":[0.2,0.2, 0.2],
			"colorRandom":0.01,
			"count":1,
			"opacity":[0.25, 0.9],
			"alpha":"oneToZero",
			"growthFactor":[5.1, 28],
			"growth":"oneToZero",
			"stretch":1,
			"strength":5,
			"spread":0.5,
			"acceleration":0.98,
			"gravity":0,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[0, 0.3],
			"lifespan":[0.06, 0.9],
			"spinspeed":[-0.1, 0.1],
			"sprite":"smokey",
			"loopcount":1,
			"trailsprite":"projectile_1",
			"trailwidth":1
		};

		Missile.prototype.activateMissileEngine = function() {
		//	SystemBus.emit('playParticles', {simulatorId:"AdditiveParticle", pos:this.spatial.pos, vel:this.spatial.velocity, effectData:triggerData});

			if (this.bulletData.trailEffects) {
				for (var i = 0; i < this.bulletData.trailEffects.length; i++) {
					this.attachTrailEffect(this.spatial, this.bulletData.trailEffects[i]);
				}
			}


			this.engineOn = true;
		};

		var calcVec2 = new Vector3();

		var calcVec3 = new Vector3();
		var calcVec4 = new Vector3();

		var calcQuat = new Quaternion();
		var calcQuat2 = new Quaternion();

		Missile.prototype.turnTowardsTarget = function() {
			calcVec2.setVector(this.targetSpatial.velocity);
			calcVec2.mul(Math.sqrt(this.spatial.pos.distance(this.targetSpatial.pos)) * 2.5);
			calcVec.setVector(this.targetSpatial.pos);
			calcVec.addVector(calcVec2);

			calcVec3.setVector(this.spatial.pos);
			calcVec4.setVector(this.targetSpatial.pos);
			calcVec4.y = calcVec3.y;

			var distSquared = calcVec3.distanceSquared(calcVec4)

			calcVec.y += Math.min(distSquared * 0.00002, 4000);

			if (lineRenderSystem.passive == false) {
				lineRenderSystem.drawLine(this.spatial.pos, calcVec, lineRenderSystem.RED);
			}


			if (this.age > this.homingActivationTime) {
				calcVec.subVector(this.spatial.pos);

				calcVec.mul(-1)

			} else {
				//	this.spatial.rot.rotateX(0.01);
				calcVec.setDirect(this.xStability*Math.sin(this.xOffset + this.age*0.0003), this.yStability*Math.sin(this.yOffset + this.age*0.0002), -1);
				this.spatial.rot.applyPost(calcVec);
				this.xStability*=0.99;
				this.yStability*=0.99;

			//	calcVec2.setDirect(0.1*this.xStability*Math.sin(0.1*this.xOffset + this.age*0.0003),this.yStability*Math.sin(this.yOffset + this.age*0.0002), -1);
			}

			this.spatial.rot.applyPost(calcVec2);
			calcVec2.subVector(calcVec);
			calcVec.subVector(calcVec2);

			this.aimRot.lookAt(calcVec, Vector3.UNIT_Y);
			calcQuat.fromRotationMatrix(this.aimRot);

			calcQuat2.fromRotationMatrix(this.spatial.rot);

			calcQuat2.slerp(calcQuat, 0.01*Math.sqrt(this.age * 0.01));
			calcQuat2.toRotationMatrix(this.spatial.rot);
			/*
			this.spatial.rot.lookAt(calcVec2, Vector3.UNIT_Y);

			calcVec2.setDirect(0, 0, -1);

			this.spatial.rot.applyPost(calcVec2);
			calcVec2.normalize();
			calcVec2.lerp(calcVec, 0.0001);
*/


		};

		Missile.prototype.applyEngineForce = function() {

			this.enginePower = MathUtils.lerp(0.05, this.enginePower, this.engineMaxPower);

			this.engineForce.setDirect(0, 0, this.enginePower);

			this.spatial.rot.applyPost(this.engineForce);

			this.spatial.velocity.addVector(this.engineForce);


		//	if (Math.random() < 0.6) {
			SystemBus.emit('playParticles', {simulatorId:"StandardParticle", pos:this.enginePosOffset, vel:this.engineForce, effectData:smokeData});
		//	}

			if (Math.random() < 0.1) {
				SystemBus.emit("playVaporEffect", {pos:this.enginePosOffset, vel:Vector3.UNIT_Y, effectData:vaporData});
			}

		};

		Missile.prototype.updateMissile = function(time) {
			this.age+=time;



			var checkHit = physicalWorld.checkSpatialConflict(this, time);

			if (this.age > this.activationTime) {
				 if (!this.engineOn) {
					 this.activateMissileEngine();
				 } else {


					 this.turnTowardsTarget();


					 this.applyEngineForce();

					 if (this.age > this.warheadActivationTime) {

						 if (this.spatial.pos.distance(this.targetSpatial.pos) < this.detonationRange) {
							 this.hit({part:"ground", entity:null, pos:this.spatial.pos});
							 this.remove();
						 }

					 }
				 }
			}

			this.dragFactor = 0.0001 + 0.06*this.enginePower ;
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