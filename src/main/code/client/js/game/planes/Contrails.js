"use strict";

define([
    "goo/entities/SystemBus",
    'game/GameUtil',
    'goo/math/Vector3'
],
    function(
		SystemBus,
        gameUtil,
        Vector3
        ) {

        var calcVec = new Vector3();
		var calcVec2 = new Vector3();

        function smokeSourceEmit(entity, emitPos) {
            calcVec.set(emitPos);
         //   console.log(emitPos)
            gameUtil.applyRotationToVelocity(entity.geometries[0], calcVec);

			calcVec.addv(entity.spatial.pos);
			calcVec.subv(entity.spatial.velocity);
			calcVec2.set(entity.spatial.velocity);
			calcVec2.mul(2);
			var effectData = {
				lifespan:Math.random()*Math.random()*40*Math.random()*Math.random()
			};

			SystemBus.emit('playVaporEffect', {effectName:'white_smoke_stream', pos:calcVec, vel:calcVec2, effectData:effectData});


       //     event.fireEvent(event.list().ACROBATIC_SMOKE, {pos:[calcVec.data[0], calcVec.data[1], calcVec.data[2]], count:1, dir:entity.spatial.velocity.data});
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
