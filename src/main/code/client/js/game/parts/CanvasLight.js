"use strict";

define(function() {

    var darker = 'darker';
    var sourceOver = 'source-over';
    var CanvasLight = function(meshData, txcoords, materialMap, lightSystem) {
	    this.lightSystem = lightSystem;
        this.meshData = meshData;
        this.txcoords = txcoords;
        this.materialMap = materialMap;
        this.intensity = 0;
        this.attenuation = 0;
        this.masterIntensity = 1;
        this.ctx = this.materialMap.ctx;
        this.img = this.materialMap.emitImg;
    };

    CanvasLight.prototype.adjustMasterIntensity = function(intensity) {
        this.masterIntensity = intensity;
        this.renderLightState();
    };

    CanvasLight.prototype.attenuatedFill = function(attenuation) {
        return 'rgba(0, 0, 0, '+attenuation+')';
    };

	CanvasLight.prototype.approachIntensity = function(intensity, factor) {
		this.intensity = 1/(factor+1)*(intensity+this.intensity*factor);
		this.renderLightState();
	};

    CanvasLight.prototype.setIntensity = function(intensity) {
        this.intensity = intensity;
        this.renderLightState();
    };

    CanvasLight.prototype.renderLightState = function() {
		if (this.intensity*this.masterIntensity > 0.05) {
			if (Math.abs(this.attenuation - (1- this.intensity*this.masterIntensity)) < 0.05) return;
		}
        this.lightSystem.registerAddImageRect([this.img,this.txcoords[0],this.txcoords[1],this.txcoords[2],this.txcoords[3],this.txcoords[0],this.txcoords[1],this.txcoords[2],this.txcoords[3]]);
	    this.attenuation = 1- (this.intensity*this.masterIntensity);
	    this.lightSystem.registerFillRectDarker([this.txcoords[0],this.txcoords[1],this.txcoords[2],this.txcoords[3], this.attenuatedFill(this.attenuation)]);
    };


    return CanvasLight;
});
