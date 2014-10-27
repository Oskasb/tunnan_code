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
            this.puffIntensity = 0.01;
            this.posOffset = chimneyData.posOffset;

			this.effectData = {
				color:[0,0,0,1],
				gravity:2,
				strength:25,
				acceleration:0.98,
				growthCurve:[[0, 1],[0.1, 0.5], [1,0]],
				alphaCurve:[[0, 0.4],[0.1, 0.1], [1,0]],
				spread:0.5
			};

		};


        Chimney.prototype.setChimneyIntensity = function(intensity) {
            this.puffIntensity = intensity;
        };

        Chimney.prototype.updateChimney = function() {

			if (Math.random() < this.puffIntensity) {
				calcVec.set(this.posOffset);
				calcVec2.set( this.boat.spatial.pos);
				gameUtil.applyRotationToVelocity(this.boat.geometries[0], calcVec);
				calcVec2.addv(calcVec);
				calcVec.set(0, 4, 0);
				SystemBus.emit("playParticles", {effectName:'white_smoke_stream' ,pos:calcVec2, vel:calcVec, effectData:this.effectData});
			}
        };

        return Chimney;
    });