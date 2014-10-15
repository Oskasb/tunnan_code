"use strict";

define(function() {

    var Horizon = function(boneId, axisAmp, orient) {
        this.boneId = boneId;
        this.axisAmp = axisAmp;
        this.orient = orient;
    };

    Horizon.prototype.setTranslation = function(translation) {

    };

    Horizon.prototype.getBoneId = function() {
        return this.boneId;
    };

    Horizon.prototype.getOrient = function() {
        return this.orient;
    };

    return Horizon;
})