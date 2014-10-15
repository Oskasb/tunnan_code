"use strict";

define(function() {

    var HsiRotation = function(entity, display, instrumentData) {
        this.entity = entity;
        this.display = display;
        this.data = instrumentData;
        this.txcoords = instrumentData.txcoords;
        this.sources = instrumentData.sources;
        return this;
    };

    HsiRotation.prototype.updateInstrument = function() {
        updateHsiRotation(this.entity, this);
    };


    function updateHsiRotation(entity, instrument) {

        var txcoords = instrument.data.txcoords;

        var img = instrument.display.materialMap.emitImg;
        var ctx = instrument.display.materialMap.ctx;

        var a = 0.15+Math.random()*0.25
        var g = 35+Math.random()*10;
        ctx.fillStyle = 'rgba(5, '+Math.floor(g)+', 5, '+a+')';
        ctx.fillRect(txcoords[0]-txcoords[2]*0.5,txcoords[1]-txcoords[3]*0.5,txcoords[2],txcoords[3]);

        var x = txcoords[0];
        var y = txcoords[1];

        //     var pitchAngle = entity.instruments.horizon.getValue();
        //     if (!pitchAngle) return;

        //  var angleInRadians = 0 //entity.instruments.roll_indicator.getValue() //  Math.PI*Math.sin(new Date().getTime()*0.001);
        ctx.translate(x, y);
        //  ctx.rotate(angleInRadians);

        var sourceCoords = instrument.data.sources['circles']

        ctx.drawImage(img,sourceCoords[0],sourceCoords[1],sourceCoords[2],sourceCoords[3], -sourceCoords[2]*(0.5), -sourceCoords[3]*0.5,sourceCoords[2],sourceCoords[3]);
        ctx.translate(-x, -y);
    }

    return HsiRotation;
});