"use strict";



define([
    'goo/math/Vector3',
	'goo/math/Matrix3x3',
    'physics/ForceProcessor',
    "game/world/PhysicalWorld",
    "application/EventManager",
    "game/GameConfiguration",
    "game/planes/PlaneController",
    "game/world/LevelController",
    "game/player/PlayerController",
    "game/AerodynamicController",
    'game/movement/CharacterMovement',
    'game/parts/Lights',
    'game/parts/Screens',
    'game/GameUtil',
    'game/EntityController'
],
    function(
        Vector3,
		Matrix3x3,
        forceProcessor,
        PhysicalWorld,
        event,
        gameConfig,
        planeController,
        levelController,
        playerController,
        aerodynamicController,
        CharacterMovement,
        lights,
        screens,
        GameUtil,
        entityController
        ) {

        var gameEntities = {};
        var listenerPos = new Vector3();

        var handleRegisterEntity = function(e) {
            var entity = event.eventArgs(e).entity;
            gameEntities[entity.id] = entity;
        };

        var removeGameEntity = function(entityId) {
            PhysicalWorld.removePhysical(entityId);
            delete gameEntities[entityId];
        };

		var calcMat = new Matrix3x3();
        var calcVec = new Vector3();
        var calcVec2 = new Vector3();

        var updateEntitySpatial = function(entity) {
            entity.spatial.pos.addv(entity.spatial.velocity);
        };

        var addLocalspaceForces = function(rotMat3, forceVectors) {
            return rotMat3.applyPost(forceVectors);
        };

        var calcFrameAccelerationByFrameForces = function(entity, frameForces, partOfSecond) {
            var mass = entity.pieceData.dimensions.massEmpty;
            return frameForces.div(mass/(partOfSecond));
        };

        var gravityAcc = function(partOfSecond) {
            return 9.81 * partOfSecond
        };

        var entityEffectiveMass = function(entity) {
            return -entity.pieceData.dimensions.massEmpty;
        };

        var applyEntityForces = function(entity, partOfSecond) {
            var frameAcc = calcFrameAccelerationByFrameForces(entity, entity.spatial.acc, partOfSecond)

			if (Math.sqrt(frameAcc.lengthSquared()) > 5) {
				console.log("Over Acceleration damage", Math.sqrt(frameAcc.lengthSquared()))
				frameAcc.div(Math.sqrt(frameAcc.lengthSquared()))
			}

            entity.forces.g.setv(frameAcc)
            entity.spatial.velocity.addv(frameAcc);



        };

        var applyEntityTorque = function(entity, partOfSecond) {
            var rotAcc = calcFrameAccelerationByFrameForces(entity, entity.forces.torque, partOfSecond);

			if (Math.sqrt(rotAcc.lengthSquared()) > 0.5) {
				console.log("Over Torque damage", Math.sqrt(rotAcc.lengthSquared()))
				rotAcc.div(Math.sqrt(rotAcc.lengthSquared())*2)
				entity.spatial.angularVelocity.set(0, 0, 0);
			}


            entity.spatial.angularVelocity.addv(rotAcc);
            entity.spatial.rot.rotateX(entity.spatial.angularVelocity[0]);     // 0 * entity.controls.elevator.value *  0.01 +
            entity.spatial.rot.rotateY(entity.spatial.angularVelocity[1]);     // 0 * entity.controls.rudder.value   *  0.01 +
            entity.spatial.rot.rotateZ(entity.spatial.angularVelocity[2]);     // 0 * entity.controls.aeilrons.value *  0.01 +
        //    entity.spatial.angularVelocity.mul([0.9998, 0.9997, 0.9996]);
        };

        var updateDeadEntity = function(entity, partOfSecond) {
            entity.spatial.velocity.data[0] =  entity.spatial.velocity.data[0]*0.9999;
            entity.spatial.velocity.data[2] =  entity.spatial.velocity.data[2]*0.9999;
            //    entity.spatial.velocity.data[2]*=0.995;
            entity.spatial.velocity.add_d(0, -0.0000006, 0);
            entity.spatial.rot.rotateZ(0.000009*entity.spatial.pos[1]);
            entity.spatial.rot.rotateX(-0.000005*entity.spatial.pos[1]);
            entity.spatial.pos[0] = entity.spatial.pos[0]-(entity.spatial.velocity.data[0]);
            entity.spatial.pos[2] = entity.spatial.pos[2]-(entity.spatial.velocity.data[2]);
            entity.spatial.frameSpeed += Math.sqrt(entity.spatial.velocity.lengthSquared());

        };

        var updateEntityVelocity = function(entity, partOfSecond) {

            if (entity.wings) {
                applyEntityForces(entity, partOfSecond);
                applyEntityTorque(entity, partOfSecond);
            } else {
                //    console.log("Update: ", entity)
                if (entity.combat) {
                    if (entity.combat.isAlive === false) {
                        updateDeadEntity(entity, partOfSecond);
                        return;
                    }
                }

                entity.spatial.velocity.add_d(0, (partOfSecond*gameConfig.WORLD_PROPERTIES.gravity[1]) / gameConfig.RENDER_SETUP.physicsFPS, 0);
                if (!entity.spatial.velocity.data) return;

                if (entity.spatial.pos[1] <= 0) {
                    var diff = 0 - entity.spatial.velocity.data[1];
                    var moved = entity.spatial.velocity.data[1] - diff;
                    var ratio = moved / entity.spatial.velocity.data[1];
                    entity.spatial.velocity.data[1] = 0;
                    entity.spatial.pos[0] = entity.spatial.pos[0]-(entity.spatial.velocity.data[0] * (ratio));
                    entity.spatial.pos[1] = 0;
                    entity.spatial.pos[2] = entity.spatial.pos[2]-(entity.spatial.velocity.data[2] * (ratio));

                }


                entity.spatial.rot.lookAt(entity.spatial.velocity, Vector3.UNIT_Y);
                //   entity.spatial.rot.fromAngles(0, 1, 0);
             //   entity.spatial.rot.rotateY(-Math.PI*0.5);
            }

            entity.spatial.frameSpeed += Math.sqrt(entity.spatial.velocity.lengthSquared());
        };


        var resetEntityForces = function(entity) {
            entity.spatial.acc.set(0, 0, 0);
            entity.forces.buoyancy.data[1] = 0;
            entity.forces.drag.set(0, 0, 0);
            entity.forces.lift.set(0, 0, 0);

        };

        var combineWingForces = function(entity) {
			calcVec.set(0, 0, 0);
            for (var wings in entity.wings) {
                var wing = entity.wings[wings];
                forceProcessor.addForceToAcc(wing.force.mul(9.81), entity.spatial.acc);
                forceProcessor.addForceToTorque(wing.force, wing.pos, calcVec);
            }
			entity.forces.torque.lerp(calcVec, 0.4);
        };

        var combineWheelForces = function(entity, wheels, physStepPartOfSecond) {
            for (var i = 0; i < wheels.length; i++) {
                var wheel = wheels[i];
                wheel.updateForceVector(entity);
                forceProcessor.addForceToAcc(wheel.forceVector.mul(physStepPartOfSecond), entity.spatial.acc);
                forceProcessor.addForceToTorque(wheel.forceVector, wheel.pos, entity.forces.torque);
            }
        };


        var combineEngineForces = function(entity, physStepPartOfSecond) {
			calcVec.set(0, 0, 0);
            for (var engines in entity.systems.engines) {
                var engine = entity.systems.engines[engines];
                forceProcessor.addForceToAcc(engine.thrustVector.mul(physStepPartOfSecond), entity.spatial.acc);
                forceProcessor.addForceToTorque(engine.thrustVector, engine.pos, calcVec);
            }
			entity.forces.torque.lerp(calcVec, 0.1);
        };

        var addWeightForce = function(entity, partOfSec) {
            var weightForce = gravityAcc(partOfSec);
            entity.spatial.acc.data[1] += weightForce * entityEffectiveMass(entity);
        };

        var wingedSpecialUpdate = function(entity, time) {

                var ranges = PhysicalWorld.getRangesToNearbyConflics(entity);
            //     //    console.log(ranges)
            //    for (var i = 0; i < ranges.entities.length; i++) {
            //        var hit = PhysicalWorld.checkHitAgainstPhysicalShape(entity.spatial.pos, ranges.entities[i])
            //    }

            //    if (!hit)
                    var hit = PhysicalWorld.checkSpatialConflict(entity, time);

                //    var collide = PhysicalWorld.checkSpatialConflict(entity);
                if (hit) {

                    if (hit.part == "water") {
						entity.spatial.velocity.mul(0.99, 0.7, 0.99);
					} else {
                    entity.spatial.velocity.set(0.0001, 0.0001, 0.001);
                    if (entity.spatial.speed > 0.1) {
                        var pos = entity.spatial.pos.data;
                        console.log("Loc: ", pos[0], pos[1], pos[2]);
                        event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound().CANNON_20_0, pos:pos, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
                        event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound().MAIN_HIT_0, pos:pos, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
                        event.fireEvent(event.list().PUFF_BLACK_SMOKE,  {pos:pos, count:20, dir:[Math.random()-0.5,1+Math.random(), Math.random()-0.5]})
                        event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:pos, count:7, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                        event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:pos, count:3, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                        event.fireEvent(event.list().FLASH_SPARKS,      {pos:pos, count:6, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                        setTimeout(function() {
                            event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound().MAIN_GUN_0, pos:pos, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
                            event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:pos, count:3, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                            event.fireEvent(event.list().PUFF_BLACK_SMOKE,  {pos:pos, count:20, dir:[Math.random()-0.5,1+Math.random(), Math.random()-0.5]})
                            event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:pos, count:3, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                            event.fireEvent(event.list().FLASH_SPARKS,      {pos:pos, count:4, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                            setTimeout(function() {
                                event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound().MAIN_HIT_2, pos:pos, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
                                event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:pos, count:3, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                                event.fireEvent(event.list().PUFF_BLACK_SMOKE,  {pos:pos, count:20, dir:[Math.random()-0.5,1+Math.random(), Math.random()-0.5]})
                                event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:pos, count:3, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                                event.fireEvent(event.list().FLASH_SPARKS,      {pos:pos, count:4, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                            }, 200)
                        }, 200)

                    }
					}
                } else if (entity.spatial.speed > 0.5)
                    if (ranges.ground < 30){
                        var dustPoint=[entity.spatial.pos.data[0] +0.5*entity.spatial.pos[1]*(Math.random() -0.5), entity.spatial.pos[1]-ranges.ground, entity.spatial.pos.data[2] +0.5*entity.spatial.pos[1]*(Math.random() -0.5)]
                        var dust = function() {

                            event.fireEvent(event.list().PUFF_WHITE_SMOKE, {pos:dustPoint, count:1, dir:[0, Math.random(), 0]})

                        };

                        if (Math.random() < entity.spatial.speed * 0.3)  {
                            setTimeout(function() {
                                dust();
                            },ranges.ground*1.1 +1*ranges.ground*(Math.random()))
                        }


                    } else if (entity.spatial.pos[1] < 35) if (entity.spatial.speed > 0.5) {
                        var splashPoint=[entity.spatial.pos.data[0] +0.5*entity.spatial.pos[1]*(Math.random() -0.5), 0.1, entity.spatial.pos.data[2] +0.5*entity.spatial.pos[1]*(Math.random() -0.5)]
                        var splash = function() {
                            event.fireEvent(event.list().SPLASH_WATER, {pos:splashPoint, count:1, dir:[0, 1, 0]})
							if (Math.random() < 0.1) event.fireEvent(event.list().SPLASH_RINGLET, {pos:splashPoint, count:1, dir:[0, 0, 0]});
							if (Math.random() < 0.02) event.fireEvent(event.list().SPLASH_FOAM, {pos:splashPoint, count:1, dir:[0, 0, 0]});
                        };

                        setTimeout(function() {
                            splash();
                        },entity.spatial.pos[1]*12 +8*entity.spatial.pos[1]*(Math.random() -0.5))
                    }
            return ranges.ground;
        };



        var distanceFilter = function(entity) {
            calcVec.set(entity.spatial.visualPos);
            calcVec.sub(listenerPos);
            if(calcVec.lengthSquared() > 1000 * entity.pieceData.physicalRadius * entity.pieceData.physicalRadius) {
                entityController.hideEntity(entity);
            } else {
                entityController.showEntity(entity);
            }

        };

		var updateMoveSpherePiece = function(partOfSecond, entity) {

			entity.spatial.audioVel.set(entity.spatial.pos);
			entity.spatial.audioVel.sub(entity.spatial.visualPos);
			entity.spatial.audioVel.mul(1/partOfSecond);

			if (entity.isPilot) {
				entity.moveSphere.deactivate();
				return;
			} else if (entity.screenSystem) {
				entity.spatial.visualPos.setv(entity.spatial.pos);
				screens.updateEntityScreenState(entity);
			} else {
				entity.spatial.visualPos.setv(entity.spatial.pos);
			}

			if (entity.animStateMap) {
				CharacterMovement.updateCharacterControlState(entity);
			} else {
				entity.moveSphere.deactivate();
			}
		};

		var updateGamePieceFloatingFramerate = function(entity, time, physicsFps, partOfSecond) {

			if (entity.wings) {
				var groundProximity = wingedSpecialUpdate(entity, physicsFps*partOfSecond);
				planeController.updatePlaneControlState(entity, partOfSecond, groundProximity);
			}

			if (entity.lights) {
				lights.updateEntityLightState(entity, time);
			}

			if (entity.screenSystem) {
				if (entity.instruments) {
					entity.screenSystem.updateDisplays();
					entity.screenSystem.attenuateIntensity();
				}
			}

			if (entity.lights) {
				lights.attenuateWithDarkRects(entity);
			}

			entity.spatial.frameSpeed = 0;
			entity.spatial.frameTime = time;
		};

		var upadateGamePieceFixedFramerate = function(entity, physStepPartOfSecond) {


			if (entity.systems) {
				resetEntityForces(entity);
				var systems = entity.systems;

				if (systems.engines) {
					combineEngineForces(entity, physStepPartOfSecond);
				}

				if (systems.gears) {
					if (systems.gears.currentState != 0) {
						combineWheelForces(entity, systems.gears.wheels, physStepPartOfSecond);
					}
				}

				if (systems.drive) {
					combineWheelForces(entity, systems.drive.wheels, physStepPartOfSecond);
				}

			}
			if (entity.wings) {
				aerodynamicController.updateAerodynamicInfluences(entity);
				combineWingForces(entity, physStepPartOfSecond);
			}


			if (entity.spatial.acc) {
				addLocalspaceForces(entity.spatial.rot, entity.spatial.acc)
			}

			if (entity.pieceData.dimensions) addWeightForce(entity, physStepPartOfSecond);

			updateEntityVelocity(entity, physStepPartOfSecond);
			updateEntitySpatial(entity, physStepPartOfSecond);
		};

		var updateEntityGameState = function(time, entity) {
			var fps = 1000 / time;
			var partOfSecond = 1 / fps;
			var physicsFps = gameConfig.RENDER_SETUP.physicsFPS;
			var physStepPartOfSecond = 1/physicsFps;
			var remainingSteps = Math.round(partOfSecond / physStepPartOfSecond);

			distanceFilter(entity);
			if (entity.moveSphere) {
				updateMoveSpherePiece(partOfSecond, entity)

			} else {
				updateGamePieceFloatingFramerate(entity, time, physicsFps, partOfSecond);


				for (var i = 0; i < remainingSteps; i++) {
					upadateGamePieceFixedFramerate(entity, physStepPartOfSecond);

				}
				entity.spatial.speed = entity.spatial.frameSpeed;
				entity.spatial.visualPos.setv(entity.spatial.pos);
				calcVec.set(entity.spatial.velocity);
				calcVec.mul(1/physStepPartOfSecond);
				entity.spatial.audioVel.set(calcVec);
			}
			updateGamepieceStats(entity, 1/physicsFps);
		};

		var updateGamePieceGooTransform = function(entity) {
			for (var i = 0; i < entity.geometries.length; i++) {
				entity.geometries[i].transformComponent.transform.rotation.set(entity.spatial.rot);
				entity.geometries[i].transformComponent.transform.translation.setv(entity.spatial.visualPos);
				entity.geometries[i].transformComponent.setUpdated();
			}
		};

		var updatePilotGamePiece = function(entity) {
			/*
			 entity.pilot.spatial.pos.set(entity.spatial.visualPos);
			 */
			entity.pilot.spatial.rot.set(entity.spatial.rot);

			calcVec.set(entity.pieceData.dimensions.pilotSeatPos);
			calcVec = GameUtil.applyRotationToVelocity(entity, calcVec);
			calcVec.add(entity.spatial.visualPos);
			calcVec2.set(0, entity.pilot.pieceData.dimensions.mobRadius, 0);

			calcVec2.add(calcVec);
			entity.pilot.spatial.pos.set(calcVec2);
			entity.pilot.spatial.visualPos.set(calcVec2);
			//	entity.pilot.update();
			entity.pilot.geometries[0].transformComponent.transform.translation.set(calcVec2);
			entity.pilot.geometries[0].transformComponent.setUpdated();
		};

		var updateGamepieceStats = function(gamePiece, partOfsecond) {
			gamePiece.stats.update += partOfsecond;
			if (gamePiece.stats.update < 0.5) return;
			gamePiece.stats = {
				update:0,
				altitude:Math.round(gamePiece.spatial.pos.y),
				speed:Math.round(3.6 * gamePiece.spatial.speed / partOfsecond),
				heading:gamePiece.spatial.angle,
				thrust:0
			//	g:Math.round(Math.sqrt(gamePiece.forces.g.lengthSquared()*10)/10)
			};

			if (gamePiece.systems) {
				if (gamePiece.systems.engines) {
					for (var i = 0; i < gamePiece.systems.engines.length; i++) {
						gamePiece.stats.thrust += Math.round((gamePiece.systems.engines[i].thrust *0.00001 / partOfsecond))
					}
				}
			}
		};
  /*
		if(entity.measurements.throttle) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"throttle", amount:playerEntity.systems.engines[0].thrust * 0.001});
		if(entity.measurements.speed)    event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"speed",    amount:3.6 * aggregates.speed * partOfsecond});
		if(entity.measurements.altitude) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"altitude", amount:playerEntity.spatial.pos[1]});
		if(entity.measurements.airflowx) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"airflowx", amount:90*playerEntity.spatial.axisAttitudes.data[0]});
		if(entity.measurements.airflowy) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"airflowy", amount:90*playerEntity.spatial.axisAttitudes.data[1]});
		if(entity.measurements.airflowz) event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"airflowz", amount:90*playerEntity.spatial.axisAttitudes.data[2]});
		if(entity.measurements.gForce)   event.fireEvent(event.list().PLAYER_VALUE_UPDATE, {value:"gForce",   amount:1 + aggregates.g * 9.81 / (dt * 0.001) });
   */
		var updateGamePiece = function(time, gamePiece) {
			updateEntityGameState(time, gamePiece);
			if (gamePiece.pilot) {
				updatePilotGamePiece(gamePiece)
			}

			updateGamePieceGooTransform(gamePiece);
		};

        var tickEntities = function(time) {
			levelController.updateBoats();
            for (var index in gameEntities) {
				updateGamePiece(time, gameEntities[index]);
            }
        };



        var handleRemoveEntityEvent = function(e) {
            removeGameEntity(event.eventArgs(e).entityId)
        };

        var handleListenerPosition = function(e) {
            listenerPos.set(event.eventArgs(e).pos);
        };

		var getGameEntities = function() {
			return gameEntities;
		}

    //    event.registerListener(event.list().UPDATE_ACTIVE_ENTITIES, tickEntities);
        event.registerListener(event.list().REGISTER_ACTIVE_ENTITY, handleRegisterEntity);

        event.registerListener(event.list().REMOVE_GAME_ENTITY, handleRemoveEntityEvent);
        event.registerListener(event.list().MOVE_AUDIO_LISTENER, handleListenerPosition);

		return {
			tickEntities:tickEntities,
			getGameEntities:getGameEntities
		}
    });
