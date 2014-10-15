"use strict";

define(['application/EventManager',
    'game/world/NatureWorld',
    'game/world/BuiltWorld'
], function(event,
            NatureWorld,
            BuiltWorld
    ) {

    function buildTerrainZone(goo, loadLevels, terrainData, batchesDone) {
        console.log(loadLevels, terrainData)

        var vegCallback = function() {
            batchesDone();
        };

        var treesCallback = function() {
            NatureWorld.populateVegetation(goo, terrainData, vegCallback);
        };

        var buildingsCallback = function() {
            NatureWorld.populateTrees(terrainData, treesCallback);
        };

        BuiltWorld.populateBuildings(loadLevels, terrainData, buildingsCallback);
    };

    return {
        buildTerrainZone:buildTerrainZone
    }
});