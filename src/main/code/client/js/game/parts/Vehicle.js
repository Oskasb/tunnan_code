"use strict";

define(['game/world/PhysicalWorld',
    "application/EventManager",
    "3d/GooJointAnimator"],
    function(physicalWorld,
             event,

             GooJointAnimator
        ) {

        var Vehicle = function(id, data, vehicleReady) {
            var instance = this;

            var entityAddedCallback = function(entity) {
                instance.entity = entity;
                entity.pieceData = data;
                physicalWorld.registerPhysicalEntity(entity);
                entity.combat.hitPoints = entity.pieceData.hitPoints;
                entity.combat.destroyed = function(entity) {};

                var visualEntityReady = function(gooEntity) {
					if (entity.geometries[0]) entity.geometries[0].removeFromWorld();
                    entity.geometries[0] = gooEntity;
					entity.geometries[0].addToWorld();

			//		if (gooEntity.animationComponent) gooEntity.animationComponent = gooEntity.animationComponent.clone();

					GooJointAnimator.printClipInitialTransform(entity);

                    entity.spatial.velocity.data[2] = 0.3*(Math.random()-0.5);
                    entity.spatial.velocity.data[0] = 0.3*(Math.random()-0.5);
					vehicleReady(entity);
                };

				console.log("Build Piece: ", entity.pieceData)
                event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:entity.pieceData.gooProjectUrl, modelPath:entity.pieceData.modelPath, callback:visualEntityReady});
            };

            event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:id, callback:entityAddedCallback});
        };



        return Vehicle;
    });