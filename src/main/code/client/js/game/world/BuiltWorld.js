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
    'game/world/StaticBatchBuilder'
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
        StaticBatchBuilder
        ) {

        var batchingDone;
        var batchQueue = [];

        var loadQueue = {};

        var loadBuildingProjects = function(loadLevels, loadedcb) {

            for (var i = 0; i < loadLevels.length; i++) {
                console.log(loadQueue);
                for (var j = 0; j < loadLevels[i].gooProjects.length; j++) {
                    loadQueue[loadLevels[i].gooProjects[j].refFile] = loadLevels[i].gooProjects[j].projectPath;
                    console.log(loadQueue);
                }
            }

            var loadCount = 0;

            var callback = function() {
                loadCount -= 1;
                console.log(loadCount)
                if (loadCount == 0) loadedcb();
            };

            for (var index in loadQueue) {
                loadCount += 1;
                event.fireEvent(event.list().LOAD_GOO_PROJECT, {projectPath:loadQueue[index], folder:index, callback:callback});
            }

            if (!loadCount) loadedcb();

        };

        var populateBuildings = function(loadLevels, terrainData, buildingsBuilt) {
            var callback = function() {
                batchingDone = buildingsBuilt;
                for (var i = 0; i < loadLevels.length; i++) {
                    console.log("Load Level: ", i, loadLevels[i], loadLevels[i].zoneId, terrainData, terrainData[loadLevels[i].zoneId]);
                    var item = [loadLevels[i], terrainData[loadLevels[i].zoneId], loadLevels[i].zoneId+"_"+i];
                    batchQueue.push(item);
                }

                var fetchNext = function() {
                    if (batchQueue.length == 0) {
                        batchingDone();
                    } else {
                        var next = batchQueue.pop();
                        loadLevelBuildings(next[0], next[1], next[2], fetchNext)
                    }
                };
                fetchNext();
            };
            loadBuildingProjects(loadLevels, callback)
        };

        var loadLevelBuildings = function(levelData, zone, queueId, fetchNext) {
            console.log("BUILD BUILDINGS WORLD: ",levelData, zone);
            var zonePos = zone.zoneData.pos;

            event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'add_building_'+queueId});
            function callback() {
                event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'add_building_'+queueId});
                fetchNext();
            }
            StaticBatchBuilder.registerBatchQueue(queueId, true, callback);

            for (var i = 0; i < levelData.buildings.length; i++) {
                var model = levelData.buildings[i].model;
                for (var j = 0; j < levelData.buildings[i].entries.length; j++) {
                    var entry = levelData.buildings[i].entries[j];
                    addEntryTobatch(queueId, model, [zonePos[0]+entry.pos[0], zonePos[1]+entry.pos[1], zonePos[2]+entry.pos[2]], entry.rot)
                }
            }
        };

        var addEntryTobatch = function(queueId, meshId, pos, rot) {
            console.log("ADD TO BATCH: ", queueId, meshId, pos, rot);
            var height = HeightmapManager.getHeightAboveGroundAtPos(pos);
            pos[1]-=height;
            if (height !== null) {
                var normal = HeightmapManager.getGroundNormal(pos);
                pushMeshToPos(queueId, meshId, pos, rot, normal);
            }
        };


        var pushMeshToPos = function(meshQueueId, meshId, pos, rot, normal) {

            var treeTransform = function(pos) {
                var transform = new Transform();

                transform.translation.x = pos[0];
                transform.translation.y = pos[1];
                transform.translation.z = pos[2];

                transform.lookAt(normal, Vector3.UNIT_Y);
                //    transform.setRotationXYZ(0.1*Math.random(), Math.random()*7, 0.1*Math.random());
            //    transform.rotation.rotateY(0.1*Math.random()*0.2);
                transform.rotation.rotateZ(rot[1]);
            //    transform.rotation.rotateX(0.1*Math.random()*0.2);

                transform.update();
                return transform;
            };
            console.log("ADD TO POS: ", meshQueueId, pos);
            var xform = treeTransform(pos);
    //        StaticBatchBuilder.addTransformedMeshToBatchQueue(meshQueueId, gameConfig.GOO_PROJECTS.nature.projectPath, meshId, xform)
        };

        return {
            populateBuildings:populateBuildings
        }

    });