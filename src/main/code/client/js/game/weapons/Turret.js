"use strict";

define([
    "application/EventManager",
    "goo/math/Vector3",
    "game/weapons/ShipCannon",
    "physics/TrajectoryPhysics",
    "game/GameUtil"
],
    function(event,
             Vector3,
             ShipCannon,
             trajectoryPhysics,
             GameUtil) {


        var Turret = function(shipEntity, turretData) {
            this.calcVec = new Vector3();
            this.targets = turretData.targets;
            this.baseRot = turretData.baseRot;
            this.basePos = turretData.posOffset;
            this.shipEntity = shipEntity;
            this.pivotBoneId = turretData.bonePivot;
            this.elevateJointId = turretData.boneElevate;
            this.swivel = turretData.swivel;
            this.speed = turretData.speed;
            this.direction = 0;
            this.elevation = 0;
            this.ready = true;

            this.targetEntity = null;
            this.lastDiff = [0, 0, 0];
            this.lastAimDelta = [0, 0, 0];
            this.targetAimDelta = [0, 0, 0];
            this.elevationReady = false;
            this.swivelReady = false;
            this.aimParams = {
                sidewaysness:0,
                boostElevation:0,
                targetDistance:1000,
                shotRange:1000,
                hitDistance:1000,
                newElevation:0,
                newSwivel:0
            };

            this.states = {
                idle:"idle",
                loading:"loading",
                waiting:"waiting",
                aiming:"aiming",
                ready:"ready"
            };

            this.currentState = this.states.idle;

			this.attachCannon(turretData.cannonId, turretData.posOffset, turretData.bulletData);

        };

		Turret.prototype.attachCannon = function(cannonId, posOffset, bulletId) {

			this.cannon = new ShipCannon(this.shipEntity, cannonId, posOffset, bulletId);


		};


        Turret.prototype.loadTurret = function() {
            var instance = this;
            var reloaded = function() {

                instance.currentState = instance.states.aiming;
            };
            event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:reloaded, wait:1000 / this.cannon.data.rateOfFire +Math.random()*200/this.cannon.data.rateOfFire})
        };

        Turret.prototype.handleTurretStateUpdate = function() {
            if (!this.shipEntity.combat.isAlive) return;
            if (this.targetEntity) {
                if (!this.targetEntity.combat.isAlive) {
                    this.disengageTurret();
                }
            } else {
                this.disengageTurret();
            }

            switch (this.currentState) {
                case this.states.idle:
                    this.aimParams.newElevation = 0.4;
                    this.aimParams.newSwivel = 0;

                    if (Math.round(this.direction*2000) != Math.round(this.aimParams.newSwivel*2000)) {
                        this.adjustSwivelAngle();
                        this.swivelReady = false;
                    } else {

                        this.swivelReady = true;
                        if (Math.round(this.elevation*2000) != Math.round(this.aimParams.newElevation*2000)) {
                            this.adjustElevationAngle();
                            this.elevationReady = false;
                        } else {
                            this.elevationReady = true;
                        }

                    }
                    break;
                case this.states.loading:
                    this.loadTurret();
                    this.currentState = this.states.waiting;
                    break;
                case this.states.waiting:
                    this.aimTurret();
                    break;
                case this.states.aiming:

                    if (Math.abs(this.aimParams.newSwivel) > Math.abs(this.swivel) && Math.abs(this.aimParams.newSwivel - 2*Math.PI) > Math.abs(this.swivel)) {
          //              console.log("Out of angle")
                        var instance = this;
                        var checkAgain = function() {
                            instance.currentState = instance.states.aiming;
                        };
                        event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:checkAgain, wait:5000});
                        this.currentState = this.states.waiting;
                        return;
                    }


                    if (Math.round(this.direction*2000) != Math.round(this.aimParams.newSwivel*2000)) {
                        this.adjustSwivelAngle();
                        this.swivelReady = false;
                    } else {

                        this.swivelReady = true;
                        if (Math.round(this.elevation*2000) != Math.round(this.aimParams.newElevation*2000)) {
                            this.adjustElevationAngle();
                            this.elevationReady = false;
                        } else {
                            this.elevationReady = true;
                        }

                    }

                    if (this.elevationReady && this.swivelReady) this.currentState = this.states.ready;

                    break;
                case this.states.ready:
                        this.fireTurret();
                    break;
            }
        };

        Turret.prototype.adjustElevationAngle = function() {
            var dE = this.aimParams.newElevation - this.elevation ;

            this.setElevationAngle(this.elevation+dE*0.08 );
        };

        Turret.prototype.adjustSwivelAngle = function() {
            var dS = this.aimParams.newSwivel - this.direction ;

            this.setPivotAngle(this.direction+dS*0.06);
        };

        Turret.prototype.setPivotAngle = function(rad) {
            this.direction = rad;
        };

        Turret.prototype.setElevationAngle = function(rad) {
            this.elevation = rad;
        };

        Turret.prototype.setTargetEntity = function(gameEntity) {
        //    console.log("Setting turret target: ", gameEntity);
            if (!gameEntity) {
                this.disengageTurret();
            } else {
                this.currentState = this.states.loading;
                this.targetEntity = gameEntity;
            }
        };

        Turret.prototype.disengageTurret = function() {
            //    console.log("Setting turret target: ", gameEntity);
            this.currentState = this.states.idle;
            this.targetEntity = null;

        };


        Turret.prototype.fireTurret = function() {
            var instance = this;
            var hitCallback = function(bulletSpatial, something) {
                var pos = bulletSpatial.pos;
                switch (something){
                    case 'water':
                        /*
                        event.fireEvent(event.list().SPLASH_WATER, {pos:[pos.data[0], 0, pos.data[2]], count:1+Math.round(Math.random()*instance.cannon.data.caliber*0.15), dir:[0, 3, 0]})
                        var selection =  Math.floor(Math.random()*4);
                        event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound()["SPLASH_"+selection]});
                        */
                        break;
                    case 'nothing':

                    break
                }


            };

            this.cannon.fire(this.direction+this.baseRot, this.elevation, hitCallback)
            this.currentState = this.states.loading;
        //    instance.aimTurret()
        };

        Turret.prototype.aimTurret = function() {
            var spread = 0.2*Math.random();
            var instance = this;
            var tPos = this.targetEntity.spatial.pos;
            var sPos = this.shipEntity.spatial.pos;
            var sRot = this.shipEntity.spatial.rot.toAngles();
            var distance = this.calcVec.setVector(tPos);
            var bPos = this.basePos;
            distance.subv(sPos);
            var aimRange = Math.sqrt(distance.lengthSquared());

            var targElev = trajectoryPhysics.calcElevationForTrajectory(instance.cannon.data.exitVelocity, aimRange, tPos.data[1] - sPos.data[1])+spread*(Math.random()-0.5);
            if (isNaN(targElev)) {
				this.currentState = this.states.idle;
				return;
			}
            instance.aimParams.newSwivel = GameUtil.determineYAngleFromPosAndRotToPos(sPos.data,[sRot.data[0]+spread*(Math.random()-0.5), sRot.data[1]+instance.baseRot+spread*(Math.random()-0.5), sRot.data[2]+spread*(Math.random()-0.5)], tPos.data);
            instance.aimParams.newElevation = targElev

        };

        Turret.prototype.updateTurretState = function() {
            this.handleTurretStateUpdate();
        };

    return Turret;

    });