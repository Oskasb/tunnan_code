"use strict";

define([
    "application/EventManager",
    "game/GameConfiguration",
    'game/ModelDefinitions',
//    '3d/WorldParticles',
	'goo/math/Vector3',
	'goo/entities/SystemBus'
], function(
    event,
    gameConfig,
    modelDefinitions,
 //   WorldParticles,
	Vector3,
	SystemBus
    ) {

	var hitVec = new Vector3();
	var hitNorm = new Vector3();

    function addBlackSmoke(parentGooEntity) {

        var getAxisVel=function(step, axisDir) {
            return 4*axisDir*(0.2*step+1)+5*(Math.random()-0.5)
        };

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:[p[0]+d[0]*(1+step)*0.2, p[1]+d[1]*(1+step)*0.2, p[2]+d[2]*(1+step)*0.2],
                d:[getAxisVel(step, d[0]), getAxisVel(step, d[1]), getAxisVel(step, d[2])],
                w:step*65
            }
        };


        var handleBlackPuff = function(e) {
            smokeSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().PUFF_BLACK_SMOKE, handleBlackPuff);
        };

        var smokeSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.black_puff, effectSpawnRules, systemReadyCallback);

    }

    function addWhiteSmoke(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:[p[0]+d[0]*(1+step)*0.1, p[1]+d[1]*(1+step)*0.1, p[2]+d[2]*(1+step)*0.1],
                d:[5*d[0]*(1+step), 5*d[1]*(1+step), 5*d[2]*(1+step)],
                w:step*45
            }
        };


        var handlePuff = function(e) {
            smokeSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().PUFF_WHITE_SMOKE, handlePuff);
        };

        var smokeSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.white_puff, effectSpawnRules, systemReadyCallback);

    }


    function addSmallWhitePuff(parentGooEntity) {

        var getAxisPos=function(axisDir) {
            return 3*axisDir+1*(Math.random()-0.5)
        };

        var getAxisVel=function(axisDir) {
            return 5*axisDir+3*(Math.random()-0.5)
        };

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:[p[0]+getAxisPos(d[0]), p[1]+ getAxisPos(d[1]), p[2]+getAxisPos(d[2])],
                d:[getAxisVel(d[0]), getAxisVel(d[1]), getAxisVel(d[2])],
                w:0
            }
        };


        var handlePuff = function(e) {
            smokeSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().PUFF_SMALL_WHITE, handlePuff);
        };

        var smokeSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.small_puff, effectSpawnRules, systemReadyCallback);

    }

    function addClouds(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {

            return {
                p:p,
                d:d,
                w:0
            }
        };

        var handlePuff = function(e) {
            smokeSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().PUFF_CLOUD_VAPOR, handlePuff);
        };

        var smokeSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.cloud_puff, effectSpawnRules, systemReadyCallback);
    }

    function addAcrobatSmoke(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {

            return {
                p:[p[0]+(Math.random()*-0.5)*2, p[1]+(Math.random()*-0.5)*2, p[2]+(Math.random()*-0.5)*2],
                d:[d[0]*(1+step), d[1]*(1+step), d[2]*(1+step)],
                w:0
            }
        };


        var handlePuff = function(e) {
       //     smokeSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);

			var effectData = {
				lifespan:Math.random()*Math.random()*40*Math.random()*Math.random()
			};
			hitVec.set(event.eventArgs(e).pos);
			hitNorm.set(event.eventArgs(e).dir);
			SystemBus.emit('playEffect', {effectName:'white_smoke_stream', pos:hitVec, vel:hitNorm, effectData:effectData});

        };


   //     var systemReadyCallback = function() {
            event.registerListener(event.list().ACROBATIC_SMOKE, handlePuff);
   //     };
    //    var smokeSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.acrobatic_puff, effectSpawnRules, systemReadyCallback);

    }

        function addFireFlash(parentGooEntity) {

        var getAxisVel=function(step, axisDir) {
            return 20*axisDir*step+5*(Math.random()-0.5)
        };

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:[p[0]+d[0]*(1+step)*0.5, p[1]+d[1]*(1+step)*0.5, p[2]+d[2]*(1+step)*0.5],
                d:[getAxisVel(step, d[0]), getAxisVel(step, d[1]), getAxisVel(step, d[2])],
                w:step*25
            }
        };

        var handleMuzzleFire = function(e) {
            fireSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };


            var systemReadyCallback = function() {
                event.registerListener(event.list().FLASH_MUZZLE_FIRE, handleMuzzleFire);
            };


            var fireSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.muzzle_flash, effectSpawnRules, systemReadyCallback);

        }

    function addSparkFlash(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:p,
                d:d,
                w:step*35
            }
        };



        var handleSparks = function(e) {
            system.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().FLASH_SPARKS, handleSparks);
        };

        var system = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.spark_flash, effectSpawnRules, systemReadyCallback);
    }

    function addShockwaveFlash(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:p,
                d:d,
                w:step*5
            }
        };


        var handleShockwave = function(e) {
			SystemBus.emit('playParticles', {effectName:'shockwave_fire', pos:event.eventArgs(e).pos, vel:event.eventArgs(e).dir, effectData:{}});

		//	system.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().FLASH_SHOCKWAVE, handleShockwave);
        };

        var system = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.shockwave_hit, effectSpawnRules, systemReadyCallback);

    }

    var splashProb = 1;
    var splashTimeout;

    function playWaterSound(pos) {
        var selection =  Math.floor(Math.random()*4);

        if (Math.random() < splashProb) {
            event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()["SPLASH_"+selection], pos:pos, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
            splashProb*=0.5
            clearTimeout(splashTimeout);
            splashTimeout = setTimeout(function() {
                splashProb = 1;
            },200)
        }

    }

    function addWaterSplashes(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:[p[0],p[1]+(d[1]*step * (0.7+Math.random()*0.3)), p[2]],
                d:[d[0], 0.01 + 0.5*((step-1)*count*d[1] - 0.5*(d[1]*(2*step-1)*count)), d[2]],
                w:step*40
            }
        };


        var handleSplash = function(e) {
            playWaterSound(event.eventArgs(e).pos);
			hitVec.set(event.eventArgs(e).pos);
			hitNorm.set(0, 3, 0);
			SystemBus.emit('playEffect', {effectName:'splash_water', pos:hitVec, vel:hitNorm});

	        //    waterSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

    //    var systemReadyCallback = function() {
            event.registerListener(event.list().SPLASH_WATER, handleSplash);
    //    };

     //   var waterSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.water_splash, effectSpawnRules, systemReadyCallback);
    }

    function addWakeRinglets(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:p,
                d:d,
                w:0
            }
        };


        var handleDrop = function(e) {
            system.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().SPLASH_RINGLET, handleDrop);
        };

        var system = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.water_ringlet, effectSpawnRules, systemReadyCallback);
    }

    function addWakefoam(parentGooEntity) {

        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:p,
                d:d,
                w:0
            }
        };


        var handleDrop = function(e) {
            system.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().SPLASH_FOAM, handleDrop);
        };

        var system = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.water_foam, effectSpawnRules, systemReadyCallback);
    }

    function addRapidWhitePuff(parentGooEntity) {
    /*
        var getAxisPos=function(axisDir) {
            return 3*axisDir+1*(Math.random()-0.5)
        };

        var getAxisVel=function(axisDir) {
            return 5*axisDir+3*(Math.random()-0.5)
        };
    */
        var effectSpawnRules = function(p, d, step, count) {
            return {
                p:p,
                d:d,
                w:0
            }
        };


        var handlePuff = function(e) {
            smokeSystem.playEffect(event.eventArgs(e).pos, event.eventArgs(e).count, event.eventArgs(e).dir);
        };

        var systemReadyCallback = function() {
            event.registerListener(event.list().PUFF_RAPID_WHITE, handlePuff);
        };

        var smokeSystem = new WorldParticles(parentGooEntity, modelDefinitions.GOO_PARTICLES.rapid_puff, effectSpawnRules, systemReadyCallback);

    }


    function addWorldParticles(parent) {
    //    addSmallWhitePuff(parent);
    //    addRapidWhitePuff(parent);
        addWaterSplashes(parent);
    //    addBlackSmoke(parent);
    //    addFireFlash(parent);
    //    addWhiteSmoke(parent);
    //    addShockwaveFlash(parent);
    //    addSparkFlash(parent);
        addAcrobatSmoke(parent);
    //    addClouds(parent);
    //    addWakeRinglets(parent);
    //    addWakefoam(parent);
    }


    return {
        addWorldParticles:addWorldParticles
    }

});
