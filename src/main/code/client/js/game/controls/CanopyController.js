"use strict";

define(["game/GameConfiguration", "application/EventManager", "3d/GooJointAnimator"], function(gameConfig, event, GooJointAnimator) {

    var buildSystem = function(entity, data, landed) {
        var state = 0;
        if (landed) state = 1;
        var canopy = {
			data:data,
            targetState:state,
            currentState:state,
            doors:data.controls.doors,
            type:data.type,
            speed:data.speed,
            locked:false
        };
        return canopy;
    };

    var setEntityCanopyTargetState = function(entity, state) {
        console.log("Toggle Canopy Target State - >", entity, state)
        entity.systems.canopy.targetState = state;
        entity.systems.canopy.locked = false;
    };

    var fireCanopyEject = function(entity) {
        var canopy = entity.systems.canopy;
        canopy.targetState = 1.5;
        canopy.speed = canopy.speed * 4;
        canopy.locked = false;
    };

    var updateCanopyBone = function(entity, bone, comp, axis, xform) {
        var boneId = entity.pieceData.boneMap[bone];
        var bone = entity.animationChannels[boneId];
        if (xform == "rotate") {
            GooJointAnimator.rotateBone(bone, axis[0]*-comp , axis[1]*-comp, axis[2]*-comp)
        } else {
            GooJointAnimator.translateBone(bone, [axis[0]*-comp , axis[1]*-comp, axis[2]*-comp])
        }


    };

    var processControlState = function(entity) {
        var canopy = entity.systems.canopy
        if (canopy.locked) return;
        var controls = entity.systems.canopy.data.controls

        var speed = canopy.speed;

        if (canopy.targetState < canopy.currentState) speed = -speed;

        var controlValue = canopy.currentState + speed;




        if (Math.abs(controlValue - canopy.targetState) <= canopy.speed ) {
            controlValue = canopy.targetState *1;
            canopy.locked = true;
            console.log("Lock Canopy", controlValue)
        };

        if (entity.isPlayer) {
            event.fireEvent(event.list().MIX_CHANNEL_VALUE, {channelId:gameConfig.MIX_TRACKS.game.id, valueId:"tuneGain", amount:0.5 +Math.sin(1.68*controlValue)*0.5});
            event.fireEvent(event.list().MIX_CHANNEL_VALUE, {channelId:gameConfig.MIX_TRACKS.game.id, valueId:"tuneFilterFreq", amount:0.01+(Math.sin(1.68*controlValue))});
            event.fireEvent(event.list().MIX_CHANNEL_VALUE, {channelId:gameConfig.MIX_TRACKS.game.id, valueId:"tuneFilterQ", amount:0.01+controlValue*controlValue*0.04});
            event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"canopy", currentState:controlValue})
        }

        var doors = controls.doors;
    //    var stands = controls.stands;

        var updateCanopyBones = function(boneMap, ctrl, ctrlValue, xform) {

            for (var bones in boneMap) {
                 updateCanopyBone(entity, bones, ctrlValue, controls[ctrl][bones], xform);
            }
        };

        updateCanopyBones(doors, "doors", controlValue, controls.xform);
		entity.pieceInput.setAppliedState('canopy', controlValue);
        canopy.currentState = controlValue;
    };

    return {
        processControlState:processControlState,
        fireCanopyEject:fireCanopyEject,
        setEntityCanopyTargetState:setEntityCanopyTargetState,
        buildSystem:buildSystem
    }
});