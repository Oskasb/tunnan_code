"use strict";

define([
    "application/EventManager",
    'goo/renderer/Texture'
],     function(event,
                Texture
    ) {

    var Display = function(id, mapcoords, materialMap) {
        this.id = id;
        this.mapcoords = mapcoords;
        this.materialMap = materialMap;
		this.materialMap.ctx.globalCompositeOperation = 'source-over';
        this.intensity = 1;
        this.instruments = {};
        return this;
    };

    Display.prototype.setIntensity = function(intensity) {
        this.intensity = intensity;
    };

    Display.prototype.attenuate = function(masterIntensity) {
        var txcoords = this.mapcoords;
        var ctx = this.materialMap.ctx;
        var attenaution = 1 - (this.intensity * masterIntensity+Math.random()*0.03);
        ctx.fillStyle = 'rgba(0, 0, 0, '+attenaution+')';

        ctx.fillRect(txcoords[0]-txcoords[2]*0.5,txcoords[1]-txcoords[3]*0.5,txcoords[2],txcoords[3]);
        this.materialMap.emissiveMap.setNeedsUpdate();
    };


    Display.prototype.registerInstrument = function(id, instrument) {
        this.instruments[id] = instrument;
    };

    Display.prototype.updateInstruments = function() {
        for (var index in this.instruments) {
            this.instruments[index].updateInstrument();
        }
    };

    return Display;

});