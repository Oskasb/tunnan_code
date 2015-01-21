"use strict";

define([
    "application/EventManager",
    'goo/math/Vector3',
    'game/EntityController',
    'game/GameUtil',
    '3d/HeightmapManager',
    'game/GameConfiguration',
    'goo/util/MeshBuilder',
    'goo/math/Transform',
    'game/world/StaticBatchBuilder',
    '3d/GooEffectController',
    '3d/addons/Vegetation'
],
    function(
        event,
        Vector3,
        entityController,
        gameUtil,
        HeightmapManager,
        gameConfig,
        MeshBuilder,
        Transform,
        StaticBatchBuilder,
        GooEffectController,
        Vegetation
        ) {

        var batchedCB;
        var terrainCount;
        var terrainQueue = [];

        var loadNatureProjects = function(callback) {

            var path = gameConfig.GOO_PROJECTS.nature.projectPath;
            var folder =  gameConfig.GOO_PROJECTS.nature.folder;
			var entityIds =  gameConfig.GOO_PROJECTS.nature.entityIds;

            event.fireEvent(event.list().LOAD_GOO_PROJECT, {projectPath:path, folder:folder, entityIds:entityIds, callback:callback});

        };

        var populateVegetation = function(goo, terrainData, callback) {
            console.log("Add Vegetation: ", terrainData)
            var vegetations = [];

            var checkPos = function(data, pos) {
                return HeightmapManager.readTerrainCanvasAlphaAtPos(data, pos);
            };

            var paintVegPoint = function(pos, size, spread) {
                paintTerrainShadow(pos, 9, size, spread)
            };

            for (var index in terrainData) {

                vegetations.push(new Vegetation(goo, HeightmapManager, terrainData[index]));
            }

            var vegBuilt = function() {
                if (vegetations.length == 0) {
                    callback()
                } else {
                    makeNext();
                }
            };

            var makeNext = function() {
                var veg = vegetations.shift();
                var promise = veg.init(HeightmapManager, checkPos, paintVegPoint);
                promise.resolve = vegBuilt;
            };
            vegBuilt();
        };

        var populateTrees = function(terrainData, callback) {
            var extraDensitySetting = GooEffectController.getSettings()['Lots of Trees'].fx["manyTrees"]*3+2;
            batchedCB = callback;
            terrainCount = 0;

            for (var index in terrainData) {
                terrainCount += 1;
                terrainQueue.push([index, terrainData[index].zoneData.tree_spread / extraDensitySetting, terrainData[index].dimensions]);
                console.log("Populate Terrain: ", index, terrainData[index]);
            }

            var fetchNext = function() {
                if (terrainQueue.length == 0) {
                    batchedCB();
                } else {
                    var next = terrainQueue.pop();
                    addTrees(next[0], next[1], next[2], fetchNext)
                    console.log("Populate Terrain next: ", next);
                }
            };

            var loadCallback = function() {
                fetchNext();
            };

            loadNatureProjects(loadCallback)
        };

        var addTrees = function(id, spread, dimensions, fetchNext) {
            event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'add_trees_'+id});

            function callback() {
                fetchNext();
                event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'add_trees_'+id});
            }

            var meshQueueId = "trees_"+id;

            StaticBatchBuilder.registerBatchQueue(meshQueueId, true, callback);

            addGroundedMesh(meshQueueId, spread, dimensions)
        };

        var paintTerrainShadow = function(pos, count, size, spread) {
            for (var i = 0; i <count; i++) {
                var p = [pos[0] + spread*(Math.random()-0.5)*Math.random(), pos[1], pos[2]+ spread*(Math.random()-0.5)*Math.random()];
                HeightmapManager.paintTerrainPoint(p, size * (Math.random()),      {color:[0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random(), 0.12]});
                HeightmapManager.paintTerrainPoint(p, size*0.5 + (Math.random()-0.5),{color:[0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random(), 0.06]});
                HeightmapManager.paintTerrainPoint(p, size*4*(Math.random()-0.5),  {color:[0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random(), 0.02]});
                HeightmapManager.paintTerrainPoint(p, size*8*Math.random(),        {color:[0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random(), 0.01]});
            }
        };

        var getTerrainAlphaAtPos = function(pos) {
            var rgba = HeightmapManager.getCanvasRGBAAtPos(pos);
            return rgba[3]/255;
        };


        var addGroundedMesh = function(meshQueueId, spread, dimensions){

            var meshList = [
                gameConfig.GOO_PROJECTS.nature.tree_leafy,
                gameConfig.GOO_PROJECTS.nature.tree_leafy,
            //    gameConfig.GOO_PROJECTS.nature.tree_40,
                gameConfig.GOO_PROJECTS.nature.tree_leafy_small,
                gameConfig.GOO_PROJECTS.nature.tree_leafy_small,
                gameConfig.GOO_PROJECTS.nature.tree_leafy_small,
            //    gameConfig.GOO_PROJECTS.nature.rock_mossy,
            //    gameConfig.GOO_PROJECTS.nature.rock_plain,
            //    gameConfig.GOO_PROJECTS.nature.rock_tiny
            ];


            var dims = dimensions;
            var xx = dims.minX + (dims.maxX -  dims.minX)*0.5;
            var zz = dims.minZ + (dims.maxZ -  dims.minZ)*0.5;
            var pos = [xx, dims.minY+1, zz];

            var canvasData = HeightmapManager.getTerrainCanvasDataAtPos(pos);

            var width = dimensions.maxX-dimensions.minX;

            for (var i = 0; i < Math.floor(width / spread); i++) {
                for (var j = 0; j < Math.floor(width / spread); j++) {

                    var posX = dimensions.minX+(i*spread+spread*0.5+spread*Math.random());
                    var posZ = dimensions.minZ+(j*spread+spread*0.5+spread*Math.random());

                    var height = HeightmapManager.getHeightAboveGroundAtPos([posX, 0, posZ]);

                    var alpha = HeightmapManager.readTerrainCanvasAlphaAtPos(canvasData, [posX, height, posZ]);

                    if (height !== null && alpha < 0.3) {

                        var normal = HeightmapManager.getGroundNormal([posX, 0, posZ]);
                        if (normal !== null) {
                            var steepness = HeightmapManager.getGroundSlope(normal);
                            //    console.log("Will try: ", posX, height, posZ, normal.data[0], normal.data[1], normal.data[2], steepness);
                            if (steepness < 0.09) {
                                if (height < - 3 && height > - 455 ) {




                                    var selection = Math.floor(Math.random()*meshList.length);

                                    var meshId = meshList[selection];

                                    pushMeshToPos(meshQueueId, meshId, [posX, -height, posZ], normal);
                                    paintTerrainShadow([posX, -height, posZ], 35, 2, 30)
                                }
                            }
                        }
                    }
                }
            }
        };

        var pushMeshToPos = function(meshQueueId, meshId, pos, normal) {
            console.log("Push mesh:", pos);
            var treeTransform = function(pos) {
                var transform = new Transform();
                var size = 0.5+1.8*Math.random()*Math.random();

                transform.translation.x = pos[0];
                transform.translation.y = pos[1];
                transform.translation.z = pos[2];

                normal.muld(1,1.5,1);
                transform.lookAt(normal, Vector3.UNIT_Y);
                transform.rotation.rotateY(0.1*Math.random()*0.2);
                transform.rotation.rotateZ(0.1-Math.random()*10.2);
                transform.rotation.rotateX(0.1*Math.random()*0.2);

                transform.scale.set(size+0.2*Math.random(),size+0.2*Math.random(),size+0.2*Math.random());
                transform.update();
                return transform;
            };

            var xform = treeTransform(pos);
     //       StaticBatchBuilder.addTransformedMeshToBatchQueue(meshQueueId, gameConfig.GOO_PROJECTS.nature.projectPath, meshId, xform)
        };

        return {
            populateTrees:populateTrees,
            populateVegetation:populateVegetation
        }

    });