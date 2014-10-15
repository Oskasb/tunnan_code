"use strict";

define(function() {

    var VdiLadder = function(entity, display, instrumentData) {
        this.entity = entity;
        this.display = display;
        this.txcoords = instrumentData.txcoords;
        this.sources = instrumentData.sources;
        return this;
    };

    VdiLadder.prototype.updateInstrument = function() {
        updateVdiHorizon(this.entity, this);
    };


    function updateVdiHorizon(entity, instrument) {

        var txcoords = instrument.txcoords;
        var screen = instrument.display;
    //    var meshName = screen.ref;

        var img = instrument.display.materialMap.emitImg;
        var ctx = instrument.display.materialMap.ctx;


        var a = 0.15+Math.random()*0.25
        var g = 35+Math.random()*10;
        ctx.fillStyle = 'rgba(5, '+Math.floor(g)+', 5, '+a+')';
     //   ctx.globalCompositeOperation = 'source-over';
        ctx.fillRect(txcoords[0]-txcoords[2]*0.5,txcoords[1]-txcoords[3]*0.5,txcoords[2],txcoords[3]);

    //    ctx.globalCompositeOperation = 'lighter';

        var x = txcoords[0];
        var y = txcoords[1];

        var pitchAngle = entity.instruments.horizon.getValue();
        if (!pitchAngle) return;

        var angleInRadians = entity.instruments.roll_indicator.getValue()*entity.instruments.roll_indicator.axisAmp; //  Math.PI*Math.sin(new Date().getTime()*0.001);
        ctx.translate(x, y);
        ctx.rotate(angleInRadians);

        var pixelsPerRad = 200;
        var pixelsPerLine = 35;
        // console.log(pitchAngle.data[0])
        var pixelTranslate = pixelsPerRad * pitchAngle.data[2];

        var lines = 7;

        var lineShift = Math.ceil(pixelTranslate/(pixelsPerLine*0.5)) // - lines*0.5;

        var addSky = true;

        for (var i = lineShift; i < lines+lineShift; i++) {
            var transpose = pixelTranslate-pixelsPerLine*(i- lines*0.5);
            var upDown = pixelTranslate-(pixelsPerLine* ((i+lineShift*0.5) -lines*0.5));
            var ptx = (pixelTranslate+transpose);

            if (Math.abs(upDown) < pixelsPerLine*0.5) {
                var sourceCoords = instrument.sources['flat']


                ctx.fillStyle = 'rgba(0, 15, 0, 0.55)';
                //    ctx.globalCompositeOperation = 'source-over';

                var ptx = (pixelTranslate+transpose)
                var dCs = [txcoords[0]-txcoords[2]*0.5, txcoords[1]+txcoords[3]*0.5, txcoords[2], txcoords[3]]
                ctx.fillRect( -dCs[2]*0.5-30,   -dCs[3]*0.5-0.5,   dCs[2]+60,    dCs[3]*0.5 +ptx*1.00);
            //    ctx.globalCompositeOperation = 'lighter';

                ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], -sourceCoords[2]*0.8, ptx -sourceCoords[3]-0.5,sourceCoords[2]*1.6,sourceCoords[3]);
                addSky = false;
            } else if (upDown < 0) {
                var sourceCoords = instrument.sources['up']
                ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], -sourceCoords[2]*(0.5), ptx -sourceCoords[3]*0.5,sourceCoords[2],sourceCoords[3]);
            } else {
                addSky = false;
                var sourceCoords = instrument.sources['down']
                ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], -sourceCoords[2]*(0.5), ptx -sourceCoords[3]*0.5,sourceCoords[2],sourceCoords[3]);
            }



        }

        ctx.rotate(-angleInRadians);
        ctx.translate(-x, -y);

        sourceCoords = instrument.sources['origin']
        ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], x-sourceCoords[2]*0.5, y+5-sourceCoords[3]*0.5, sourceCoords[2],sourceCoords[3]);
        sourceCoords = instrument.sources['o_line']
        ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], x-txcoords[2]*0.5+18, y+4-sourceCoords[3]*0.5, sourceCoords[2],sourceCoords[3]);
        ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], x+txcoords[2]*0.5-40, y+4-sourceCoords[3]*0.5, sourceCoords[2],sourceCoords[3]);

        if (addSky) {
            ctx.fillRect(txcoords[0]-txcoords[2]*0.5, txcoords[1]-txcoords[3]*0.5, txcoords[2], txcoords[3]);
        //    ctx.globalCompositeOperation = 'lighter';
        }
    }

    return VdiLadder;
});