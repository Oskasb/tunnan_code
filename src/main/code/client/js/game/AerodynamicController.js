"use strict";

define(["game/GameConfiguration",
    "game/world/Atmosphere",
    'goo/math/Vector3'
],
    function(
        gameConfig,
        Atmosphere,
        Vector3
        ) {

        var calcPosV = new Vector3();

        var updateEntityAttitude = function(entity) {
            var attitudes = new Vector3();
            var dirVec = new Vector3();
            dirVec.setVector(entity.spatial.velocity);
            dirVec.div(Math.sqrt(entity.spatial.velocity.lengthSquared()));
            attitudes.setVector(dirVec);
            entity.spatial.rot.applyPre(attitudes);
            entity.spatial.axisAttitudes = attitudes;
        };


        var calcEntityWingForces = function(wing, density, wingPos, groundProximity) {
            wing.updateWingForces(density, wingPos, groundProximity);
        };

        var updateEntityAirflowForces  = function(entity, groundProximity) {

            for (var index in entity.wings) {
                var wing = entity.wings[index];
                //    var wingAlt = wing.pos[1]+entity.spatial.pos.data[1]
                calcPosV.set(0,0,0)
                var wingPos = calcPosV;
                wingPos.setVector(wing.pos)
                entity.spatial.rot.applyPost(wingPos);
                wingPos.addVector(entity.spatial.pos)

                var alt = wingPos.data[1];
                var density = Atmosphere.getAirDensity(alt);

                //    if (alt < 0) console.log(alt)
                calcEntityWingForces(wing, density, wingPos, groundProximity);
            }
        };

        var updateEntityForces = function(entity, groundProximity) {
            entity.air.density = Atmosphere.getAirDensity(entity.spatial.pos.data[1]);
            updateEntityAirflowForces(entity, groundProximity);
        };

        var updateAerodynamicInfluences = function(entity, groundProximity) {
            updateEntityAttitude(entity);
            updateEntityForces(entity, groundProximity);
        };

        return {
            updateAerodynamicInfluences:updateAerodynamicInfluences
        }
    });
