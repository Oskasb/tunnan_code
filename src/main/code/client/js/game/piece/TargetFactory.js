"use strict";

define(['game/world/PhysicalWorld',
    "application/EventManager",
    'game/movement/MobileUnits',
    'game/parts/Lights',
    'game/parts/Screens'
],
    function(physicalWorld,
             event,
             MobileUnits,
             lights,
             screens
        ) {

        var Target = function(id, data, pos) {
            var instance = this;

            var destroyed = function(entity) {
                entity.spatial.rot.rotateX(Math.random());
                entity.spatial.rot.rotateY(Math.random());
                entity.spatial.rot.rotateZ(Math.random());
                if (entity.combat.isAlive) {
                    event.fireEvent(event.list().ANALYTICS_EVENT, {category:"TARGET RANGE", action:"destroyed", labels:id, value:1})
                    MobileUnits.deleteMobileUnit(entity);
                    setTimeout(function() {
                        instance.remove()
                    }, 500);
                }
            };

            var entityAddedCallback = function(entity) {
                instance.entity = entity;
                entity.pieceData = data;
                physicalWorld.registerPhysicalEntity(entity);
                entity.combat.hitPoints = entity.pieceData.hitPoints;
                entity.combat.destroyed = destroyed;
                var visualEntityReady = function(gooEntity) {
					if (entity.geometries[0]) entity.geometries[0].removeFromWorld();
                    entity.geometries[0] = gooEntity;
                    entity.spatial.velocity.data[2] = 0.3*(Math.random()-0.5);
                    entity.spatial.velocity.data[0] = 0.3*(Math.random()-0.5);
                    console.log("ADD TARGET AT POS: ", pos)
                    MobileUnits.attachEntityToMobileSphere(entity, MobileUnits.sphericalMobile(data.dimensions.mobRadius, pos, false));
                //    if (data.lights) addTargetLights(entity, data.lights)
                    if (data.screens) addTargetScreens(entity, data.screens);
                };

                event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:entity.pieceData.gooProject.projectPath, modelPath:entity.pieceData.modelPath, callback:visualEntityReady});
            };

            event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:id, callback:entityAddedCallback});
        };

        var addTargetLights = function(entity, lightData) {
            console.log("ADD TARGET LIGHTS: ", entity)
            lights.registerEntityLights(entity, lightData);
        };

        var addTargetScreens = function(entity, screenData) {

            for (var index in screenData.displays) {
                console.log(index, screens.getDisplay(index))
                if (screens.getDisplay(index) != undefined) {
                //    alert(screens.getDisplay(index))
                    return;
                }
            }

            screens.registerEntityScreens(entity, screenData);

            console.log("ADD TARGET SCREENS: ", entity)

            entity.instruments = "target"

            var updateTargetScreens = function() {
                screens.updateEntityScreenState(entity)
            };

            event.registerListener(event.list().RENDER_TICK, updateTargetScreens);
        };

        var registerDynamicTarget = function(targetEntity) {

        };

        Target.prototype.remove = function() {
            event.fireEvent(event.list().REMOVE_GAME_ENTITY, {entityId:this.entity.id});
            delete this;
        };

        var buildTarget = function(targetId, data, pos) {
            var target = new Target(targetId, data, pos);
            console.log("BUILD TARGET:", target);
            return target;
        };

        return {
            buildTarget:buildTarget
        }
    });