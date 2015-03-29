"use strict";

define([
	'goo/entities/SystemBus',
	"game/GameConfiguration",
	"data_pipeline/PipelineAPI",
	"game/weapons/Missile",
	"application/EventManager",
	'game/GameUtil',
	'goo/math/Vector3'
],
	function(
		SystemBus,
		gameConfig,
		PipelineAPI,
		Missile,
		event,
		gameUtil,
		Vector3
		) {

		var MissilePod = function(planeEntity, cannonDataId, weaponSystemData, bulletId, controlData) {
			this.planeEntity = planeEntity;
			this.posOffset = weaponSystemData.posOffset;

			this.attachCannonData(cannonDataId);
			this.attachMissileData(bulletId);

			this.controlData = controlData;

			this.target = this.planeEntity;

			this.elevation = 0;

			this.targetState = 0;
			this.flameEffect = null;
			this.smokeEffect = null;
			this.fireSounds = {};
			this.lastMissileVelocity = new Vector3();
		};

		MissilePod.prototype.attachCannonData = function(cannonId) {

			var cannonDataUpdate = function(srcKey, data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == cannonId) {
						this.name = data[i].name;
						this.data = data[i];

						this.cooldownTime = 1000 / this.data.rateOfFire;
						return;
					}
				}
				console.error("no cannon data for cannonId on turret", cannonId, data, this);
			}.bind(this);
			PipelineAPI.subscribeToCategoryKey('game_parts_data', 'cannons', cannonDataUpdate)

		};

		MissilePod.prototype.attachMissileData = function(bulletId) {

			var bulletDataUpdate = function(srcKey, data) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].id == bulletId) {
						this.bulletData = data[i];
						return;
					}
				}
				console.error("no bullet data for bulletId", bulletId, data);
			}.bind(this);
			PipelineAPI.subscribeToCategoryKey('game_parts_data', 'bullets', bulletDataUpdate)

		};



		MissilePod.prototype.playFireSound = function(pos, dir) {
			var selection =  Math.floor(Math.random()*this.data.onFireSounds.length);
			event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound()[this.data.onFireSounds[selection]]});

			//		event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()[this.data.onFireSounds[selection]], pos:pos, vel:this.planeEntity.spatial.velocity.data, dir:dir.data});
		};


		MissilePod.prototype.createMissile = function() {
			var cannonSpread = 0.0001;
			var pos = new Vector3();
			pos.setVector(this.planeEntity.spatial.pos);
			var posOffset = gameUtil.applyRotationToVelocity(this.planeEntity.geometries[0], new Vector3(this.posOffset));

			pos.addVector(posOffset);
			var exitVelocity = new Vector3(0, this.elevation*(1 / gameConfig.RENDER_SETUP.physicsFPS)*this.data.exitVelocity, this.data.exitVelocity*(1 / gameConfig.RENDER_SETUP.physicsFPS));
			exitVelocity = gameUtil.applyRotationToVelocity(this.planeEntity.geometries[0], exitVelocity);
			exitVelocity.addVector(this.planeEntity.spatial.velocity);
			exitVelocity.addDirect(this.data.exitVelocity*cannonSpread*(Math.random() -0.5), this.data.exitVelocity*cannonSpread*(Math.random() -0.5), this.data.exitVelocity*cannonSpread*(Math.random() -0.5));

			var hitCallback = function(bulletSpatial, something) {
				console.log("Missile hit!", something);
			};
			//    console.log(exitVelocity)
			this.lastMissileVelocity.set(exitVelocity);
			new Missile(pos, exitVelocity, this.bulletData, this.data, hitCallback, this.planeEntity.id, this.target.spatial);
			this.playFireSound(pos, exitVelocity);


			for (var i = 0; i < this.data.onFireEffects.length; i++) {
				//			SystemBus.emit('playParticles', {simulatorId:"StandardParticle", pos:pos, vel:exitVelocity, effectData:effectData});
		//		SystemBus.emit('playParticles', {simulatorId:this.data.onFireEffects[i].simulatorId, pos:pos, vel:exitVelocity, effectData:this.data.onFireEffects[i].effectData});
			}
		};

		MissilePod.prototype.fire = function() {
			this.createMissile();

			if (this.currentState == 1) {
				this.sequenceShot(this.cooldownTime);
			}
		};

		MissilePod.prototype.sequenceShot = function(delay) {

			this.setTargetEntity(this.planeEntity.systems.weapons.target_select[0].target);

			var fire = function() {
				if (this.currentState == 1) {
					this.fire();
				}
			}.bind(this);
			event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:fire, wait:delay});
		};

		MissilePod.prototype.updateTriggerState = function(value, step, total) {
			this.currentState = value;
			if (!value) return 0;
			var delay = step * this.cooldownTime/total;
			this.sequenceShot(delay);
			return this.currentState;
		};


		MissilePod.prototype.setTargetEntity = function(targetEntity) {
			this.target = targetEntity;
		};

		return MissilePod;
	});
