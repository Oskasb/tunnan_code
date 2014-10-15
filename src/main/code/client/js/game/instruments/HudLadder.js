"use strict";

define(function() {

    var HudLadder = function(entity, display, instrumentData) {
        this.entity = entity;
        this.display = display;
        this.txcoords = instrumentData.txcoords;
        this.sources = instrumentData.sources;
        return this;
    };

    HudLadder.prototype.updateInstrument = function() {
        updateHudHorizon(this.entity, this);
    };


    function updateHudHorizon(entity, instrument) {

        var txcoords = instrument.txcoords;

        var img = instrument.display.materialMap.emitImg;
        var ctx = instrument.display.materialMap.ctx;

    //    ctx.globalCompositeOperation = 'lighter';

        var x = txcoords[0];
        var y = txcoords[1];

        var pitchAngle = entity.instruments.horizon.getValue();
        if (!pitchAngle) return;

        var angleInRadians = entity.instruments.roll_indicator.getValue()*entity.instruments.roll_indicator.axisAmp;  //  Math.PI*Math.sin(new Date().getTime()*0.001);
        ctx.translate(x, y);
        ctx.rotate(angleInRadians);

        var pixelsPerRad = 200;
        var pixelsPerLine = 16;
        // console.log(pitchAngle.data[0])
        var pixelTranslate = pixelsPerRad * pitchAngle.data[2];

        var lines = 5;

        var lineShift = Math.ceil(pixelTranslate/(pixelsPerLine*0.5)) // - lines*0.5;

        for (var i = lineShift; i < lines+lineShift; i++) {
            var transpose = pixelTranslate-pixelsPerLine*(i- lines*0.5);
            var upDown = pixelTranslate-(pixelsPerLine* ((i+lineShift*0.5) -lines*0.5));
            if (Math.abs(upDown) < pixelsPerLine*0.5) {
                var sourceCoords = instrument.sources['flat']

            } else if (upDown < 0) {
                var sourceCoords = instrument.sources['up']
            } else {
                var sourceCoords = instrument.sources['down']
            }


            var lineX = (pixelTranslate+transpose);
            ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], -sourceCoords[2]*0.5, lineX -sourceCoords[3]*0.5,sourceCoords[2],sourceCoords[3]);
        }

        ctx.rotate(-angleInRadians);
        ctx.translate(-x, -y);

        var sourceCoords = instrument.sources['origin']
        ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], x-sourceCoords[2]*0.5, y-3-sourceCoords[3]*0.5, sourceCoords[2],sourceCoords[3]);

    }

    return HudLadder;
});