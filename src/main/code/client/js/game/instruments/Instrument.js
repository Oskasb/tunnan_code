"use strict";

define(function() {



    var Instrument = function(id, axisAmp, sample, curve, boneName) {
        this.id = id;
        this.curve = curve;
        this.sample = sample;
        this.boneName = boneName;
        this.axisAmp = axisAmp;
        this.value = null;
    };



    Instrument.prototype.setValue = function(value) {
         this.value = value;
    };

    Instrument.prototype.getValue = function() {
        return this.value;
    };

    Instrument.prototype.applyVector = function(vec3) {
        return [vec3.data[this.axisAmp[0][0]] * this.axisAmp[0][1],
            vec3.data[this.axisAmp[1][0]] * this.axisAmp[1][1],
            vec3.data[this.axisAmp[2][0]] * this.axisAmp[2][1]];
    };

    Instrument.prototype.getBoneName = function() {
        return this.boneName;
    };

    return Instrument;
});