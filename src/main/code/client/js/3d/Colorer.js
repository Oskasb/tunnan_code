"use strict";

define([
    "application/EventManager",
    'goo/renderer/Texture'
],     function(event,
                Texture
    ) {

    var paintables = {};

    var toRgb = function(color) {
        var r = ""+Math.floor(color[0]*255);
        var g = ""+Math.floor(color[1]*255);
        var b = ""+Math.floor(color[2]*255);
        return 'rgb('+r+', '+g+', '+b+')';
    };

    var toRgba = function(color) {
        var r = ""+Math.floor(color[0]*255);
        var g = ""+Math.floor(color[1]*255);
        var b = ""+Math.floor(color[2]*255);
        var a = ""+color[3];
        return 'rgba('+r+', '+g+', '+b+', '+a+')';
    };

    var randomRgb = function() {
        var selection = Math.floor(Math.random()*3);
        var color = [0.5, 0.5, 0.5];
        color[selection] = 0.8;
        return toRgb(color)
    };

    var registerCanvasTexture = function(id, texture, sourceImage, canvas) {
        var paintable = {
            texture:texture,
            sourceImage:sourceImage,
            canvas:canvas,
            width:canvas.width,
            height:canvas.height,
            context:canvas.getContext('2d')
        };
        return paintable;
    };

    var paintPaintable = function(paintable, source, targetCoords) {
        paintable.context.fillStyle = toRgba(source.color);
        paintable.context.fillRect(targetCoords[0]-targetCoords[2]*0.5, targetCoords[1]-targetCoords[3]*0.5, targetCoords[2], targetCoords[3]);
        paintable.texture.needsUpdate = true;
    };


    var getPaintableRGBA = function(paintable, xy) {
        return paintable.context.getImageData(xy[0], xy[1], 1, 1).data;
    };

    var getPaintableCanvasData = function(paintable) {
        return paintable.context.getImageData(0, 0, paintable.height, paintable.width).data;
    };

    return {
        registerCanvasTexture:registerCanvasTexture,
        getPaintableRGBA:getPaintableRGBA,
        getPaintableCanvasData:getPaintableCanvasData,
        paintPaintable:paintPaintable
    }
});