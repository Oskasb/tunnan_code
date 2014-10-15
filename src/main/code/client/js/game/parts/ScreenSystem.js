"use strict";

define([],
	function() {

    var ScreenSystem = function(entity) {
        this.entity = entity;
        this.displays = {};
        this.masterIntensity = 1;
    };

    ScreenSystem.prototype.addDisplay = function(display) {
        if (this.displays[display.id]) return;
        this.displays[display.id] = display;
    };

    ScreenSystem.prototype.setMasterIntensity = function(intensity) {
        this.masterIntensity = intensity;
    };

    ScreenSystem.prototype.attenuateIntensity = function() {
		var setDarker = false;

        for (var index in this.displays) {
			if (!setDarker) {
				this.displays[index].materialMap.ctx.globalCompositeOperation = 'darker';
				setDarker = true;
			}
            this.displays[index].attenuate(this.masterIntensity);
        }
    };

    ScreenSystem.prototype.updateDisplays = function() {
		var setLighter = false;
        for (var index in this.displays) {
			if (!setLighter){
				this.displays[index].materialMap.ctx.globalCompositeOperation = 'lighter';
				setLighter = true;
			}
            this.displays[index].updateInstruments();
        }
    };

    return ScreenSystem;

});