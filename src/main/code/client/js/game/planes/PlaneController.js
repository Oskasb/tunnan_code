"use strict";

define(["game/EntityController",
    "game/ControlsController"],
    function(
        entityController,
        controlsController
        ) {

    var toggleGears = function(entity) {
        var targetState = !entity.systems.gears.targetState;
        console.log("Toggle Gears");
        entity.controls.gears.value = targetState;
    };

    var toggleCanopy = function(entity) {
        var targetState = 1;
        var canopy = entity.systems.canopy;
        if (canopy.targetState == 1) targetState = 0;
        entity.controls.canopy.value = 1;
    };

    var fireEject = function(entity) {
        entity.controls.eject.value = 1;
    };


        var sweepMax = 6.5;
        var sweepMin = 3;
    var updateSweepControl = function(entity, sweepCtrl) {
        var state = 0;
        var speed = entity.spatial.speed;
        if (speed > sweepMax) {
            state = 1;
            if (entity.surfaces.flaps.currentState != 0) entity.pieceInput['flaps'].onChange(entity, 0, 'flaps')
        } else if (speed > (sweepMin+sweepMax)*0.5) {
            state = 0.6;
            if (entity.surfaces.flaps.currentState != 0) entity.pieceInput['flaps'].onChange(entity, 0, 'flaps')
        } else if (speed > sweepMin) {
            state = 0.3;
            if (entity.surfaces.flaps.currentState != 0) entity.pieceInput['flaps'].onChange(entity, 0, 'flaps')
        } else {
           }
        if (sweepCtrl.currentState != state) {
			entity.pieceInput['wing_sweep'].onChange(entity, state, 'wing_sweep');

            if (sweepCtrl.lights) {
                for (var i = 0; i < sweepCtrl.lights.length; i++) {
                    entity.lights[sweepCtrl.lights[i]].setIntensity(state);
                }
            }

        }
    };

    var updatePlaneControlState = function(entity, time, groundProximity) {
        if (entity.surfaces.wing_sweep) updateSweepControl(entity, entity.surfaces.wing_sweep);
        controlsController.applyInputStateToControls(entity, time, groundProximity);
    };

    return {
        updatePlaneControlState:updatePlaneControlState,
        toggleGears:toggleGears,
        toggleCanopy:toggleCanopy,
        fireEject:fireEject
    }
});
