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


        var Character = function(gamePiece, data, pos, readyCallback) {
            var instance = this;
                var entity = gamePiece.entity;
                instance.entity = gamePiece.entity;
                console.log("SPHERE POS: ", pos)

                physicalWorld.registerPhysicalEntity(gamePiece.entity);

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

                event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:gamePiece.entity.pieceData.gooProjectUrl, modelPath:gamePiece.entity.pieceData.modelPath, callback:visualEntityReady});

        };

		return Character;
    });