"use strict";

define([
    "application/EventManager",
    'game/GameUtil',
    'goo/math/Vector3'
],
    function(
        event,
        gameUtil,
        Vector3
        ) {

        var calcVec = new Vector3();


        function smokeSourceEmit(entity, emitPos) {
            calcVec.set(emitPos);
         //   console.log(emitPos)
            gameUtil.applyRotationToVelocity(entity.geometries[0], calcVec);

            calcVec.addv(entity.spatial.pos);
            event.fireEvent(event.list().ACROBATIC_SMOKE, {pos:[calcVec.data[0], calcVec.data[1], calcVec.data[2]], count:1, dir:[entity.spatial.velocity.data[0]*0.03,entity.spatial.velocity.data[1]*0.03,entity.spatial.velocity.data[2]*0.03]});
        //    calcVec.addv(entity.spatial.velocity);
        //    event.fireEvent(event.list().ACROBATIC_SMOKE, {pos:[calcVec.data[0], calcVec.data[1], calcVec.data[2]], count:1, dir:[0.44*(Math.random()-0.5), 0.44*(Math.random()-0.5), 0.44*(Math.random()-0.5)]});
        //    calcVec.addv(entity.spatial.velocity);
        //    event.fireEvent(event.list().ACROBATIC_SMOKE, {pos:[calcVec.data[0], calcVec.data[1], calcVec.data[2]], count:1, dir:[0.64*(Math.random()-0.5), 0.64*(Math.random()-0.5), 0.64*(Math.random()-0.5)]});
        }


        function puffWingSmoke(entity) {
            var wing_smoke = entity.pieceData.wing_smoke;
            for (var i = 0; i < wing_smoke.length; i++) {
                smokeSourceEmit(entity, wing_smoke[i])
            }
        };

        return {
            puffWingSmoke:puffWingSmoke
        }
    });
