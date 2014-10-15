"use strict";

define([
    "application/EventManager",
    'goo/renderer/Texture'
],     function(event,
                Texture
    ) {

    var Screen = function(id, ref, txcoords, sources, materialMap) {
        this.id = id;
        this.ref = ref;
        this.txcoords = txcoords;
        this.sources = sources;
        this.materialMap = materialMap;
        this.intensity = 1;
    };

    Screen.prototype.setIntensity = function(intensity) {
        this.intensity = intensity;
    };

    return Screen;

});