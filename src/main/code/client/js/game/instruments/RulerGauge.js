"use strict";

define(function() {

    var RulerGauge = function(entity, display, instrumentData) {
        this.entity = entity;
        this.display = display;
        this.data = instrumentData;
        this.txcoords = instrumentData.txcoords;
        this.sources = instrumentData.sources;
        return this;
    };

    RulerGauge.prototype.sampleSourceValue = function() {
        return this.entity.instruments[this.data.sourceValue].getValue();
    };

    RulerGauge.prototype.updateInstrument = function() {
        updateRulerGauge(this, this.sampleSourceValue());
    };


    function updateRulerGauge(instrument, sampledValue) {
        var txcoords = instrument.data.txcoords;

        var img = instrument.display.materialMap.emitImg;
        var ctx = instrument.display.materialMap.ctx;


        var x = txcoords[0];
        var y = txcoords[1];

        var pixelsPerRad = instrument.data.scaleFactor;

        var pixelTranslate = pixelsPerRad * -sampledValue;

        var sourceCoords = instrument.data.sources.ruler;

        ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], x-sourceCoords[2]*0.5,y -sourceCoords[3]*0.5,sourceCoords[2],sourceCoords[3]);

        var lineX = pixelTranslate;

        var n1coords = instrument.data.sources.arrow;

        ctx.drawImage(img,n1coords[0],n1coords[1],n1coords[2],n1coords[3], x + instrument.data.xOffset  -n1coords[2]*0.5,y + lineX -n1coords[3]*0.5,n1coords[2],n1coords[3]);

    }

    return RulerGauge;
});