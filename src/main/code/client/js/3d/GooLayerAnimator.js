"use strict";

define([
], function(

    ) {

    var printEntityLayerMap = function(gameEntity) {
        if (!gameEntity.geometries[0].animationComponent) {
            alert("No Animation on entity: "+gameEntity.id);
            console.log(gameEntity.geometries[0])
        }
        var animLayers = gameEntity.geometries[0].animationComponent.layers;

        var animStateMap = {};

        for (var i = 0; i <animLayers.length; i++) {
            var layer = animLayers[0];
            for (var index in layer._steadyStates) {
                animStateMap[layer._steadyStates[index]._name] = index;
            }
        }

        gameEntity.animStateMap = animStateMap;

        console.log("print animation layers: ", gameEntity)
    };


    return {
        printEntityLayerMap:printEntityLayerMap
    }
});