"use strict";

define([
    "application/EventManager",
    'goo/shapes/Quad',
    'goo/util/MeshBuilder',
    'goo/entities/components/MeshDataComponent',
    'goo/entities/components/MeshRendererComponent',
    'game/GameConfiguration',
    'physics/PhysicalWorld'
],
    function(
        event,
		Quad,
        MeshBuilder,
        MeshDataComponent,
        MeshRendererComponent,
        gameConfig,
        PhysicalWorld
        ) {

        var goo;
        var meshCache = {};

        var batchQueues = {};
        var materialCache = {};

        var cacheMesh = function(key, mesh) {
            meshCache[key] = {mesh:mesh};
        };

        var addBatch = function(queueId) {
            for (var i = 0; i < batchQueues[queueId].models.length; i++) {

                var batch = batchQueues[queueId].materialBuilders[materialCache[batchQueues[queueId].models[i]].material.name].build();

                for (var key in batch) {
                    console.log("Add: ", batch[key]);
                    var entity = goo.world.createEntity();
                    var meshDataComponent = new MeshDataComponent(batch[key]); // );

                    if (batchQueues[queueId].physical) {
                        PhysicalWorld.addPhysicalWorldMesh(batch[key], 0, 0, 0)
                    }

                    entity.setComponent(meshDataComponent);
                    var meshRendererComponent = new MeshRendererComponent();
                    meshRendererComponent.materials.push(materialCache[batchQueues[queueId].models[i]].material);
                    //    meshRendererComponent.castShadows = false;

                    meshRendererComponent.castShadows = false;
                    meshRendererComponent.isReflectable = false;
                    meshRendererComponent.receiveShadows = false;

                    entity.setComponent(meshRendererComponent);
                    entity.addToWorld();
                }
            }



            var callback = batchQueues[queueId].callback;
            setTimeout(function() {
                callback();
            }, 150);

            delete batchQueues[queueId];
        };

        var fetchBatchable = function(queueId, projPath, modelPath, xform, meshCB) {
            batchQueues[queueId].count+=1;

            if (!meshCache[modelPath]) {
                materialCache[modelPath] = {};
                var callback = function(gooEntity) {
                    var meshData = gooEntity.transformComponent.children[0].entity.meshDataComponent.meshData;
                    materialCache[modelPath].material = gooEntity.transformComponent.children[0].entity.meshRendererComponent.materials[0];
                    cacheMesh(modelPath, meshData);
                    batchQueues[queueId].models.push(modelPath);

                    if (!batchQueues[queueId].materialBuilders[materialCache[modelPath].material.name]) {
                        batchQueues[queueId].materialBuilders[materialCache[modelPath].material.name] = new MeshBuilder();
                    }

                    console.log("StaticBatch:", queueId, meshCache,  materialCache[modelPath].material.name);
                    meshCB(modelPath, xform);
                };
                console.log(projPath, modelPath)
                event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:projPath, modelPath:modelPath, callback:callback});
            } else {
                batchQueues[queueId].material = materialCache[modelPath].material;
                meshCB(modelPath,xform);
            }
        };

        var addTimeout;
        var failMesh = new Quad(0.001, 0.001, 1);

        function processBatch(queueId, meshId) {
            if (batchQueues[queueId].count == 0) addBatch(queueId);
        }

        function addTransformedMeshToBatchQueue(queueId, projectPath, modelPath, transform) {
             console.log("Add TransformMesh: ", queueId, projectPath, modelPath)
            if (!batchQueues[queueId]) alert("No batch queue registered for batchQueueId: "+queueId);

            var meshCallback = function(meshId,xform) {
                clearTimeout(batchQueues[queueId].addTimeout);
                batchQueues[queueId].materialBuilders[materialCache[meshId].material.name].addMeshData(meshCache[meshId].mesh, xform);
                batchQueues[queueId].count-=1;

                // TODO: Figure out why this failmesh is needed.
                batchQueues[queueId].materialBuilders[materialCache[meshId].material.name].addMeshData(failMesh, xform);
                batchQueues[queueId].addTimeout=setTimeout(function() {
                    processBatch(queueId, meshId)
                }, 0);
            };

            fetchBatchable(queueId, projectPath, modelPath, transform, meshCallback);

        }

        function registerBatchQueue(id, physical, callback) {
            batchQueues[id] = {
                count:0,
                models:[],
                materialBuilders:{},
                material:null,
                physical:physical,
                callback:callback
            }
        }

        var handleEngineReady = function(e) {
            goo = event.eventArgs(e).goo;
        };

        event.registerListener(event.list().ENINGE_READY, handleEngineReady);

        return {
            addTransformedMeshToBatchQueue:addTransformedMeshToBatchQueue,
            registerBatchQueue:registerBatchQueue
        }

    });