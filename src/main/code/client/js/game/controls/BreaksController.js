"use strict";

define(["application/EventManager", "3d/GooJointAnimator"], function(event, GooJointAnimator) {




    var buildSystem = function(entity, data, state) {
        var breakSystem = {
            targetState:state,
            currentState:0,
            lights:data.lights,
            type:data.type,
            breaks:data.breaks,
            speed:data.speed,
            locked:false
        };
        return breakSystem;
    };

    var breaks;

    var applyControlStateToBreaks = function(entity, state) {
        breaks = entity.systems.breaks;
        if (state == undefined) state = breaks.currentState;
        breaks.targetState = state;
        breaks.locked = false;
        return state;
    };

    var updateBreaksBones = function(entity, bone, comp) {
        var boneId = entity.pieceData.boneMap[bone];
        var bone = entity.animationChannels[boneId];
        GooJointAnimator.rotateBone(bone, comp)
    };


    var speed;
    var breakMap;
    var controls;
    var diff;
    var sign;

    var processControlState = function(entity) {
        breaks = entity.systems.breaks;
        if (breaks.locked) return;
        controls = entity.pieceData.systems.breaks.controls

        diff = breaks.targetState - breaks.currentState;
        if (diff == 0) return;
        sign = diff > 0 ? 1 : diff == 0 ? 0 : -1;
        breaks.currentState += sign * breaks.speed;
        breaks.currentState = Math.max(breaks.currentState, 0);
        breaks.currentState = Math.min(breaks.currentState, 1);



        speed = breaks.speed;

        if (breaks.targetState < breaks.currentState) speed = -speed;

        var controlValue = breaks.currentState + speed;

        if (Math.abs(controlValue - breaks.targetState) <= speed ) {
            controlValue = breaks.targetState;
            breaks.locked = true;
        }

        if (entity.isPlayer) {
        //    event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"breaks", currentState:controlValue})
        }

        breakMap = controls.breaks;
        //    var stands = controls.stands;

        if (breaks.lights) {
            for (var i = 0; i < breaks.lights.length; i++) {
                entity.lights[breaks.lights[i]].setIntensity(controlValue);
            }
        }

        var updateSlideBreaksBones = function(boneMap, ctrl, ctrlValue) {

            for (var bones in boneMap) {
                updateBreaksBones(entity, bones, ctrlValue*boneMap[bones], controls[ctrl][bones]);
            }
        };

        updateSlideBreaksBones(breakMap, "breaks", controlValue);
		entity.pieceInput.setAppliedState('breaks', controlValue);
        breaks.currentState = controlValue;
    };

    return {
        processControlState:processControlState,
        applyControlStateToBreaks:applyControlStateToBreaks,
        buildSystem:buildSystem
    }
});