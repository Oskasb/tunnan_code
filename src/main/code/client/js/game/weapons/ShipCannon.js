"use strict";

define([
	'goo/entities/SystemBus',
	"data_pipeline/PipelineAPI",
    "game/GameConfiguration",
    "game/weapons/Bullet",
    'game/GameUtil',
    "application/EventManager",
    'goo/math/Vector3'
],
    function(
		SystemBus,
		PipelineAPI,
        gameConf,
        Bullet,
        gameUtil,
        event,
        Vector3
        ) {

        var ShipCannon = function(shipEntity, cannonDataId, posOffset, bulletId) {

            this.boatEntity = shipEntity;
			this.posOffset = posOffset;

			this.attachCannonData(cannonDataId);
			this.attachBulletData(bulletId);

            this.currentState = 0;
            this.targetState = 0;
            this.firing = false;
            this.flameEffect = null;
            this.smokeEffect = null;
            this.fireSounds = {};
            this.turretRot = this.boatEntity.geometries[0].transformComponent.transform.rotation.clone();

        };

		ShipCannon.prototype.attachCannonData = function(cannonId) {

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

		ShipCannon.prototype.attachBulletData = function(bulletId) {

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

		ShipCannon.prototype.playFireSound = function(pos, dir) {
            var selection =  Math.floor(Math.random()*this.data.onFireSounds.length);
            event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()[this.data.onFireSounds[selection]], pos:pos, vel:this.boatEntity.spatial.velocity.data, dir:dir.data});
        };


        ShipCannon.prototype.createBullet = function(direction, elevation, hitCallback) {
            var pos = new Vector3();
            pos.setv(this.boatEntity.spatial.visualPos);
            var posOffset = gameUtil.applyRotationToVelocity(this.boatEntity.geometries[0], new Vector3(this.posOffset));

            pos.addv(posOffset);
            var exitVelocity = new Vector3(0, 0, this.data.exitVelocity*(1 / gameConf.RENDER_SETUP.physicsFPS));
            this.turretRot.copy(this.boatEntity.spatial.rot);
            this.turretRot.rotateY(direction);
            this.turretRot.rotateX(-elevation);

            exitVelocity = this.turretRot.applyPost(exitVelocity);


        //    exitVelocity.addv(this.boatEntity.spatial.velocity);

            //    console.log(exitVelocity)
            new Bullet(pos, exitVelocity, this.bulletData, this.data, hitCallback, this.boatEntity.id);
            this.playFireSound(pos.data, exitVelocity);
            for (var i = 0; i < this.data.onFireEffects.length; i++) {



					SystemBus.emit('playParticles', {effectName:this.data.onFireEffects[i].id, pos:pos, vel:exitVelocity, effectData:this.data.onFireEffects[i].effectData});


				//    event.fireEvent(event.list()[index], {pos:[pos.data[0], pos.data[1], pos.data[2]], count:this.data.onFireEffects[index].count, dir:[exitVelocity.data[0],exitVelocity.data[1], exitVelocity.data[2]]})
                }
            };

        ShipCannon.prototype.fire = function(direction, elevation, hitCallback) {
            this.createBullet(direction, elevation, hitCallback);
        };

        ShipCannon.prototype.sequenceShot = function(delay) {
            var fire = function() {
                this.fire();
            }.bind(this);
            event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:fire, wait:delay});
        };

        return ShipCannon;
    });
