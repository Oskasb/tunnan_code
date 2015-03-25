define([
    'goo/math/Vector3',
    'game/characters/CharacterAnimator'
], function(
    Vector3,
    CharacterAnimator
    ) {
    'use strict';

    var movement = new Vector3();
    var torqueVector = new Vector3(0, 0, 0);

    var moveControlStates = {
        forward:0,
        back:0,
        turnleft:0,
        turnright:0,
        mouseturn:0,
        mouseforward:0,
        strafe:0,
        jump:0
    };

    var updated = false;

    function calcMove(sourceRot, targetVelocity, targetHeading){
        sourceRot.rotateY(targetHeading.data[1]);
        movement.set(targetVelocity.data[2], targetVelocity.data[1],targetVelocity.data[0]);
        sourceRot.applyPost(movement);
        return movement;
    }

    function updateMovementState(sphereMovement, moveStates) {
        if (moveStates.mouseforward) moveStates.forward = moveStates.mouseforward;
        sphereMovement.applyForward(moveStates.forward - moveStates.back);
        if (moveStates.strafe) {
            sphereMovement.applyStrafe(moveStates.turnright - moveStates.turnleft);
            sphereMovement.applyTurn(moveStates.mouseturn);
        } else {
            sphereMovement.applyStrafe(0);
            sphereMovement.applyTurn(0.05*(moveStates.turnleft - moveStates.turnright));
        }
        sphereMovement.applyJump(moveStates.jump);
        moveStates.jump = 0;
        sphereMovement.updateTargetVectors();
    }

    function applySphereImpulse(entity, targetVelocity) {
        var ammoComponent = entity.moveSphere.ammoComponent;

        torqueVector.setValue(0,0,0);
        ammoComponent.setAngularVelocity(torqueVector);
        torqueVector.setValue(ammoComponent.getLinearVelocity().getX()*0.5, ammoComponent.getLinearVelocity().getY(), ammoComponent.getLinearVelocity().getZ()*0.5);

        if (targetVelocity.lengthSquared() < 1) {
            torqueVector.setValue(ammoComponent.getLinearVelocity().getX()*0.5, ammoComponent.getLinearVelocity().getY(), ammoComponent.getLinearVelocity().getZ()*0.5);
            ammoComponent.setLinearVelocity(torqueVector);
        }



        torqueVector.setValue(targetVelocity.data[0], targetVelocity.data[1],targetVelocity.data[2]);
        ammoComponent.clearForces();
        ammoComponent.applyTorqueImpulse(torqueVector);

        if(targetVelocity.data[1] != 0) {
            torqueVector.setValue(0, targetVelocity.data[1], 0);
            ammoComponent.applyCentralImpulse(torqueVector);
            //   this.sphereMovement.groundContact = 0;
        }
        ammoComponent.activate();
    }

    function controlStateChanged(entity, moveStates) {
    //    console.log("Walk the sphere: ", entity);
        updateMovementState(entity.moveSphere.spatialControl.sphereMovement, moveStates);
        CharacterAnimator.updateCharacterMovementAnimation(entity, moveStates)
    }

    function readMovestate(sphereMovement) {
        return {
            vel:sphereMovement.getTargetVelocity(),
            rot:sphereMovement.getTargetHeading()
        }
    }

    function applyMovementState(entity) {
        var mState = readMovestate(entity.moveSphere.spatialControl.sphereMovement);
        var moveVec = calcMove(entity.spatial.rot, mState.vel, mState.rot);
        applySphereImpulse(entity, moveVec);
        if (mState.vel.data[1]) mState.vel.data[1] = 0;
    }

    function triggerControlStateChange(control, value) {
        if (value == undefined) value = 0;
    //    console.log("Movement control statechange: ", control, value);
        moveControlStates[control] = value;
        updated = true;
    }

    var updateTimeout;

    function updateCharacterControlState(entity) {
        for (var each in entity.pieceInput.controls) {
            if (entity.pieceInput.controls[each].update) {
                triggerControlStateChange(each, entity.pieceInput.controls[each].value);
                entity.pieceInput.controls[each].update = false;
            }
        }

        if (updated) {
            controlStateChanged(entity, moveControlStates);
            updated = false;

            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function(){
            //    CharacterAnimator.applyMovementAnimation(entity)
                updated = true;
            }, 100)
        }

        applyMovementState(entity);
    }

    return {
        updateCharacterControlState:updateCharacterControlState
    };

});