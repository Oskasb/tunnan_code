"use strict";

define(["application/EventManager",
    "game/planes/PlaneEngine"
], function(
    event,
    PlaneEngine
    ) {


    var buildEngine = function(entity, type, engineData) {
        var engine = new PlaneEngine(entity, type, engineData);
        return engine;
    };

    var buildSystem = function(entity, engineData) {
        var engines = [];
        for (var index in engineData.controls) {
    //        console.log("build engine: ", index)
            for (var i = 0; i < engineData.mounts.length; i++) {
                engines.push(buildEngine(entity, index, engineData.mounts[i]))
            }
        }
        return engines;
    };


    var updateEngineThrottle = function(engine, targetValue) {

    //    console.log(engine.thrust, targetValue)
        engine.targetState = targetValue;
    };

    var applyControlStateToEngines = function(entity, value) {

        for (var i = 0; i < entity.systems.engines.length; i++) {

            var engine = entity.systems.engines[i];
            if (value == undefined) value = engine.currentState;
            updateEngineThrottle(engine, value);

        }
        return value;
    };




    var processControlState = function(entity) {
          var engines = entity.systems.engines;
        for (var i = 0; i < engines.length; i++) {
            var engine = engines[i];
            var current = engine.currentState
            engine.updateThrust(entity.air.density);
        }
        if (current == engine.currentState) return;
        if (entity.isPlayer) {
            event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"engines", currentState:current})
        }
		entity.pieceInput.setAppliedState('throttle', current);
    };

    return {
        applyControlStateToEngines:applyControlStateToEngines,
        processControlState:processControlState,
        buildSystem:buildSystem
    }
});
