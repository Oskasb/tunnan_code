"use strict";

define(["application/EventManager", "3d/GooJointAnimator"], function(event, boneAnimator) {

    var buildSystem = function(entity, data, landed) {
        var state = 0;
        if (landed) state = 1;
        var seat = {
            targetState:state,
            currentState:state,
            seats:data.controls.seats,
            speed:data.speed,
            locked:true
        };
        return seat;
    };

    var fireEjectionSeat = function(entity) {
        entity.systems.canopy.targetState = 1.2;
        entity.systems.canopy.locked = false;
        var tossSeat = function() {
            entity.systems.seat.ejectionTime = new Date().getTime();
            entity.systems.seat.locked = false;
        }
        event.fireEvent(event.list().SEQUENCE_CALLBACK, {wait:800, callback:tossSeat})

    };

    var processControlState = function(entity, time) {
        return
        if (entity.seat.locked) return;
        var controls = entity.pieceData.seat.controls

        var speed = entity.seat.speed;
    //    if (entity.seat.targetState < entity.seat.currentState) speed = -speed;

        var timeElapsed = new Date().getTime() - entity.seat.ejectionTime;

        var controlValue = entity.seat.currentState + speed;
    //    console.log(controlValue, entity.seat.targetState, controlValue - entity.seat.targetState)

        var xSpeed = controlValue  * (speed-Math.pow( timeElapsed*0.0001 ,2));

    //    console.log(controlValue)

        var seats = controls.seats;
        //    var stands = controls.stands;

        var updateSlideSeatBones = function(boneMap, ctrl, ctrlValue) {

            for (var bones in boneMap) {
                var boneId = entity.pieceData.boneMap[bones];
                var bone = entity.pieceData.bones[boneId];
                var dx = bone.basePos[0] + xSpeed * controls[ctrl][bones][0];
                var dy = bone.basePos[1] + ctrlValue * controls[ctrl][bones][1]
                var dz = bone.basePos[2] + ctrlValue  * controls[ctrl][bones][2]
                boneAnimator.translateBone(bone, dx, dy, dz);
            }
        };

        updateSlideSeatBones(seats, "seats", controlValue);
        entity.seat.currentState = controlValue;
    };

    return {
        fireEjectionSeat:fireEjectionSeat,
        processControlState:processControlState,
        buildSystem:buildSystem
    }
});