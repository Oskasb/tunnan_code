"use strict";

define([
	'goo/entities/SystemBus',
    "game/GameConfiguration",
	"data_pipeline/PipelineAPI",
    "game/weapons/Bullet",
    "application/EventManager",
    'game/GameUtil',
    'goo/math/Vector3'
],
    function(
		SystemBus,
        gameConfig,
		PipelineAPI,
        Bullet,
        event,
        gameUtil,
        Vector3
        ) {

        var PlaneCannon = function(planeEntity, cannonDataId, weaponSystemData, bulletId, controlData) {
            this.planeEntity = planeEntity;
			this.posOffset = weaponSystemData.posOffset;

			this.attachCannonData(cannonDataId);
			this.attachBulletData(bulletId);

            this.elevation = 0.06;
            this.currentState = 0;

			this.controlData = controlData;

            this.targetState = 0;
            this.flameEffect = null;
            this.smokeEffect = null;
            this.fireSounds = {};
            this.lastBulletVelocity = new Vector3();
        };

		PlaneCannon.prototype.attachCannonData = function(cannonId) {

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

		PlaneCannon.prototype.attachBulletData = function(bulletId) {

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



        PlaneCannon.prototype.playFireSound = function(pos, dir) {
            var selection =  Math.floor(Math.random()*this.data.onFireSounds.length);
			event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound()[this.data.onFireSounds[selection]]});

	//		event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()[this.data.onFireSounds[selection]], pos:pos, vel:this.planeEntity.spatial.velocity.data, dir:dir.data});
        };


        PlaneCannon.prototype.createBullet = function() {
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
                console.log("Cannan hit!", something);
            };
        //    console.log(exitVelocity)
            this.lastBulletVelocity.set(exitVelocity);
            new Bullet(pos, exitVelocity, this.bulletData, this.data, hitCallback, this.planeEntity.id, this.planeEntity.geometries[0]._world.tpf);
            this.playFireSound(pos, exitVelocity);


			for (var i = 0; i < this.data.onFireEffects.length; i++) {
				//			SystemBus.emit('playParticles', {simulatorId:"StandardParticle", pos:pos, vel:exitVelocity, effectData:effectData});
				SystemBus.emit('playParticles', {simulatorId:this.data.onFireEffects[i].simulatorId, pos:pos, vel:exitVelocity, effectData:this.data.onFireEffects[i].effectData});
			}
		};

        PlaneCannon.prototype.fire = function() {
            this.createBullet();

            if (this.currentState == 1) {
                this.sequenceShot(this.cooldownTime);
            }
        };

        PlaneCannon.prototype.sequenceShot = function(delay) {
            var fire = function() {
                this.fire();
            }.bind(this);
            event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:fire, wait:delay});
        };

        PlaneCannon.prototype.updateTriggerState = function(value, step, total) {

            this.currentState = value;
            if (!value) return 0;
            var delay = step * this.cooldownTime/total;
            this.sequenceShot(delay);
            return this.currentState;
        };

        return PlaneCannon;
    });
