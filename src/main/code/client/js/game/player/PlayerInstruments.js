"use strict";

define([
    "application/EventManager",
    "goo/math/Vector3",
    "3d/GooJointAnimator",
    "game/GameConfiguration",
    "game/GameUtil",
    'game/instruments/Instrument',
	'data_pipeline/PipelineAPI'
],
    function(
        event,
        Vector3,
        GooJointAnimator,
        gameConfig,
        GameUtil,
        Instrument,
		PipelineAPI
        ) {

        var playerController;
        require(['game/player/PlayerController'], function(pc) {
            playerController = pc;
        });

        var timeElapsed = 0;
        var framesElapsed = 0;
        var playerEntity;
        var calcVec = new Vector3();
        var calcVec2 = new Vector3();
        var physTime = gameConfig.RENDER_SETUP.physicsFPS;

        var aggregates = {
            speed:0,
            g:0
        };

        var updatePlayerValues = function(entity, partOfsecond, dt) {

            if(entity.measurements.throttle) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"throttle", amount:playerEntity.systems.engines[0].thrust * 0.001});
            if(entity.measurements.speed)    event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"speed",    amount:3.6 * aggregates.speed * partOfsecond});
            if(entity.measurements.altitude) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"altitude", amount:playerEntity.spatial.pos[1]});
            if(entity.measurements.airflowx) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"airflowx", amount:90*playerEntity.spatial.axisAttitudes.data[0]});
            if(entity.measurements.airflowy) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"airflowy", amount:90*playerEntity.spatial.axisAttitudes.data[1]});
            if(entity.measurements.airflowz) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"airflowz", amount:90*playerEntity.spatial.axisAttitudes.data[2]});
            if(entity.measurements.gForce)   event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"gForce",   amount:1 + aggregates.g * 9.81 / (dt * 0.001) });

            timeElapsed = 0;
            framesElapsed = 0;
            aggregates.speed = 0;
            aggregates.g = 0;

        };


        var updateInstrumentRotX = function(boneId, value) {
            var bone = playerEntity.animationChannels[playerEntity.pieceData.boneMap[boneId]];
            if (bone) GooJointAnimator.rotateBone(bone, value)
        };

        var updateIntrumentTranslation = function(boneId, trans) {
            var bone = playerEntity.animationChannels[playerEntity.pieceData.boneMap[boneId]];
            if (bone) GooJointAnimator.translateBone(bone, trans)

        };

        var getEntityHeading = function(entity) {
            return Math.atan2(entity.spatial.velocity.data[0], -entity.spatial.velocity.data[2]);
        };

        var getInterpolatedInCurveAboveIndex = function(value, curve, index) {
            return curve[index][1] + (value - curve[index][0]) / (curve[index+1][0] - curve[index][0])*(curve[index+1][1]-curve[index][1]);
        };

        var fitValueInCurve = function(value, curve) {

            for (var i = 0; i < curve.length; i++) {
                if (curve[i+1][0] > value) return getInterpolatedInCurveAboveIndex(value, curve, i)
            }
            return 0;
        };

	    var sampled;

	    var printInstrumentState = function(entity, rotVec, physTime) {
		    calcVec2.set(rotVec);
		    var xyHeading = getEntityHeading(entity);
		    var rollAng = Math.atan2(calcVec2.data[0], calcVec2.data[1]);
		    sampled = {
			    rotVec:rotVec,
			    xyHeading:xyHeading,
			    rollAng:rollAng,
			    pitch:rotVec.data[2],
			    altitude:entity.spatial.pos[1],
			    speed:Math.sqrt(entity.spatial.audioVel.lengthSquared()),
			    g:entity.forces.g.data[1]*physTime,
			    acc:entity.forces.g,
			    aoa:entity.spatial.axisAttitudes.data[1],
			    climbRate:entity.spatial.velocity.data[1] * physTime,
			    rpm:entity.systems.engines[0].rpm,
			    temp:entity.systems.engines[0].temp
		    };
	    };

	    var readSampledValue = function(key) {
		    return sampled[key];
	    };

        var updateEntityInstruments = function(entity, rotVec, physTime) {
            if (entity.systems == undefined) return;
	        printInstrumentState(entity, rotVec, physTime);

            var value;
            for (var index in entity.instruments) {
                if (entity.instruments[index].sample) {
                    entity.instruments[index].setValue(readSampledValue(entity.instruments[index].sample));
                    if (entity.instruments[index].axisAmp.length) {

                        value = entity.instruments[index].applyVector(entity.instruments[index].getValue());

                        updateIntrumentTranslation(entity.instruments[index].getBoneName(), value);
                    } else {
                        value = entity.instruments[index].getValue();

                        if (entity.instruments[index].curve) value = GameUtil.fitValueInCurve(value, entity.instruments[index].curve)

                        updateInstrumentRotX(entity.instruments[index].getBoneName(), entity.instruments[index].axisAmp*value);
                    }
                }
            }
        };


        var updatePlayerAnimations = function() {
            playerEntity = playerController.getPlayerEntity();
            calcVec.setd(0, 1, 0);
            playerEntity.spatial.rot.applyPre(calcVec);
            updateEntityInstruments(playerEntity, calcVec, physTime)
        };

        var updatePlayerSpecifics = function(e) {
            playerEntity = playerController.getPlayerEntity();
            if (!playerEntity) return;
            var time = event.eventArgs(e).frameTime;
            calcVec.set(0, 0, 1);
            playerEntity.spatial.rot.applyPost(calcVec);
            event.fireEvent(event.list().MOVE_AUDIO_LISTENER, {pos:playerEntity.spatial.pos.data, rot:calcVec.data, vel:playerEntity.spatial.audioVel.data});
            timeElapsed += time;
            framesElapsed += 1;
            aggregates.speed += playerEntity.spatial.speed;
            aggregates.g += playerEntity.forces.g.data[1] // gameConfig.RENDER_SETUP.physicsFPS;
            var stepTime = 250;
            var partOfsecond = 1000 / timeElapsed;
        //    updatePlayerValues(playerEntity, partOfsecond, timeElapsed)
            updatePlayerAnimations();
        };


        var registerInstrument = function(entity, instrumentId, instrument, curve) {
            entity.instruments[instrumentId] = new Instrument(instrumentId, instrument.axisAmp, instrument.sample, curve, instrument.boneName)
        };



        var registerEntityInstruments = function(entity, instrumentData, instrumentCurves) {
            entity.instruments = {};

			for (var i = 0; i < instrumentData.length; i++) {
				registerInstrument(entity, instrumentData[i].id, instrumentData[i], instrumentCurves[instrumentData[i].curve]);
			}

            entity.measurements = entity.pieceData.measurements

        };


        var initInstruments = function(entity, instrumentData, instrumentCurves) {



            registerEntityInstruments(entity, instrumentData, instrumentCurves);
            event.registerListener(event.list().UPDATE_ACTIVE_ENTITIES, updatePlayerSpecifics);
        };


        return {
            initInstruments:initInstruments
        }
    });
