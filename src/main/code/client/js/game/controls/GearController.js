"use strict";

define(["application/EventManager", "3d/GooJointAnimator", 'game/parts/WheelPart', "game/controls/SurfaceController"], function(event, GooJointAnimator, WheelPart, surfaceController) {

    var addWheels = function(wheelData) {
        var wheels = [];
        for (var index in wheelData) {
            wheels.push(new WheelPart(index, wheelData[index]))
        }
        return wheels;
    };

    var buildSystem = function(entity, data, state) {
        var gears = {
			data:data,
            doors:data.controls.doors,
            stands:data.controls.stands,
            lights:data.controls.lights,
            wheels:addWheels(data.wheels),
            speed:data.speed,
            targetState:state,
            currentState:state,
            locked:false
        };
        return gears;
    };

    var setEntityGearTargetState = function(entity, state) {
        console.log("Toggle Gear Target State - >", entity, state)
        var targetState = 1;
        if (!state) targetState = 0;
        entity.systems.gears.targetState = targetState;
        entity.systems.gears.locked = false;
    };


    var processControlState = function(entity) {
        var system = entity.systems.gears;
    //    console.log("Update Gear state:", entity)
        if (system.currentState == 1) // checkGroundContact(entity, groundProximity);
        if (system.locked) return;
        var controls = entity.systems.gears.data.controls

        var speed = system.speed;
        if (system.targetState < system.currentState) speed = -speed;

        var controlValue = system.currentState + speed;
        if (Math.abs(controlValue - system.targetState) <= system.speed ) {
            controlValue = system.targetState;
            system.currentState = controlValue;
            system.locked = true;
        };

        if (entity.isPlayer) {
            event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"gears", currentState:controlValue})
        }

        var doors = controls.doors;
        var stands = controls.stands;
        if (controls.lights) {
            for (var i = 0; i < controls.lights.length; i++) {
                 entity.lights[controls.lights[i]].setIntensity(controlValue);
            }
        }

        var updateGearBones = function(boneMap, ctrl, ctrlValue) {
            for (var bones in boneMap) {
                var boneId = entity.pieceData.boneMap[bones];
            //    console.log(entity.animationChannels)
                var bone = entity.animationChannels[boneId];
                var axisAmps = controls[ctrl][bones];
             //   console.log(controls[ctrl][bones])
                GooJointAnimator.rotateBone(bone, ctrlValue*axisAmps[0], ctrlValue*axisAmps[1], ctrlValue*axisAmps[2])
            }
        };

        updateGearBones(doors, "doors", Math.min(controlValue*1.6, 1));
        updateGearBones(stands, "stands", Math.max((1.6 * controlValue) - 0.6, 0));
		entity.pieceInput.setAppliedState("gears", controlValue);
        system.currentState = controlValue;
		surfaceController.applyControlStateToSurface(entity, controlValue, "gears");
    };

    return {
        processControlState:processControlState,
        setEntityGearTargetState:setEntityGearTargetState,
        buildSystem:buildSystem
    }
});