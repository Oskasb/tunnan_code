"use strict";

define(['game/parts/CanvasDigit'], function(CanvasDigit) {

    var ScreenDigits = function(entity, display, instrumentData) {
        this.entity = entity;
        this.display = display;
        this.data = instrumentData;
        this.txcoords = instrumentData.txcoords;
        this.coordX = this.data.txcoords[0];
        this.coordY = this.data.txcoords[1];
        this.sources = instrumentData.sources;
        this.img = this.display.materialMap.emitImg;
        this.ctx = this.display.materialMap.ctx;
        return this;
    };

    ScreenDigits.prototype.sampleSourceValue = function() {
        return this.entity.instruments[this.data.sourceValue].getValue();
    };

    ScreenDigits.prototype.updateScreenDigits = function(sampledValue) {
        if (sampledValue < 1) return;
        CanvasDigit.setSourceData(this.data.sources, this.img, this.ctx);
        CanvasDigit.drawNumberToContextCoordinate(''+Math.round(sampledValue), this.coordX, this.coordY);
    };

    ScreenDigits.prototype.updateInstrument = function() {
        this.updateScreenDigits(this.sampleSourceValue());
    };

    return ScreenDigits;
});