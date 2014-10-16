"use strict";

require(["application/EventManager","io/InputSettersGetters"], function(event, inputSettersGetters) {

    var turnToPoint = [];
    var turnTimeout = false;
    var lastFrameTime = new Date().getTime();
    var physFrameTime = 10;

    var inputState = {
        cameraDrag:false,
        pointerDrag:false
    };

    var movementParameters = {movestate: "stop", forward:0, mouseSteer:0, mouseForward:[0, 0], back:0, turnright:0, turnleft:0, jump:0};
    var lastState;

    var setMouseForward = function(value) {
        movementParameters.mouseForward = value;
        if (turnTimeout == true) {
       //     return;
        }
        handleMovementInputChange(movementParameters)
    };


    var setMovePlayerState = function(movestate, turnSpeed) {
        event.fireEvent(event.list().PLAYER_MOVEMENT_INPUT, {movestate:movestate, turnSpeed:turnSpeed})
        return;

        var entity = entityHandler.getEntityById("player")

        if (entity.piece.state == "dead") return

        var posDir = movementController.getPosAndDirOfEntityId(entity.id);
        var pos = posDir[0]

        if (turnSpeed != 0) {
            var newDir = movementController.calculateDirectionFromDirAndAngle(entity.spatial.dir, turnSpeed);
            //        entity.spatial.dir = newDir
            //        console.log(newDir);
        } else {
            newDir = entity.spatial.dir;
        }

        spatialController.startMovementTransition(entity.id, movestate, newDir, pos);
    };

    var handleMovementInputChange = function(moveParameters) {
        var move = "stop";
        var keyTurn = moveParameters.turnleft - moveParameters.turnright
        if (moveParameters.forward + moveParameters.mouseForward[0]*moveParameters.mouseForward[1] - moveParameters.back > 0) move = "walk";
        if (moveParameters.forward - moveParameters.back < 0) move = "back";
        //    if (moveParameters.turnLeft - moveParameters.turnRight > 0) turnstate = "turnLeft";
        //    if (moveParameters.turnLeft - moveParameters.turnRight < 0) turnstate = "turnRight";
        //    if (this.mouseSteer == undefined) this.mouseSteer = 1;

        if (movementParameters.mouseSteer == 1 && keyTurn != 0) {
            if (move == "walk") {
                if (moveParameters.turnright == 1) {
                    move = "st_f_r"
                }
                if (moveParameters.turnleft == 1) {
                    move = "st_f_l"
                }
            }

            if (move == "back") {
                if (moveParameters.turnright == 1) {
                    move = "st_b_r"
                }
                if (moveParameters.turnleft == 1) {
                    move = "st_b_l"
                }
            }

            if (move == "stop") {
                if (moveParameters.turnright == 1) {
                    move = "st_r"
                }
                if (moveParameters.turnleft == 1) {
                    move = "st_l"
                }
            }
            keyTurn = 0;
        };

        movementParameters.movestate = move;
        movementParameters = moveParameters;
        setMovePlayerState(movementParameters.movestate, keyTurn)
    };

    var mouseMoveSteer = function(entity) {
        if (movementParameters.mouseSteer == 1) {
            //    var entity = entityHandler.getEntityById("player")
            var oldAngle = - entity.visuals.pointer.getRotY(); // - entity.spatial.angle
            var newAngle = - entity.visuals.head.collada.getRotY();
            if (Math.abs(oldAngle - newAngle) < 0.13) {
                //    return;
            }

            entity.spatial.dir[0] = scene.camEntity.spatial.dir[0];
            entity.spatial.dir[2] = scene.camEntity.spatial.dir[2];
            //    this.setMovePlayerState(this.movementParameters.movestate, oldAngle-newAngle);
        }
    };

    var setMouseAction = function(value, xy) {

        if (value[1] == 1) {
            movementParameters.mouseSteer = 1;
        } else {
            movementParameters.mouseSteer = 0;
        }

        if (value[1] == 1 && !inputState.cameraDrag) {
            inputState.cameraDrag = true;
            event.fireEvent(event.list().START_CAMERA_DRAG, {xy:xy})
        } else if (inputState.cameraDrag == true){
            inputState.cameraDrag = false;
            event.fireEvent(event.list().STOP_CAMERA_DRAG, {})
        }

    //    console.log("mouse action:", value)
        if (value[0] == 1 && !inputState.pointerDrag) {
            inputState.pointerDrag = true;
            event.fireEvent(event.list().START_POINTER_DRAG, {xy:xy})
        } else if (value[0] == 0 && inputState.pointerDrag == true){
            inputState.pointerDrag = false;
            event.fireEvent(event.list().STOP_POINTER_DRAG, {})
        }

        setMouseForward(value)
    };

    var setupKeyboardInput = function(bindings) {
        for (var index in bindings) {
            for (var i = 0; i < bindings[index].length; i++) {
                var key = bindings[index][i];
                inputSettersGetters.registeKeyBinding(index, key);
            }
        }
    };

    var removeKeyboardInput = function(bindings) {
        for (var index in bindings) {
            for (var i = 0; i < bindings[index].length; i++) {
                var key = bindings[index][i];
                inputSettersGetters.unregisteKeyBinding(index, key);
            }
        }
    };

    var handleMouseAction = function(e) {
        var args = event.eventArgs(e);
        setMouseAction(args.action, args.xy)
    };

    var handleAddEntityKeyBindings = function(e) {
        setupKeyboardInput(event.eventArgs(e).bindings);
    };

    var handleClearEntityKeyBindings = function(e) {
        removeKeyboardInput(event.eventArgs(e).bindings);
    };

    event.registerListener(event.list().CLEAR_KEYBINDINGS, handleClearEntityKeyBindings);
    event.registerListener(event.list().ADD_KEYBINDINGS, handleAddEntityKeyBindings);
    event.registerListener(event.list().MOUSE_ACTION, handleMouseAction);

});