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
				"lifespan":[0,25*Math.random()*Math.random()*Math.random()],
				"size": [0.1,0.5],
				"rotation": [0,6],
				"spinspeed":[-0.1,0.1],
				"spin":"oneToZero",
				"gravity": 0,
				"count": 4,
				"spread": 0.1,
				"stretch": 1,
				"strength":16,
				"acceleration": 0.98,
				"alpha":[[0, 1], [0.1, 0.06],[0.3, 0.04], [1, 0]],
				"growth":[[0, 1], [0.05, 0.8],[0.3, 0.3], [1, 1]],
				"growthFactor":[2, 5],
				"sprite":"smokey"
			};


			SystemBus.emit('playVaporEffect', {pos:calcVec, vel:calcVec2, effectData:effectData});


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
