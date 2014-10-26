"use strict";

define([
    "game/GameConfiguration",
	"data_pipeline/PipelineAPI",
    "game/weapons/Bullet",
    "application/EventManager",
    'game/GameUtil',
    'goo/math/Vector3'
],
    function(
        gameConfig,
		PipelineAPI,
        Bullet,
        event,
        gameUtil,
        Vector3
        ) {

        var PlaneCannon = function(planeEntity, cannonDataId, weaponSystemData, bulletId) {
            this.planeEntity = planeEntity;
			this.posOffset = weaponSystemData.posOffset;


			this.attachCannonData(cannonDataId);
			this.attachBulletData(bulletId);

            this.elevation = 48;
            this.currentState = 0;

            this.targetState = 0;
            this.firing = false;
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


        PlaneCannon.prototype.playFireParticles = function() {
            this.flameEffect.enabled = true;
            for (var i = 0; i < this.flameEffect.emitters.length; i++) {
                this.flameEffect.emitters[i].enabled = true;
            }
            var endflame = function() {
                for (var i = 0; i < this.flameEffect.emitters.length; i++) {
                    this.flameEffect.emitters[i].enabled = false;
                }
            }.bind(this);
            event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:endflame, wait:120});
        };

        PlaneCannon.prototype.playSmokeParticles = function() {

            this.smokeEffect.enabled = true;
            //    this.flameEffect.recreateParticles();
        //    console.log(this.smokeEffect.enabled)

            for (var i = 0; i < this.smokeEffect.emitters.length; i++) {
                this.smokeEffect.emitters[i].enabled = true;
            }

            var endsmoke = function() {

                for (var i = 0; i < this.smokeEffect.emitters.length; i++) {
                    this.smokeEffect.emitters[i].enabled = false;
                }


            }.bind(this);



            event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:endsmoke, wait:120});

        };

        PlaneCannon.prototype.playFireSound = function(pos, dir) {
            var selection =  Math.floor(Math.random()*this.data.onFireSounds.length);
            event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()[this.data.onFireSounds[selection]], pos:pos, vel:this.planeEntity.spatial.velocity.data, dir:dir.data});
        };



        PlaneCannon.prototype.addMuzzleFlame = function() {
            var pos = this.posOffset;
            var planeEntity = this.planeEntity;
            var vel = this.lastBulletVelocity;

            var getVel = function() {
                return vel;
            };
            var getEnt = function() {
                return planeEntity;
            };
            var getEmissionPosition = function(particle) {
                var random = Math.random()-0.5;
                particle.position.seta(pos);
                particle.position.add_d(0.25*(Math.random()-0.5), 0.25*( Math.random()-0.5), random*0.7);
                return particle.position
            };

            var spatial = this.planeEntity.spatial;
            var getEmissionVelocity = function(particle) {
                particle.velocity.set(getVel());
                particle.velocity.mul(0.07 + 0.08*Math.random());
            //    particle.velocity.mul(1*(1/(getEnt().spatial.frameTime/10)));
                particle.velocity.add(getEnt().spatial.velocity);
                particle.velocity.mul(gameConfig.RENDER_SETUP.physicsFPS);


                //    particle.velocity = gameUtil.applyRotationToVelocity(getEnt(), particle.velocity);
                return particle.velocity
            };

            var emitFunctions = {
                velocity:getEmissionVelocity,
                position:getEmissionPosition
            };

            var callback = function(entity) {
                this.flameEffect = entity.particleComponent;
                var sumReleaseRate = 0;
                for (var i = 0; i < this.flameEffect.emitters.length; i++) {
                    sumReleaseRate += this.flameEffect.emitters[i].releaseRatePerSecond;
                }
                this.flameEffect.maxReleaseRate = sumReleaseRate;
            }.bind(this);
                       //     console.log(this.planeEntity.geometries[0])
        //    event.fireEvent(event.list().BUILD_GOO_PARTICLES, {parentGooEntity:this.planeEntity.geometries[0], systemParams:this.data.flameEffect, emitFunctions:emitFunctions,  callback:callback});
        };


        PlaneCannon.prototype.addMuzzleSmoke = function() {
            var pos = this.posOffset;
            var planeEntity = this.planeEntity;

            var getEnt = function() {
                return planeEntity;
            };

            var getEmissionPosition = function(particle) {
                particle.position.seta(pos);
                particle.position.add_d(0.45*(Math.random()-0.5), 0.45*( Math.random()-0.5), 5.3*(Math.random()-0.5));
            //    particle.position = gameUtil.applyRotationToVelocity(getEnt(), particle.position);
                return particle.position;
            };


            var vel = this.lastBulletVelocity;

            var getVel = function() {
                return vel;
            };

            var getEmissionVelocity = function(particle) {
                particle.velocity.set(getVel());

                particle.velocity.mul((0.25+Math.random()*2.51)*(1/gameConfig.RENDER_SETUP.physicsFPS));
                particle.velocity.add(getEnt().spatial.velocity);
                particle.velocity.add(0.05*(Math.random()-0.5), 0.05*(Math.random()-0.5), 0.1*(Math.random()-0.5));
                particle.velocity.mul(gameConfig.RENDER_SETUP.physicsFPS);
                return particle.velocity
            };

            var emitFunctions = {
                velocity:getEmissionVelocity,
                position:getEmissionPosition
            };

            var callback = function(entity) {
                this.smokeEffect = entity.particleComponent;
                var sumReleaseRate = 0;
                for (var i = 0; i < this.smokeEffect.emitters.length; i++) {
                    sumReleaseRate += this.smokeEffect.emitters[i].releaseRatePerSecond;
                }
                this.smokeEffect.maxReleaseRate = sumReleaseRate;
            }.bind(this);
            //     console.log(this.planeEntity.geometries[0])
        //    event.fireEvent(event.list().BUILD_GOO_PARTICLES, {parentGooEntity:this.planeEntity.geometries[0], systemParams:this.data.smokeEffect, emitFunctions:emitFunctions,  callback:callback});
        };

        PlaneCannon.prototype.createBullet = function() {
			var cannonSpread = 0.1;
			var pos = new Vector3();
			pos.setv(this.planeEntity.spatial.pos);
			var posOffset = gameUtil.applyRotationToVelocity(this.planeEntity.geometries[0], new Vector3(this.posOffset));

			pos.addv(posOffset);
			var exitVelocity = new Vector3(0, this.elevation*(1 / gameConfig.RENDER_SETUP.physicsFPS), this.data.exitVelocity*(1 / gameConfig.RENDER_SETUP.physicsFPS));
			exitVelocity = gameUtil.applyRotationToVelocity(this.planeEntity.geometries[0], exitVelocity);
			exitVelocity.add(this.planeEntity.spatial.velocity);
			exitVelocity.add_d(cannonSpread*(Math.random() -0.5), cannonSpread*(Math.random() -0.5), cannonSpread*(Math.random() -0.5));

            var hitCallback = function(bulletSpatial, something) {
                    //            console.log("Cannan hit!", something);
            };
        //    console.log(exitVelocity)
            this.lastBulletVelocity.set(exitVelocity);
            new Bullet(pos, exitVelocity, this.bulletData, this.data, hitCallback, this.planeEntity.id, this.planeEntity.geometries[0]._world.tpf);
            this.playFireSound(pos, exitVelocity);
        };

        PlaneCannon.prototype.fire = function() {
            this.createBullet();

       //     this.playFireParticles();
       //     this.playSmokeParticles();
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
            if (!this.flameEffect) {
            //    this.addMuzzleFlame();
            //    this.addMuzzleSmoke();
            }
    //        console.log("SetWeaponTrigger: ", value, step, total)
            this.currentState = value;
            if (!value) return 0;
            var delay = step * this.cooldownTime/total;
            this.sequenceShot(delay);
            return this.currentState;
        };

        return PlaneCannon;
    });
