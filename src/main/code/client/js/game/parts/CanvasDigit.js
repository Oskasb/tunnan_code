"use strict";

define(function() {

    var sources;
    var image;
    var context;
    var coords;

    function setSourceData(sourceData, img, ctx) {
        sources = sourceData;
        image = img;
        context = ctx;
    }

    function getCoordsForDigit(digit) {
        return sources[digit];
    }

    function drawNumberToContextCoordinate(value, x, y) {
        for (var i = 0; i < value.length; i++) {
            coords = getCoordsForDigit(value[i]);
            context.drawImage(image, coords[0],coords[1],coords[2],coords[3],i*6 + x-coords[2]*0.5, -3 +y -coords[3]-0.5,coords[2],coords[3]);
        }
    }

    return {
        setSourceData:setSourceData,
        drawNumberToContextCoordinate:drawNumberToContextCoordinate
    };
});
