"use strict";

define([
	'goo/entities/SystemBus',
    "application/EventManager",
    'game/GameUtil',
    "goo/math/Vector3"
],
    function(
		SystemBus,
		event,
        gameUtil,
        Vector3
        ) {

        var calcVec = new Vector3();
		var calcVec2 = new Vector3();


        var Chimney = function(shipEntity, chimneyData) {
            this.boat = shipEntity;
            this.puffIntensity = 0.15;
            this.posOffset = chimneyData.posOffset;

			this.shortest = 0.1;
			this.longest = 35;

			this.effectData = {
				"color0":[0.01,0.01, 0.01],
				"color1":[0.3,0.3, 0.3],
				"count":1,
				"opacity":[0.3, 0.9],
				"alpha":"oneToZero",
				"growthFactor":[1.1, 3],
				"growth":"oneToZero",
				"stretch":0.4,
				"strength":25,
				"spread":0.5,
				"acceleration":0.99,
				"gravity":1,
				"rotation":[0,7],
				"spin":"oneToZero",
				"size":[1.1,2.3],
				"lifespan":[this.shortest, this.longest],
				"spinspeed":[-0.1, 0.1],
				"sprite":"smokey",
				"loopcount":1,
				"trailsprite":"projectile_1",
				"trailwidth":1
			}
		};

		Chimney.prototype.calcLifespan = function() {
			this.effectData.lifespan[1] = this.longest*Math.random()*Math.random()*Math.random()*Math.random();
		};


		Chimney.prototype.setChimneyIntensity = function(intensity) {
            this.puffIntensity = intensity;
        };

        Chimney.prototype.updateChimney = function() {

			if (Math.random() < this.puffIntensity) {
				this.calcLifespan();
				calcVec.set(this.posOffset);
				calcVec2.set( this.boat.spatial.pos);
				gameUtil.applyRotationToVelocity(this.boat.geometries[0], calcVec);
				calcVec2.addVector(calcVec);
				calcVec.set(0, 4, 0);
				SystemBus.emit("playParticles", {simulatorId:"StandardParticle" ,pos:calcVec2, vel:calcVec, effectData:this.effectData});
			}
        };

        return Chimney;
    });