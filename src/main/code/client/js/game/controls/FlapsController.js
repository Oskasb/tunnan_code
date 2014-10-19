"use strict";

define(["application/EventManager", "3d/GooJointAnimator"],function(event, GooJointAnimator) {

    var buildFlaps = function(data) {
        var flaps = {
			data:data,
            currentState: 0,
            targetState: 0,
            speed:data.speed,
            locked:false
        };
        return flaps;
    };

    var applyControlStateToFlaps = function(entity, state) {
        console.log("Fire Flaps change", state)
    //    var targetState = 1;
    //    if (!state) targetState = 0;
        var flaps = entity.surfaces.flaps;
        if (state == undefined) state = flaps.currentState;
        flaps.targetState = state;
        flaps.locked = false;
        return state;
    };

    var processControlState = function(entity) {
        var flaps = entity.surfaces.flaps;
        if (flaps.locked) return;
        var diff = flaps.targetState - flaps.currentState;
        if (diff == 0) return;
        var sign = diff > 0 ? 1 : diff == 0 ? 0 : -1;
        flaps.currentState += sign * flaps.speed;
        flaps.currentState = Math.max(flaps.currentState, 0);
        flaps.currentState = Math.min(flaps.currentState, 1);


        if (entity.isPlayer) {
            event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"flaps", currentState:flaps.currentState})
        };
    //    return;

        var controls = entity.pieceData.surfaces.flaps.controls
        var speed = entity.pieceData.surfaces.flaps.speed;
        if (flaps.targetState < flaps.currentState) speed = -speed;

        var controlValue = flaps.currentState + speed;
        if (Math.abs(controlValue - flaps.targetState) <= speed ) {
            controlValue = flaps.targetState;
            flaps.locked = true;
        };

        var flapMap = controls.flaps;



            var updateFlapBones = function(boneMap, ctrl, ctrlValue) {
                console.log(boneMap, ctrl, ctrlValue)
                for (var bones in boneMap) {
                    var boneId = entity.pieceData.boneMap[bones];
                    var bone = entity.animationChannels[boneId];
                    var controlDelta = ctrlValue * controls[ctrl][bones];

                    //
                    GooJointAnimator.rotateBone(bone, controlDelta, 0, 0)
                }
            };

        updateFlapBones(flapMap, "flaps", controlValue);
		entity.pieceInput.setAppliedState("flaps", controlValue);
        flaps.currentState = controlValue;
    };

    return {
        applyControlStateToFlaps:applyControlStateToFlaps,
        processControlState:processControlState,
        buildFlaps:buildFlaps
    }
});
