"use strict";

define([
    '3d/GooJointAnimator'
],
    function(
        GooJointAnimator
        ) {

        var Flag = function(shipEntity, flagData) {
            this.boat = shipEntity;
            this.baseBone = flagData.baseBone;
            this.flapBone = flagData.flapBone;
            this.flapFreq = flagData.flapFreq;
            this.direction = 0;
            this.posY = 0;
        };

        Flag.prototype.updateFlag = function() {
            this.direction+=this.flapFreq*0.02;
        //    console.log(this.boat, this.baseBone)
            GooJointAnimator.updateEntityBoneRotX(this.boat, this.baseBone, 0.3*Math.sin(this.direction+(Math.cos(this.direction*0.5))));
            GooJointAnimator.updateEntityBoneRotX(this.boat, this.flapBone, 0.6*Math.sin(this.direction+(0.5+Math.cos(this.direction*0.4)*0.4)));
        };

        return Flag;
    });