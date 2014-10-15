"use strict";

define(["game/GameConfiguration",
    'game/world/WorldEffects',
    'game/world/Clouds',
],
    function(
        gameConfig,
        worldEffects,
        Clouds
        ) {

        var getAirDensity = function(altitude) {
            var bDdensity = gameConfig.AERODYNAMICS.airMassDensity;
            var aDens = 0.9 * Math.max(0, 1 - (altitude * 0.8 * gameConfig.AERODYNAMICS.densityPerMeter));
            aDens += 0.1 * Math.max(0, 1 - (altitude * 0.14 * gameConfig.AERODYNAMICS.densityPerMeter));
            if (altitude < 0) aDens = 1000;
            return aDens;
        };

        return {
            getAirDensity:getAirDensity
        }
    });
