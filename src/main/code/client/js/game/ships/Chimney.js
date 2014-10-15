"use strict";

define([
    "application/EventManager",
    'game/GameUtil',
    "goo/math/Vector3"
],
    function(event,
             gameUtil,
             Vector3
        ) {

        var calcVec = new Vector3();

        var Chimney = function(shipEntity, chimneyData) {
            this.boat = shipEntity;
            this.puffIntensity = 0.01;
            this.posOffset = chimneyData.posOffset;
        };


        Chimney.prototype.setChimneyIntensity = function(intensity) {
            this.puffIntensity = intensity;
        };

        Chimney.prototype.updateChimney = function() {

            if (Math.random() < this.puffIntensity) {
                var shipPos = this.boat.spatial.pos;
                calcVec.set(this.posOffset);
                var pos = gameUtil.applyRotationToVelocity(this.boat.geometries[0], calcVec);
                pos.addv(shipPos);
                event.fireEvent(event.list().PUFF_BLACK_SMOKE, {pos:[pos.data[0], pos.data[1], pos.data[2]], count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
            }
        };

        return Chimney;
    });