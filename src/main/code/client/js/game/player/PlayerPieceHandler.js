"use strict";

define([
    "application/EventManager",
    "goo/math/Vector3",
    "3d/GooJointAnimator",
    "game/GameConfiguration",
    'game/piece/PieceBuilder',
    'game/player/PlayerInstruments',
    'game/player/PlayerInputSystem',
    'game/player/PlayerUiHandler',
    'physics/PhysicalWorld'
],
    function(
        event,
        Vector3,
        GooJointAnimator,
        gameConfig,
        pieceBuilder,
        playerInstruments,
        playerInputSystem,
        playerUiHandler,
        PhysicalWorld
        ) {

        var playerController;
        require(['game/player/PlayerController'], function(pc) {
            playerController = pc;
        });

        var playerId = "playerId";
        var playerEntity;


        var triggerUiReset = function(entity) {
            if (!entity.systems) return;
            event.fireEvent(event.list().INIT_PLAYER_CONTROL_STATE, {control:"engine", controlState:entity.systems.engine.currentState});
        //    event.fireEvent(event.list().INIT_PLAYER_CONTROL_STATE, {control:"breaks", controlState:entity.systems.breaks.currentState});
        //    event.fireEvent(event.list().INIT_PLAYER_CONTROL_STATE, {control:"flaps", controlState:entity.surfaces.flaps.controlState});
        //    event.fireEvent(event.list().INIT_PLAYER_CONTROL_STATE, {control:"canopy", controlState:entity.systems.canopy.currentState});
        //    event.fireEvent(event.list().INIT_PLAYER_CONTROL_STATE, {control:"gears", controlState:entity.systems.gears.currentState});
        //    event.fireEvent(event.list().PLAYER_CONTROL_EVENT,      {control:"auto_trim", value:1})
        };

        var setPlayerControlledEntity = function(entity, callback) {
            entity.isPlayer = true;
            console.log("SET PLAYER ENTITY: ", entity);
            event.fireEvent(event.list().ADD_KEYBINDINGS, {bindings:entity.pieceData.keyBindings});

            if (entity.moveSphere) {
                //     entity.moveSphere.ammoComponent = PhysicalWorld.createAmmoJSSphere(entity.pieceData.dimensions.mobRadius, entity.spatial.pos.data)
               PhysicalWorld.activateAmmoComponent(entity.moveSphere.ammoComponent, entity.spatial.pos.data, entity.spatial.velocity.data, entity.pieceData.dimensions.mobRadius);
            }


            setTimeout(function() {
                if (!entity.systems) return;
                if (entity.systems.engines) triggerUiReset(entity);
            }, 0);

			var countPages = 0;
			var uiCallback = function() {
				 countPages+=1;
				console.log("UI CALLBACK: ", countPages)
				if (countPages == entity.pieceData.uiPages.length) {
					console.log("UI CALLBACK: ", countPages, entity.pieceData.uiPages.length-1)

					callback(entity);
					playerInputSystem.ready();
				}
			};

            for (var i = 0; i < entity.pieceData.uiPages.length; i++) {
				console.log("add page: ", i, entity.pieceData.uiPages[i])
                playerUiHandler.loadPlayerUi(entity.pieceData.uiPages[i], uiCallback);
            }
			if (i==0) {
				callback(entity);
				playerInputSystem.ready();
			}

         //   playerInstruments.initInstruments(entity);

            console.log("--------->>>>> playerEntity: ", entity);
            return entity;
        };


        var unloadControledEntityUi = function(entity, unloadCallback) {

			var pageCount = 0;
			var pagesGoneCB = function(removed) {
				pageCount += 1;
				console.log("Page count: ", removed, pageCount, entity.pieceData.uiPages.length)
				if (pageCount == entity.pieceData.uiPages.length) {
					console.log("unloading ui from ", entity)
					setTimeout(function() {
						unloadCallback()
					}, 100)
				}

			};

            for (var i = 0; i < entity.pieceData.uiPages.length; i++) {
                playerUiHandler.unloadPlayerUi(entity.pieceData.uiPages[i], pagesGoneCB);
            }
        };

        var removePlayerControlFrom = function(entity, unloadedOk) {
            console.log("REMOVE CONTROLS FROM: ", entity);
			entity.isPlayer = false;

            event.fireEvent(event.list().CLEAR_KEYBINDINGS, {bindings:entity.pieceData.keyBindings});

            if (entity.moveSphere) {
                PhysicalWorld.removeAmmoComponent(event.moveSphere.ammoComponent);
            }

            unloadControledEntityUi(entity, unloadedOk);
        };

        return {
            removePlayerControlFrom:removePlayerControlFrom,
            unloadControledEntityUi:unloadControledEntityUi,
            setPlayerControlledEntity:setPlayerControlledEntity
        }
    });
