"use strict";

define([
    'application/EventManager',
    'game/player/PlayerUtils',
    'game/player/PlayerPieceHandler',
    "game/planes/PlaneData",
    '3d/cameras/WalkMode'
],
    function(
        event,
        playerUtils,
        playerPieceHandler,
        planeData,
        WalkMode
        ) {

        var playerEntity;

        var available = ["PILOT_1", "TUNNAN_1", "DRAKEN_3", "PV_9031_1"];
        var current;

        function getNextAvailable() {
            var next = current+1;
            return available[next%available.length]
        }

        function setPlayerEntity(entity){
            playerEntity = entity;
        }

        function getPlayerEntity(){
            return playerEntity;
        }

        var setPlayerControlledEntity = function(entity, callback) {
            current = available.indexOf(entity.id);
            setPlayerEntity(playerPieceHandler.setPlayerControlledEntity(entity, callback));
            var camEntity = entity;
            if (entity.pilot) camEntity = entity.pilot;
            entity.isPilot = false;
        //    event.fireEvent(event.list().ANALYTICS_EVENT, {category:"PLAYER_ENTITY", action:entity.id, labels:"", value:0})

        };

        var handleSetPlayerEntity = function(e) {
            setPlayerControlledEntity(event.eventArgs(e).entity, event.eventArgs(e).callback);
        };

        var handleExitEntity = function(e) {
			var exitCb = event.eventArgs(e).callback;
            var pilot = getPlayerEntity().pilot;
            var pos = getPlayerEntity().spatial.pos.data;
            var rot = getPlayerEntity().spatial.rot.toAngles();
        //    rot.normalize();
            var vel = getPlayerEntity().spatial.velocity.data;

			var unloadOk = function() {
				if (!pilot) {

					var switchOk = function() {
						console.log("Switch without pilot Completed")
						if (typeof(exitCb) == 'function') {
							exitCb();
						}
					};

					var noPilotCallback = function(entity) {
						setPlayerControlledEntity(entity, switchOk);
					};

					var switchTo = function(entity) {
						console.log("SWITCH TO: ", entity)
						//    setPlayerEntity(null);
						entity.spatial.pos.set(pos);
						entity.spatial.velocity.set(vel);
						event.fireEvent(event.list().FETCH_LEVEL_ENTITY, {entityId:entity.id, callback:noPilotCallback});
					};


					var callback = function() {
						event.fireEvent(event.list().SPAWN_PHYSICAL, {pos:pos, callback:switchTo});
					};
					event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:callback, wait:200});

				} else {
					getPlayerEntity().pilot = null;

					var switchTo = function(entity, pos) {

						var uiCallback = function() {
							event.fireEvent(event.list().SET_CAMERA_TARGET, {spatial:entity.spatial, geometry:entity.geometries[0], controlScript:"walkCam"});

							if (typeof(exitCb) == 'function') {
								exitCb();
							}

						};

						console.log("SWITCH TO: ", entity);
						entity.spatial.pos.set(pos);
						entity.spatial.rot.fromAngles(0, rot.data[1], 0);
						setPlayerControlledEntity(entity, uiCallback);
					};

					var callback = function() {
						switchTo(pilot, pos);
					};
					event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:callback, wait:200});

				}
			};

            playerPieceHandler.removePlayerControlFrom(getPlayerEntity(), unloadOk);

        };

        var handlePopSphere = function() {
            console.log("POP Sphere")
            event.fireEvent(event.list().SPAWN_PHYSICAL, {pos:getPlayerEntity().spatial.pos.data});

        };

        event.registerListener(event.list().SET_PLAYER_CONTROLLED_ENTITY, handleSetPlayerEntity);
        event.registerListener(event.list().EXIT_CONTROLLED_ENTITY, handleExitEntity);
        event.registerListener(event.list().POP_SPHERE, handlePopSphere);
        return {
            getPlayerEntity:getPlayerEntity
        }
    });
