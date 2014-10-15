"use strict";

define([
	"application/EventManager",
	"3d/GooJointAnimator",
	'goo/math/MathUtils'
],function(
	event,
	GooJointAnimator,
	MathUtils
	) {

    var buildSurface = function(data) {
        var surface = {
			lastSpeed: 0,
            currentState: 0,
            targetState: 0,
            trimState: 0,
            speed:data.speed,
            release:data.inputBehavior.release,
            lights:data.lights,
            locked:false
        };

        return surface;
    };

    var applyControlStateToSurface = function(entity, value, surfac) {
        var surface = entity.surfaces[surfac];
    //    console.log("Fire Surface change", surface, value);
        if (value == undefined) {
            if (surface.release) {
                value = 0;
            } else {
                value = surface.currentState;
            }
        }
        surface.targetState = value;
        surface.locked = false;

        return value;
    };

    var applyTrimStateToSurface = function(entity, value, surfac) {
        var surface = entity.surfaces[surfac];
    //       console.log("Fire Trim change", surface, value)
        if (value == undefined) value = 0;
        surface.trimState += 0.02*value;
        surface.trimState = Math.min(surface.trimState, 0.95);
        surface.trimState = Math.max(surface.trimState, -0.95);
        surface.locked = false;

		if (entity.isPlayer) {
			event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"trim_"+surfac, currentState:surface.trimState})
		}

        return value;
    };

    var zeroSurfaceTrimState = function(entity, surfac) {
        entity.surfaces[surfac].trimState = 0;
		updateSurfaceState(entity, surfac);
		if (entity.isPlayer) {
			event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"trim_"+surfac, currentState:0})
		}
    };

    var updateSurfaceState = function(entity, surfac) {

        var surface = entity.surfaces[surfac];
        var surfaceData = entity.pieceData.surfaces[surfac];

        if (surface.locked) return;

        var diff = surface.targetState - surface.currentState;
    //    if (diff == 0) return;

        var controls = surfaceData.controls;
        var speed = surfaceData.speed; // (0.5 + entity.spatial.speed*0.7) ;

		var velocityMod = 1/(1+entity.spatial.speed*entity.spatial.speed*0.03);

        speed = speed*diff*velocityMod;

		speed = MathUtils.lerp(0.5,surface.lastSpeed, speed);
		surface.lastSpeed = speed;

        var controlValue = (surface.currentState + speed) // *velocityMod;


        if (Math.abs(controlValue - surface.targetState) <= speed ) {
            controlValue = surface.targetState;
            surface.locked = true;
        }


        if (entity.isPlayer) {
            event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:surfac, currentState:controlValue});
        //    if (surface.trimState != undefined) event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"trim_"+surfac, currentState:surface.trimState*2})
        }

        for (var index in controls) {

            var flaerp = controls[index];
            var updateSurfaceBones = function(boneMap, ctrl, ctrlValue, trimState) {
				trimState = trimState || 0;
                for (var bones in boneMap) {
                    var boneId = entity.pieceData.boneMap[bones];
                    var bone = entity.animationChannels[boneId];
                    var controlDelta = (ctrlValue+trimState) * controls[ctrl][bones];

                    if (ctrl == 'spoiler') {
                        if (entity.surfaces.wing_sweep.currentState > 0.5) controlDelta = 0;
                        if (controlValue > 0) {
                            controlDelta = Math.sqrt(Math.max(0, -controlDelta));
                        } else {
                            controlDelta = -Math.sqrt(-Math.min(0, controlDelta));
                        }
                    }

					if (trimState) {
					//	controlDelta = +trimState
					}
                    if (bone) GooJointAnimator.rotateBone(bone, controlDelta, 0, 0)
                }
            };

            updateSurfaceBones(flaerp, index, controlValue, surface.trimState);

        }

		entity.pieceInput.setAppliedState(surfac, controlValue);
        surface.currentState = controlValue;
    };

    var processControlState = function(entity) {
        for (var index in entity.surfaces)
        updateSurfaceState(entity, index);
    };

    return {
        applyControlStateToSurface:applyControlStateToSurface,
        applyTrimStateToSurface:applyTrimStateToSurface,
        processControlState:processControlState,
        zeroSurfaceTrimState:zeroSurfaceTrimState,
        buildSurface:buildSurface
    }
});
