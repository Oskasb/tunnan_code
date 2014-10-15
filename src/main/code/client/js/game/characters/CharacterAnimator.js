"use strict";

define(["application/EventManager", 'game/characters/CharacterData'
], function(event, CharacterData

    ) {

    var move = CharacterData.ANIM_STATES.movement;

    var walkSoundTimer;

    var walkSound = function(gameEntity) {
        clearTimeout(walkSoundTimer);
           reStep(gameEntity);
    };

    var reStep = function(gameEntity) {
        walkSoundTimer = setTimeout(function(){
            var selection = Math.ceil(Math.random()*3);
            var pos = gameEntity.spatial.pos.data;
        //    console.log(pos)
        //    console.log("Step Sound")
            event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()["STEP_ROAD_"+selection], pos:[pos[0], pos[1]+1, pos[2]], dir:[Math.random()-0.5,Math.random(),Math.random()-0.5]});
            walkSound(gameEntity)
        }, 300)
    };

    function selectTurnState(turn) {

        if (turn > 0) return move.turnRight;
        if (turn < 0) return move.turnLeft;
        return move.idle;
    }

    function selectStrafeState(strafe) {
        if (strafe > 0) return move.strafeRight;
        if (strafe < 0) return move.strafeLeft;
        return move.idle;
    }

    function selectForwardState(forward) {
        if (forward > 0) return move.forward;
        if (forward < 0) return move.back;
        return move.idle;
    }

    function selectMixState(forward, strafe) {
        if (forward > 0) {
            if (strafe > 0) return move.halfStrafeRight;
            if (strafe < 0) return move.halfStrafeLeft;
        }
        if (forward < 0) {
            if (strafe > 0) return move.backRight;
            if (strafe < 0) return move.backLeft;
        }
        return move.idle;
    }

    function selectFromMoveAxis(forward, strafe, turn) {

        if (forward == 0 && strafe == 0) {
            return selectTurnState(turn)
        }

        if (strafe == 0) {
            return selectForwardState(forward)
        }

        if (forward == 0) {
            return selectStrafeState(strafe)
        }
        return selectMixState(forward, strafe)


    }

    function moveToAnimState(moveStates) {

        var forwardAxis = moveStates.forward - moveStates.back;
        var strafeAxis = moveStates.strafe * (moveStates.turnright - moveStates.turnleft)
        var turn = (1 - moveStates.strafe) * (moveStates.turnright - moveStates.turnleft) + moveStates.mouseturn

        return selectFromMoveAxis(forwardAxis, strafeAxis, turn)
    }

    function applyEntityAnimationState(gameEntity, state) {


		// 	var newLayer = gameEntity.geometries[0].animationComponent.layers[0].getStateByName(state);

       var newLayer = gameEntity.animStateMap[state];
        console.log(state, newLayer, gameEntity)

        gameEntity.geometries[0].animationComponent.transitionTo(newLayer);

            if (state == move.idle || state == 'sit'  || state == 'pilot_sit' || state == 'jumpstate') {

                clearTimeout(walkSoundTimer);
            } else {
                if (gameEntity.currentMovementAnimState = !state) {
    //                console.log(state)
                    walkSound(gameEntity);
                }

            }

    }

    function applyMovementAnimation(gameEntity) {
        var moveAnims = gameEntity.pieceData.animations.moveStates;
    //    console.log(gameEntity.currentMovementAnimState)
        applyEntityAnimationState(gameEntity, moveAnims[gameEntity.currentMovementAnimState])
    //    console.log("Select Layer: ", newLayer)
    }

    function checkAnimationComponentState(entity, state) {
        var targetLayer = entity.pieceData.animations[state];
        var currentState = entity.animationComponent.getCurrentState();
        if (currentState.name != targetLayer) {
            return currentState.name
        }
    }

    var reTransTimer;

    function reTransit(entity, moveStates) {
        clearTimeout(reTransTimer);
        reTransTimer = setTimeout(function() {
            updateCharacterMovementAnimation(entity, moveStates);
        }, 100)
    }

    var updateCharacterMovementAnimation = function(gameEntity, moveStates) {
        if (gameEntity.isPilot) {
            return;//    reTransit(gameEntity, moveStates);
        }

        if (!gameEntity.geometries[0].animationComponent) {
            alert("No Animation");
            console.log(gameEntity.geometries[0])
        }

        if (!gameEntity.geometries[0].animationComponent.getCurrentState()) {
            reTransit(gameEntity, moveStates);
            return;
        }

        var moveState = move.jumpState;

        if (gameEntity.moveSphere.spatialControl.sphereMovement.groundContact) {
            moveState = moveToAnimState(moveStates);
        }


        if (gameEntity.geometries[0].animationComponent.getCurrentState()._name == undefined) {
            reTransit(gameEntity, moveStates);
            return;
        }

        if (gameEntity.currentMovementAnimState == moveState) return;
        gameEntity.currentMovementAnimState = moveState;

        applyMovementAnimation(gameEntity);
    };


    return {
        applyMovementAnimation:applyMovementAnimation,
        applyEntityAnimationState:applyEntityAnimationState,
        updateCharacterMovementAnimation:updateCharacterMovementAnimation
    }
});