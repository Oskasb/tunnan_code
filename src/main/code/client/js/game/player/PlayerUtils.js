"use strict";

define([
    'application/EventManager',
		'physics/PhysicalWorld',
    'game/characters/CharacterAnimator',
	'game/player/PlayerPieceHandler'
],
    function(
        event,
		PhysicalWorld,
        CharacterAnimator,
		PlayerPieceHandler
        ) {

        var playerController;
        require(['game/player/PlayerController'], function(pc) {
            playerController = pc;
        });

        function getPlayerEntity() {
            return playerController.getPlayerEntity();
        }


        var handleDebugState = function(value) {
            var playerEntity = getPlayerEntity();
            for (var index in playerEntity.wings) {
                playerEntity.wings[index].visualize(playerEntity, playerEntity.wings[index], value);
            }
        };


        var handleMovePlayerToPoint = function(e) {
            var pos = event.eventArgs(e).pos;
            var fromPos = " "+[getPlayerEntity().spatial.pos.data[0],getPlayerEntity().spatial.pos.data[1], getPlayerEntity().spatial.pos.data[2]];
            event.fireEvent(event.list().ANALYTICS_EVENT, {category:"ui_action", action:"RESET", labels:"From:"+fromPos, value:0})
            getPlayerEntity().spatial.pos.set(pos);
        };

		var unlockVehicle = function(vehicle) {
			/*
			if (vehicle.systems.canopy) {
				console.log("Lock: ", vehicle.systems.canopy)
				vehicle.systems.canopy.locked = false;
			}
			    */
			for (var index in vehicle.systems) {
				if (index != 'engine')	vehicle.systems[index].locked = false;
			}
		};

        var attachPilotToVehicle = function(pilotEntity, vehicleEntity) {
			if (pilotEntity.isPilot != true) {
				console.log("Pilot transition failed! ", pilotEntity);
			}

			if (pilotEntity.spatial.rigidBodyComponent) {
				console.log("remove RB from pilot")
				PhysicalWorld.removePhysicsComponent(pilotEntity.spatial.rigidBodyComponent, pilotEntity);

			}

			if (pilotEntity.moveSphere) {
				console.log("remove moveSphere from pilot")
				pilotEntity.moveSphere.removeFromWorld();
			//	delete pilotEntity.moveSphere;
			}


		//	pilotEntity.moveSphere.deactivate();
            vehicleEntity.pilot = pilotEntity;


	        pilotEntity.spatial.velocity.set(0, 0, 0);
	        pilotEntity.spatial.pos.set(vehicleEntity.pieceData.dimensions.pilotSeatPos);

			var setCamTarget = function() {
				CharacterAnimator.applyEntityAnimationState(pilotEntity, pilotEntity.pieceData.animations.seated.pilotSit);
				event.fireEvent(event.list().SET_CAMERA_TARGET, {spatial:pilotEntity.spatial, geometry:pilotEntity.geometries[0], controlScript:"pilotCam"});

				var unlock = function() {
					unlockVehicle(vehicleEntity);
				};
				event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:unlock, wait:300});
            };

			event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:setCamTarget, wait:300});

        };


        var unloadControledEntityUi = function(entity, unloadCallback) {
		//	PlayerPieceHandler.unloadControledEntityUi(entity, unloadCallback);
			unloadCallback()
        };

        var pilotVehicle = function(pilot, vehicle, vehicleReadyCB) {

        //    event.fireEvent(event.list().SET_CAMERA_TARGET, {spatial:vehicle.spatial, controlScript:"transitCam"});
			console.log("Attach Pilot: ", pilot)
			pilot.isPilot = true;

			var unloadCallback = function() {
				attachPilotToVehicle(pilot, vehicle);


			//	var attach = function() {

					event.fireEvent(event.list().SET_PLAYER_CONTROLLED_ENTITY, {entity:vehicle, callback:vehicleReadyCB});

			//	}

			//	event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:attach, wait:300});

			};

			if (pilot.isPlayer) {
				unloadControledEntityUi(pilot, unloadCallback);
			} else {
				unloadCallback();
			}

			pilot.isPlayer = false;

        };

        var handleUseNearestEntity = function() {
            var pos = getPlayerEntity().spatial.pos;
            console.log("USE NEAREST ENTITY");

            var leaveEntity = getPlayerEntity();

			var vehicleReadyCB = function() {
				console.log("Using nearest vehicle ready")
			};

			var pilot = function() {

				function setControl(entity) {
					pilotVehicle(leaveEntity, entity, vehicleReadyCB)
				}
				event.fireEvent(event.list().FETCH_LEVEL_ENTITY, {entityId:"NEAREST", pos:pos, callback:setControl});
			};

			event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:pilot, wait:300});
        };

		var handleControlUpdate = function(e) {
			if (event.eventArgs(e).control == 'debug_mechanics') handleDebugState(event.eventArgs(e).currentState)
		}

        var handleLoadingEnded = function() {
            event.registerListener(event.list().PLAYER_MOVE_TO_POINT, handleMovePlayerToPoint);
            event.registerListener(event.list().USE_NEAREST_ENTITY, handleUseNearestEntity);
			event.registerListener(event.list().PLAYER_CONTROL_STATE_UPDATE, handleControlUpdate);
        };

        var handlePilotVehicle = function(e) {
            pilotVehicle(event.eventArgs(e).pilot, event.eventArgs(e).vehicle, event.eventArgs(e).callback);
        };

        event.registerListener(event.list().SCENARIO_LOADED, handleLoadingEnded);
        event.registerListener(event.list().PILOT_VEHICLE, handlePilotVehicle);

        return {
            handleDebugState:handleDebugState
        }

    });
