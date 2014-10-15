"use strict";

define([
    '3d/GooJointAnimator'
],
    function(
             GooJointAnimator
        ) {

        var Radar = function(shipEntity, radarData) {
            this.boat = shipEntity;
            this.pivotBoneId = radarData.bonePivot;
            this.rotVel = radarData.rotVel;
            this.direction = 0;
        };

        Radar.prototype.stopRadar = function() {
            this.rotVel = 0;
        };

        Radar.prototype.updateRadar = function() {
            this.direction+=this.rotVel;
            GooJointAnimator.updateEntityBoneRotX(this.boat, this.pivotBoneId, this.direction);
        };

        return Radar;
    });