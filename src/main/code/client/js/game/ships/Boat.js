"use strict";

define(['game/world/PhysicalWorld',
    "application/EventManager",
    "goo/math/Vector3",
    "game/player/PlayerPieceHandler",
    "game/GameConfiguration",
    "game/ModelDefinitions",
    "game/world/LevelController",
    "3d/GooJointAnimator",
	'goo/entities/SystemBus',
	'game/GameUtil'
],
    function(physicalWorld,
             event,
             Vector3,
             playerPieceHandler,
             gameConfig,
             modelDefinitions,
             levelController,
             GooJointAnimator,
			 SystemBus,
             gameUtil) {

        var calcVec = new Vector3();

        var Boat = function(shipId, boatData, boatReady) {
            this.wakes = boatData.wakes;
            var instance = this;
            this.passengers = {};
            var entityAddedCallback = function(entity) {
                instance.entity = entity;
                entity.pieceData = boatData;
                physicalWorld.registerPhysicalEntity(entity);
                entity.combat.hitPoints = boatData.hitPoints;

                entity.combat.destroyed = function(entity) {

                };

                var visualEntityReady = function(gooEntity) {
					if (entity.geometries[0]) entity.geometries[0].removeFromWorld();
                    entity.geometries[0] = gooEntity;
					entity.geometries[0].addToWorld();
                    if (gooEntity.animationComponent) GooJointAnimator.printClipInitialTransform(entity);
                    entity.spatial.velocity.data[2] = 0.3*(Math.random()-0.5);
                    entity.spatial.velocity.data[0] = 0.3*(Math.random()-0.5);
					boatReady(instance);
                };

                event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:"bundles", modelPath:boatData.piecePath, callback:visualEntityReady});
             //   addTurretsToBoat(entity, boatData);
             //   addChimneysToBoat(entity, boatData);
             //   addRadarsToBoat(entity, boatData);
             //   addFlagsToBoat(entity, boatData);
            };

            event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:shipId, callback:entityAddedCallback});
        };

        Boat.prototype.setHostileTarget = function(entity) {
            for (var i = 0; i < this.entity.turrets.length; i++) {
                this.entity.turrets[i].setTargetEntity(entity)
            }
        };

        Boat.prototype.abandonShip = function() {
            for (var i = 0; i < this.entity.turrets.length; i++) {
                this.entity.turrets[i].disengageTurret()
            }

            for (var index in this.chimneys) {
                this.chimneys[index].setChimneyIntensity(0);
            }

            for (index in this.radars) {
                this.radars[index].stopRadar();
            }

        };

		var wakeForeEData = {
			"count":3,
			"opacity":[1, 1],
			"alpha":"oneToZero",
			"growthFactor":[3, 6],
			"growth":"oneToZero",
			"stretch":0,
			"strength":5,
			"spread":0.5,
			"acceleration":0.98,
			"gravity":-9,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[1.1,3.3],
			"lifespan":[0.2, 1.0],
			"spinspeed":[-0.2, 0.2],
			"sprite":"splash_thick",
			"loopcount":1,
			"trailsprite":"projectile_1",
			"trailwidth":1
		};

		var wakeMidEdata = {
			"count":1,
			"opacity":[1, 1],
			"alpha":"oneToZero",
			"growthFactor":[4, 6],
			"growth":"oneToZero",
			"stretch":2,
			"strength":1,
			"spread":0.2,
			"acceleration":0.98,
			"gravity":1,
			"rotation":[0,7],
			"spin":"oneToZero",
			"size":[0.1,1.3],
			"lifespan":[0.1, 2.4],
			"spinspeed":[-0.2, 0.2],
			"sprite":"splash_thick",
			"loopcount":1,
			"trailsprite":"projectile_1",
			"trailwidth":1
		};

		Boat.prototype.pushWakes = function() {
			var speed = this.entity.spatial.speed;
			var shipPos = this.entity.spatial.pos;
			for (var index in this.wakes) {
				calcVec.set(this.wakes[index].posOffset);
				var random = Math.random()*this.wakes[index].spread;
				calcVec.data[2] += calcVec.data[2]*random;
				calcVec.data[0] += calcVec.data[0]*-random;
				var pos = gameUtil.applyRotationToVelocity(this.entity.geometries[0], calcVec);
				pos.addVector(shipPos);


				if (index == 0) {
					if (Math.random() < speed*0.8) {
						SystemBus.emit('playWaterEffect', {pos:pos, vel:Vector3.UNIT_Y, effectData:wakeForeEData});
					}
				}


				if (Math.random()+0.01 < speed*0.3) {
					if (index == 0 || index == 1){
				//		event.fireEvent(event.list().SPLASH_RINGLET, {pos:[pos.data[0], pos.data[1]+1.4, pos.data[2]], count:1, dir:[0, 0, 0]})
				//		event.fireEvent(event.list().SPLASH_FOAM, {pos:[pos.data[0]+(Math.random()-0.5)*15, pos.data[1]+1.4, pos.data[2]+(Math.random()-0.5)*15], count:1, dir:[(Math.random()-0.5)*0.6, 0, (Math.random()-0.5)*0.6]})
					} else {
						SystemBus.emit('playWaterEffect', {pos:pos, vel:Vector3.UNIT_Y, effectData:wakeMidEdata});
						//    event.fireEvent(event.list().SPLASH_WATER, {pos:[pos.data[0], pos.data[1], pos.data[2]], count:1, dir:[Math.random()-0.5, -1.2+Math.random(), Math.random()-0.5]})
					}
				}
			}
		};

		Boat.prototype.getCatapultById = function(id) {
		    for (var i = 0; i < this.catapults.length; i++) {
				if (this.catapults[i].id == id) {
					return this.catapults[i];
				}
			}

		};

		Boat.prototype.addPassenger = function(passenger, parkingLot) {

			this.passengers[passenger.id] = {entity:passenger, posOffset:parkingLot.posOffset, rot:new Vector3(parkingLot.rot), catapult:this.getCatapultById(parkingLot.catapult)};

		};

        Boat.prototype.setPassengerParkingLot = function(passenger, parkingLot) {
            var posOffset = new Vector3(parkingLot.posOffset);
            passenger.spatial.pos.data[1] = parkingLot.posOffset[1];
            passenger.spatial.rot.fromAngles(parkingLot.rot[0], parkingLot.rot[1], parkingLot.rot[2]);
			this.addPassenger(passenger, parkingLot);
		};

        Boat.prototype.removeCatapultThrustFromPlane = function(plane) {
            for (var i = 0; i < plane.systems.engine.engines.length; i++) {
                plane.systems.engine.engines[i].maxThrust *= 0.5;
            }
        };

        Boat.prototype.applyCatapultThrustToPlane = function(plane) {
			plane.spatial.velocity.setDirect(0, 0, 1);
			plane.spatial.rot.applyPost(plane.spatial.velocity);

			plane.spatial.velocity.mulDirect(0.2, 0, 0.2);
            for (var i = 0; i < plane.systems.engine.engines.length; i++) {
                plane.systems.engine.engines[i].maxThrust *= 2;
            };

            var instance = this;
            setTimeout(function() {
				if (plane.pieceInput.getAppliedState('gears') == 1) {
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"Retract landing Gear"});
				}


                instance.removeCatapultThrustFromPlane(plane);
            }, 8000);
        };

        Boat.prototype.catapultPlane = function(plane) {
            var launch = this.checkCatapultForLaunch(plane);
			console.log(this.passengers)
			var catapult = this.passengers[plane.id].catapult;
			catapult.catapultCharged();
            var instance = this;
            if (launch) {



				var engage = function() {
					delete this.passengers[plane.id];
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"-  -"});
					SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Engaged"});
					this.applyCatapultThrustToPlane(plane);
				}.bind(this);

				setTimeout(function() {
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:" "});
					catapult.catapultPassive();
				}, 4500);

				setTimeout(function() {
					engage();
				}, 4000);

				setTimeout(function() {
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"- 1 -"});
					catapult.catapultTrigger();
				}, 3000)

				setTimeout(function() {
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"-  2  -"});
				}, 2000)

				setTimeout(function() {
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"-   3   -"});
					SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Systems Ready"});
				}, 1000)

            } else {
                setTimeout(function() {
                    instance.catapultPlane(plane);
                }, 3000)
            }
        };

		Boat.prototype.checkCatapultForLaunch = function(plane) {

			if (!plane.systems.engine.engines[0].started){
				SystemBus.emit("message_to_gui", {channel:'hint_channel', message:"Start Engines"});
				return false;
			}

			if (plane.pieceInput.getAppliedState('canopy') > 0.01) {
				SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"Canopy Open"});
				SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Press [C] to toggle Canopy"});
				return false
			}

			if (plane.systems.engine.engines[0].thrust < plane.systems.engine.engines[0].maxThrust*0.92) {
				SystemBus.emit("message_to_gui", {channel:'hint_channel', message:"Increase Engine Power"});
				SystemBus.emit("message_to_gui", {channel:'system_channel', message:"[THR] "+Math.round((plane.systems.engine.engines[0].thrust/plane.systems.engine.engines[0].maxThrust)*100)});
				return false;
			}

			if (plane.pieceInput.getAppliedState('flaps') < 0.4) {
				SystemBus.emit("message_to_gui", {channel:'hint_channel', message:"Engage Flaps"});
				SystemBus.emit("message_to_gui", {channel:'system_channel', message:"[THR] "+Math.round((plane.pieceInput.getAppliedState('canopy'))*100)});
				return false
			}

			if (plane.pieceInput.getAppliedState('breaks') > 0.01) {
				SystemBus.emit("message_to_gui", {channel:'hint_channel', message:"Release Brakes"});
				SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Toggle Brakes [V]"});

				return false
			}

			SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Catapult Ready"});
			return true;

		};

        Boat.prototype.launchPlane = function(plane) {
			this.entity.pilot = null;
			var instance = this;
			var readyCatapult = function() {
				setTimeout(function() {
					instance.catapultPlane(plane);
				}, 3000)
			};


            event.fireEvent(event.list().PILOT_VEHICLE, {pilot:this.entity.pilot, vehicle:plane, callback:readyCatapult});


        };

        Boat.prototype.setPassengerToReady = function(passengerEntity) {
            this.setPassengerParkingLot(passengerEntity, this.entity.pieceData.parkingLots.launch);
            var instance = this;
            setTimeout(function() {
                instance.launchPlane(passengerEntity)
            }, 3000);

        };


		Boat.prototype.initPlaneReadyAtLot = function(passenger, parkingLot) {
			this.setPassengerParkingLot(passenger, parkingLot);
			console.log("Attach passenger:",passenger.id);
		//	playerPieceHandler.removePlayerControlFrom(passenger);
		};

        Boat.prototype.attachPassenger = function(passenger, parkingLot) {
            this.setPassengerParkingLot(passenger, parkingLot);
            console.log("Attach passenger:",passenger.id);
            var pilot = passenger.pilot;
            var instance = this;

			var readyPassenger = function() {
				setTimeout(function() {
					instance.setPassengerToReady(passenger);
				}, 3000);
			};

			var unloadOk = function() {
				setTimeout(function() {
					event.fireEvent(event.list().PILOT_VEHICLE, {pilot:pilot, vehicle:instance.entity, callback:readyPassenger});
					passenger.pilot = null;
				}, 2500)
			};

            playerPieceHandler.removePlayerControlFrom(passenger, unloadOk);
        };

        Boat.prototype.updatePassenger = function(passenger) {
    //        console.log("Update Passenger: ", passenger)

			passenger.entity.spatial.velocity.x = this.entity.spatial.velocity.x;
			passenger.entity.spatial.velocity.z = this.entity.spatial.velocity.z;
			passenger.entity.spatial.velocity.y *= 0.9;
	//		passenger.entity.spatial.velocity.normalize();

	//		passenger.entity.spatial.velocity.mulDirect(20, 20, 20);

			for (var i = 0; i < passenger.entity.systems.gears.wheels.length; i++) {
				if (!passenger.entity.systems.gears.wheels[i]) {
					console.error("wheel missing: ", passenger.entity.systems.gears.wheels, i)
				} else {
					passenger.entity.systems.gears.wheels[i].setGroundVelocity(this.entity.spatial.velocity);
				}
			}

            calcVec.set(passenger.posOffset);
            this.entity.spatial.rot.applyPost(calcVec);
            calcVec.add(this.entity.spatial.pos);
            passenger.entity.spatial.pos.data[0] = calcVec.data[0];
            passenger.entity.spatial.pos.data[2] = calcVec.data[2];
            //   //    passenger.entity.spatial.pos.set(calcVec);
            var angles = this.entity.spatial.rot.toAngles();
            angles.add(passenger.rot);
            passenger.entity.spatial.rot.fromAngles(passenger.rot.data[0], angles.data[1], passenger.rot.data[2]);
        };

        Boat.prototype.updateBoat = function() {
            var boat = this.entity;
            for (var index in boat.turrets) {
                GooJointAnimator.updateEntityBoneRotX(boat, boat.turrets[index].pivotBoneId, boat.turrets[index].direction);
                GooJointAnimator.updateEntityBoneRotX(boat, boat.turrets[index].elevateJointId, boat.turrets[index].elevation);
                boat.turrets[index].updateTurretState()
            }

            for (index in boat.chimneys) {
                boat.chimneys[index].updateChimney();
            }
            for (index in boat.radars) {
                boat.radars[index].updateRadar();
            }
            for (index in boat.flags) {
                boat.flags[index].updateFlag();
            }

            for (index in this.passengers) {
                this.updatePassenger(this.passengers[index]);
            }

				for (var i = 0; i < this.catapults.length; i++) {
					this.catapults[i].updateCatapult();
				}

            this.helmsman.updateHelmsman();

            this.pushWakes();
        };

        return Boat;
    });