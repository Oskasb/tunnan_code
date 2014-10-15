"use strict";

define([
    "application/EventManager",
    'game/GameUtil',
    'game/GameConfiguration',
    "goo/math/Vector3",
	"goo/addons/terrainpack/TerrainSurface",
    'goo/entities/EntityUtils',
    'goo/scriptpack/WorldFittedTerrainScript',
    'goo/util/CanvasUtils',
    '3d/TerrainColorer',
    'physics/PhysicalWorld',
    '3d/Colorer',
    '3d/addons/Terrain'

],
    function(event,
             gameUtil,
             gameConfig,
             Vector3,
             TerrainSurface,
             EntityUtils,
             WorldFittedTerrainScript,
             CanvasUtils,
             TerrainColorer,
             PhysicalWorld,
             Colorer,
             Terrain
        ) {

        var worldFittedTerrainScript = new WorldFittedTerrainScript();

        var heightMaps = {};

        function addHeightMap(goo, zoneData, id, callback, imgReady) {

            var dims = {
                minX:zoneData.pos[0],
                minZ:zoneData.pos[2],
                minY:zoneData.pos[1],
                maxX:zoneData.pos[0]+zoneData.width,
                maxZ:zoneData.pos[2]+zoneData.depth,
                maxY:zoneData.pos[1]+zoneData.height
            };

            var terrainResolved = function() {
                    heightMaps[id] = {dimensions:dims, id:"terrain_"+id, zoneData:zoneData, terrain:terrain};
                    console.log("BUILT HEIGHT MAPS: ", heightMaps);
                callback();
            };


            console.log("ADD HEIGHTMAP: ", id);

            var terrain = new Terrain();
            var promise = terrain.init(goo, zoneData.heightData, dims, worldFittedTerrainScript, zoneData.texture1, imgReady);
            promise.resolve = terrainResolved;

        }

        var texturePoint = function(heightMap, pos) {
            var paintable = heightMap.terrain.getPaintable()
            //     console.log(paintable)
            var dim = heightMap.dimensions;
            var w = paintable.width;
            var h = paintable.height;
            var pxPerUnit = (dim.maxX - dim.minX) / w;
            var pointX = (pos[0]-dim.minX)/pxPerUnit;
            var pointY = (pos[2]-dim.minZ)/pxPerUnit;
            return [pointX, h-pointY, pxPerUnit];
        };


        var paintTerrainPoint = function(pos, size, color) {
            var heightMap = heightMaps[getTerrainIdForPos(pos)];
            if (!heightMap) return;
            var point = texturePoint(heightMap, pos);
            Colorer.paintPaintable(heightMap.terrain.getPaintable(), color, [point[0], point[1], size*point[2], size*point[2]]);
        };

        var getTerrainCanvasDataAtPos = function(pos) {
            var heightMap = heightMaps[getTerrainIdForPos(pos)];
            if (!heightMap) return;
            return Colorer.getPaintableCanvasData(heightMap.terrain.getPaintable());
        };

        var readTerrainCanvasAlphaAtPos = function(data, pos) {
            var heightMap = heightMaps[getTerrainIdForPos(pos)];
            if (!heightMap) return;
            var point = texturePoint(heightMap, pos);
            return data[(Math.floor(point[1]) * heightMap.terrain.getPaintable().width + Math.floor(point[0])) * 4 + 3] / 255;
        };

        var getCanvasRGBAAtPos = function(pos) {
            var heightMap = heightMaps[getTerrainIdForPos(pos)];
            if (!heightMap) return 1;
            var paintable = heightMap.terrain.getPaintable()

            var point = texturePoint(heightMap, pos);
            return Colorer.getPaintableRGBA(heightMap.terrain.getPaintable(), [Math.floor(point[0]), Math.floor(point[1])]);

        };

        var yMargin = 1;
        var getTerrainIdForPos = function(pos) {
            for (var index in heightMaps) {
                var dim = heightMaps[index].dimensions;
                if (pos[0] <= dim.maxX && pos[0] >= dim.minX) {
                    if (pos[1] < dim.maxY+yMargin && pos[1] > dim.minY-yMargin) {
                        if (pos[2] <= dim.maxZ && pos[2] >= dim.minZ) {
                            return index;
                        }
                    }
                }
            }
        };

        var getHeightAt = function(pos) {
            return worldFittedTerrainScript.getTerrainHeightAt(pos);
        };

        var getHeightAboveGroundAtPos = function(pos) {
            var height = worldFittedTerrainScript.getTerrainHeightAt(pos);
            var above = 100000;
            if (height) above = pos[1] - height;
            return above;
        };

        var getGroundNormal = function(pos) {
            return worldFittedTerrainScript.getTerrainNormalAt(pos);
        };

        var getTerrainData = function() {
        //    console.log("GET TERRAIN DATA: ", heightMaps)
            return heightMaps;
        };

        var getGroundSlope = function(norm) {
            if (norm == null) return 0;
            return 1-Math.abs(norm.data[1]);
        };

        return {
            getHeightAt:getHeightAt,
            getGroundSlope:getGroundSlope,
            getGroundNormal:getGroundNormal,
            addHeightMap:addHeightMap,
            getTerrainData:getTerrainData,
            paintTerrainPoint:paintTerrainPoint,
            getCanvasRGBAAtPos:getCanvasRGBAAtPos,
            getTerrainCanvasDataAtPos:getTerrainCanvasDataAtPos,
            readTerrainCanvasAlphaAtPos:readTerrainCanvasAlphaAtPos,
            getHeightAboveGroundAtPos:getHeightAboveGroundAtPos
        }

    });
