"use strict";

define(['game/world/PhysicalWorld',
        "application/EventManager",
        "3d/GooJointAnimator",
        'game/movement/MobileUnits'],
    function(physicalWorld,
             event,
             GooJointAnimator,
             MobileUnits
    ) {


        var Human = function(id, data, pos, readyCallback) {
            var instance = this;

            var entityAddedCallback = function(entity) {
                instance.entity = entity;
                console.log("SPHERE POS: ", pos)

                entity.pieceData = data;
                console.log(data)
                physicalWorld.registerPhysicalEntity(entity);
                entity.combat.hitPoints = entity.pieceData.hitPoints;

                var visualEntityReady = function(gooEntity) {
                    if (entity.geometries[0]) entity.geometries[0].removeFromWorld();
                    entity.geometries[0] = gooEntity;

                    GooJointAnimator.printClipInitialTransform(entity);
                    entity.spatial.pos.set(pos);
                    entity.spatial.velocity.data[2] = 0.3*(Math.random()-0.5);
                    entity.spatial.velocity.data[0] = 0.3*(Math.random()-0.5);
                    MobileUnits.attachEntityToMobileSphere(entity, MobileUnits.sphericalMobile(data.dimensions.mobRadius, pos, false));
                    entity.geometries[0].addToWorld();
                    readyCallback(instance);
                };

                event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:entity.pieceData.gooProject.projectPath, modelPath:entity.pieceData.modelPath, callback:visualEntityReady});
            };
            event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:id, callback:entityAddedCallback});
        };

        return Human;
    });