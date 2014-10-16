"use strict";

define([
    "application/EventManager",
    "goo/math/Vector3",
    "3d/GooJointAnimator",
    "game/GameConfiguration",
    "game/planes/PlaneData",
    'game/piece/PieceBuilder',
    'game/player/PlayerUtils'
],
    function(
        event,
        Vector3,
        GooJointAnimator,
        gameConfig,
        planeData,
        pieceBuilder,
        playerUtils
        ) {

        var playerController;

        require(['game/player/PlayerController'], function(pc) {
            playerController = pc;
        });

        var playerId = "playerId";

        var updateAcrobaticSmokeState = function(value) {
            contrails.updateAcrobaticSmokeState(playerController.getPlayerEntity(), value);
        };

        var handlePlayerInput = function(e) {
            var playerEntity = playerController.getPlayerEntity();
            var args = event.eventArgs(e);
            playerEntity.state = args.movestate;
        };

        var updateControlAnimation = function(ctr, value) {
            var playerEntity = playerController.getPlayerEntity();
            var systems = playerEntity.pieceData.systems;

            if (systems[ctr]) {
                var system = systems[ctr]
            } else {
                var system = playerEntity.pieceData.surfaces[ctr]
            }

            if (!system) {
                return;
            }
            if (system.inputBehavior.inputAnim) {
                var inputAnim = system.inputBehavior.inputAnim;
                var boneName = inputAnim.bone;
                var boneId = playerEntity.pieceData.boneMap[boneName];
                var bone = playerEntity.animationChannels[boneId];
                var rot = inputAnim.rot;
                if (boneName == "stick") {
                    //    console.log(playerEntity.controls.aeilrons.value)
                    GooJointAnimator.rotateBone(bone, playerEntity.surfaces.aeilrons.currentState*rot[0], value*rot[1], value*rot[2])
                } else {
                    GooJointAnimator.rotateBone(bone, value*rot[0], value*rot[1], value*rot[2])
                }
            }
        };

        var handleControlStateChange = function(control, value) {
        //    if (control == "debug_mechanics") playerUtils.handleDebugState(value);
        //    if (control == "wing_smoke") updateAcrobaticSmokeState(value);

            updateControlAnimation(control, value);
        };

        var resampleControlState = function(control) {
            var playerEntity = playerController.getPlayerEntity();
			playerEntity.pieceInput.triggerUpdate(control);
        };

        var handleControlChange = function(control, value) {
            var playerEntity = playerController.getPlayerEntity();
            playerEntity.pieceInput.setInputState(control, value);
        };

        var handlePlayerControlChangeEvent = function(e) {
            handleControlChange(event.eventArgs(e).control, event.eventArgs(e).value)
            if (event.eventArgs(e).control == "jump") console.log(playerController.getPlayerEntity().spatial.pos.data);
        };

        var handlePlayerControlStateUpdate = function(e) {
            handleControlStateChange(event.eventArgs(e).control, event.eventArgs(e).currentState)
        };


        var mouseSteer = 0;
        var mouseturn = 0;

        var tickInput = function(e) {
            function deltaCallback(dxdy) {
                handleControlChange("mouseturn", dxdy[0]*30);
                mouseturn = dxdy[0];
            }
            if (mouseSteer) {
                event.fireEvent(event.list().FETCH_DRAG_DELTA, {callback:deltaCallback});
            }
        };

        var handleMouseAction = function(e) {
            var action = event.eventArgs(e).action;
            handleControlChange("mouseforward", action[0] * action[1]);
            resampleControlState("forward");
            handleControlChange("mouseturn", 0);
            if (mouseSteer != action[1]) handleControlChange("strafe", action[1]);
            mouseSteer = action[1];
        };

		var initDone = false;
        var ready = function() {
			if  (initDone) return;
            event.registerListener(event.list().PLAYER_CONTROL_EVENT, handlePlayerControlChangeEvent);
            event.registerListener(event.list().PLAYER_CONTROL_STATE_UPDATE, handlePlayerControlStateUpdate);
            event.registerListener(event.list().RENDER_TICK, tickInput);
            event.registerListener(event.list().MOUSE_ACTION, handleMouseAction);
			initDone = true;
        };

        return {
            ready:ready
        }
    });
