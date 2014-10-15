"use strict";

define([
    "application/EventManager",
    "game/EntityModel",
    'goo/math/Vector3'
    ],
    function(event,
             entityModel,
             Vector3
        ) {

    var getEntityById = function(entityId) {
        return entityModel.getEntityById(entityId)
    };

    var addGameEntity = function(entityId) {
        return entityModel.createClientEntity(entityId);
    };

    var removeGameEntity = function(entityId) {
        entityModel.deleteClientEntity(entityId);
    };

    var handleAddEntityEvent = function(e) {
        var entity = addGameEntity(event.eventArgs(e).entityId)
        event.eventArgs(e).callback(entity);
    };

    var handleRemoveEntityEvent = function(e) {
        removeGameEntity(event.eventArgs(e).entityId)
    };

        var hideEntity = function(entity) {
            entityModel.hideEntityGeometry(entity);
        };

        var showEntity = function(entity) {
            entityModel.showEntityGeometry(entity);
        };

		var handleUnload3d = function(e) {

			for (var index in entityModel.clientEntities) {
				console.log("PieceController Remove: ", index, entityModel.clientEntities[index]);

				if (entityModel.clientEntities[index].isPlayer) {
					var entity = entityModel.clientEntities[index];

					var removeCount = 0;
					var unloadCb = function(id) {
						removeCount += 1;
						if (removeCount ==  entity.pieceData.uiPages.length) {
							console.log("PieceController Remove UI: ", removeCount, id);
							setTimeout(function() {
								event.eventArgs(e).callback();
							}, 100)
						}
					};

					for (var i = 0; i < entity.pieceData.uiPages.length; i++) {
						event.fireEvent(event.list().UNLOAD_UI_TEMPLATE, {templateId:entity.pieceData.uiPages[i], callback:unloadCb});
					}
					if (i==0) event.eventArgs(e).callback();
				}
				event.fireEvent(event.list().REMOVE_GAME_ENTITY, {entityId:index})
			}
			entityModel.resetSeed();
		};

		event.registerListener(event.list().UN_LOAD_3D, handleUnload3d);

    event.registerListener(event.list().REMOVE_GAME_ENTITY, handleRemoveEntityEvent);
    event.registerListener(event.list().ADD_GAME_ENTITY, handleAddEntityEvent);


    return {
        getEntityById:getEntityById,
        hideEntity:hideEntity,
        showEntity:showEntity
    }
})

