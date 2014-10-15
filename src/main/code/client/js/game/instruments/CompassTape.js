"use strict";

define(['game/parts/CanvasDigit'], function(CanvasDigit) {

    var CompassTape = function(entity, display, instrumentData) {
        this.entity = entity;
        this.display = display;
        this.data = instrumentData;
        this.txcoords = instrumentData.txcoords;
        this.sources = instrumentData.sources;
        this.coordX = this.data.txcoords[0];
        this.coordY = this.data.txcoords[1];
        this.img = this.display.materialMap.emitImg;
        this.ctx = this.display.materialMap.ctx;

        return this;
    };

    CompassTape.prototype.updateInstrument = function() {
        this.updateCompassTape(this.entity.instruments.gyro_compass.getValue());
    };


    CompassTape.prototype.updateCompassTape = function(value) {

        var pixelsPerRad = 115;
        var pixelsPerLine = 24;
        // console.log(pitchAngle.data[0])
        var pixelTranslate = pixelsPerRad * -value;

        var lines = this.data.lines;

        var lineShift = Math.ceil(pixelTranslate/(pixelsPerLine*0.5)); // - lines*0.5;

        CanvasDigit.setSourceData(this.sources, this.img, this.ctx);

        var line = 0;
        for (var i = lineShift; i < lines+lineShift; i++) {
            var transpose = pixelTranslate-pixelsPerLine*(i- lines*0.5);
            var angle = pixelTranslate-(pixelsPerLine* ((i+lineShift*0.5) -lines*0.5));
            var sourceCoords = this.sources['dots'];
            var lineX = (pixelTranslate+transpose);
            this.ctx.drawImage(this.img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], this.coordX + lineX -sourceCoords[2]*0.5,this.coordY -sourceCoords[3]-0.5,sourceCoords[2],sourceCoords[3]);

            var angValue = ""+Math.abs(Math.round(angle*3)*10);

            if (line < lines-1 && line != 0) {
                if (angValue == '0') angValue = "00";
                CanvasDigit.drawNumberToContextCoordinate([angValue[0], angValue[1]], this.coordX -4 + lineX, -3 +this.coordY)
            }
            line +=1;
        }
    }

    return CompassTape;
});