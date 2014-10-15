"use strict";

define([
    "application/EventManager",
    'goo/math/Vector3',
    '3d/GooEffectController'
], function(
    event,
    Vector3,
    GooEffectController
    ) {

    var WorldParticles = function(parentGooEntity, particleDefinition, effectSpawnRules, callback) {
        this.particleDensity = 90*GooEffectController.getSettingParam("particles", "highDensity")+10;
        this.effectSpawnRules = effectSpawnRules;
        this.particleDefinition = particleDefinition;
        this.createEffect(parentGooEntity, particleDefinition, callback);
        this.points = [];
        this.velocities = [];
        this.endTimeout = null;
        this.particleEntity = null;
    };

    WorldParticles.prototype.playEffect = function(pos, count, dir) {
        var instance = this;

        var spawnEffect = function(p, d, wait) {
            setTimeout(function() {
                instance.startEmission();
                instance.addEffectPoint(p, d);
            }, wait)
        };

        for (var e = 0; e < count; e++) {
            var sr = this.effectSpawnRules(pos, dir, e, count);
            spawnEffect([sr.p[0], sr.p[1], sr.p[2]], [sr.d[0], sr.d[1], sr.d[2]], sr.w)
        }
    };

    WorldParticles.prototype.addEffectPoint = function(pos, vel) {

        if (Math.random()*this.particleDensity < this.points.length) {
            this.points.shift();
            this.velocities.shift();
         /*
            if (Math.random()*this.particleDensity*0.1 < this.points.length) {
                this.points.shift();
                this.velocities.shift();
            }
        */
        //    return;
        }

        this.velocities.push(vel);
        this.points.push({pos:pos});
    };

    WorldParticles.prototype.endEmission = function() {
        var instance = this;

        for (var i = 0; i < this.particleComp.emitters.length; i++) {
            this.particleComp.emitters[i].enabled = false;
        }

        clearTimeout(this.endTimeout);

        var stopComponent = function() {
            this.particleComp.enabled = false;
            this.particleEntity.removeFromWorld();
        }.bind(this);

        this.endTimeout = setTimeout(function() {
            stopComponent();
        }, instance.particleDefinition.emitters[0].maxLifetime*1500 )
    };

    WorldParticles.prototype.startEmission = function() {
        //    console.log("Splash: ", pos)
        this.particleEntity.addToWorld();
        clearTimeout(this.endTimeout);
        this.particleComp.enabled = true;

        for (var i = 0; i < this.particleComp.emitters.length; i++) {
            this.particleComp.emitters[i].enabled = true;
        }
    };

    WorldParticles.prototype.getEmissionVelocity = function(particle) {
    //    console.log(this.velocities[1])
        var dir = this.velocities.pop() || [0,0,0];
        //      var velocity = new Vector3(dir[0], -dir[2], dir[1]);
    /*
        if (this.velocities.length > this.particleDensity) {
            this.velocities = [this.velocities[0]];
            //    alert("PARTICLE EMISSIONS OVERFLOWING")
        }
    */
          particle.velocity.set(dir[0], dir[1], dir[2])
        return particle.velocity
    };

    WorldParticles.prototype.getEmissionPosition = function(particle, pEnt) {
        var position = particle.position;



        if (this.points.length == 0) {
            var pos = [0,-999,0];
            this.endEmission();
        //    console.log("End Emission:", this.points.length)
        } else {
       //     console.log("Particles left:", this.points.length)
            var puff = this.points.pop();
            var pos = puff.pos;
            var size = puff.size;
       /*
            if (this.points.length > this.particleDensity) {
       //         console.log("PARTICLE EMISSIONS OVERFLOWING", this.particleDefinition.name, this.points.length, this);
                this.points = [this.points[0]];
                this.velocities = [];
            //    alert("PARTICLE EMISSIONS OVERFLOWING")
            }
       */
        }
        position.set(pos[0], pos[1], pos[2]);


        return position;
    };

    WorldParticles.prototype.createEffect = function(parentGooEntity, particleDefinition, systemReadyCB) {
        var instance = this;

        var getEmitVel = function(particle, pEnt) {
            return instance.getEmissionVelocity(particle, pEnt)
        };

        var getEmitPos = function(particle, pEnt) {
            return instance.getEmissionPosition(particle, pEnt)
        };


        var emitFunctions = {
            velocity:getEmitVel,
            position:getEmitPos
        };

        if (particleDefinition.billboard) {
            var bbx = new Vector3(particleDefinition.billboard.bbx);
            var bby = new Vector3(particleDefinition.billboard.bby);

            var getEmissionOrientation = function(particle, pEnt) {
                particle.bbX.set(bbx);
                particle.bbY.set(bby);
            };

            emitFunctions.orientation = getEmissionOrientation;
        }

        var callback = function(entity) {
            instance.particleEntity = entity;
            instance.particleComp = entity.particleComponent;
            var sumReleaseRate = 0;
            for (var i = 0; i < instance.particleComp.emitters.length; i++) {
                sumReleaseRate += instance.particleComp.emitters[i].releaseRatePerSecond;
            }
            instance.particleComp.maxReleaseRate = sumReleaseRate;
        //    instance.particleComp.enabled = true;
            systemReadyCB();
        };

        setTimeout(function() {
        //    event.fireEvent(event.list().BUILD_GOO_PARTICLES, {parentGooEntity:parentGooEntity, systemParams:particleDefinition, emitFunctions:emitFunctions,  callback:callback});
        }, 0)
    };

    return WorldParticles
});
