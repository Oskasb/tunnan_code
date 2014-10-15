"use strict";

define([
    "game/GameConfiguration",
    "game/weapons/Bullet",
    'game/GameUtil',
    "application/EventManager",
    'goo/math/Vector3'
],
    function(
        gameConf,
        Bullet,
        gameUtil,
        event,
        Vector3
        ) {

        var ShipCannon = function(shipEntity, cannonData, posOffset, bulletData) {
            console.log(cannonData)
            this.boatEntity = shipEntity;
            this.name = cannonData.name;
            this.data = cannonData;
            this.posOffset = posOffset;
            this.bulletData = bulletData;
            this.currentState = 0;
            this.cooldownTime = 1000 / this.data.rateOfFire;
            this.targetState = 0;
            this.firing = false;
            this.flameEffect = null;
            this.smokeEffect = null;
            this.fireSounds = {};
            this.turretRot = this.boatEntity.geometries[0].transformComponent.transform.rotation.clone();
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
            for (var index in this.data.onFireEffects) {
                    event.fireEvent(event.list()[index], {pos:[pos.data[0], pos.data[1], pos.data[2]], count:this.data.onFireEffects[index].count, dir:[exitVelocity.data[0],exitVelocity.data[1], exitVelocity.data[2]]})
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
