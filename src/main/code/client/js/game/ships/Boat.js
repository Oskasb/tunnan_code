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

        Boat.prototype.pushWakes = function() {
            var speed = this.entity.spatial.speed;
            var shipPos = this.entity.spatial.pos;
            for (var index in this.wakes) {
				calcVec.set(this.wakes[index].posOffset);
				var random = Math.random()*this.wakes[index].spread;
				calcVec.data[2] += calcVec.data[2]*random;
				calcVec.data[0] += calcVec.data[0]*-random;
				var pos = gameUtil.applyRotationToVelocity(this.entity.geometries[0], calcVec);
				pos.addv(shipPos);

				if (index == 0) {

					var effectData = {
						growth:300,
						strength:12+Math.random()*4,
						count: 6,
						spread:1,
						lifespan: 1+Math.random()*2
					};
					SystemBus.emit('playWaterEffect', {effectName:"splash_water", pos:pos, vel:Vector3.UNIT_Y, effectData:effectData});

				}


				if (Math.random()+0.01 < speed*0.3) {

					if (index == 0 || index == 1){
						event.fireEvent(event.list().SPLASH_RINGLET, {pos:[pos.data[0], pos.data[1]+1.4, pos.data[2]], count:1, dir:[0, 0, 0]})
						event.fireEvent(event.list().SPLASH_FOAM, {pos:[pos.data[0]+(Math.random()-0.5)*15, pos.data[1]+1.4, pos.data[2]+(Math.random()-0.5)*15], count:1, dir:[(Math.random()-0.5)*0.6, 0, (Math.random()-0.5)*0.6]})


					} else {
						var effectData = {
							growth:600,
							strength:3+Math.random()*4,
							count: 8,
							spread:0.5,
							lifespan: 1+Math.random()*1
						};
						SystemBus.emit('playWaterEffect', {effectName:"splash_water", pos:pos, vel:Vector3.UNIT_Y, effectData:effectData});
						//    event.fireEvent(event.list().SPLASH_WATER, {pos:[pos.data[0], pos.data[1], pos.data[2]], count:1, dir:[Math.random()-0.5, -1.2+Math.random(), Math.random()-0.5]})
					}
				}
            }
        };

        Boat.prototype.setPassengerParkingLot = function(passenger, parkingLot) {
            var posOffset = new Vector3(parkingLot.posOffset);
            passenger.spatial.pos.data[1] = parkingLot.posOffset[1];
            passenger.spatial.rot.fromAngles(parkingLot.rot[0], parkingLot.rot[1], parkingLot.rot[2]);
            this.passengers[passenger.id] = {entity:passenger, posOffset:posOffset, rot:new Vector3(parkingLot.rot)};
        };

        Boat.prototype.removeCatapultThrustFromPlane = function(plane) {
            for (var i = 0; i < plane.systems.engines.length; i++) {
                plane.systems.engines[i].maxThrust *= 0.5;
            }
        };

        Boat.prototype.applyCatapultThrustToPlane = function(plane) {
            for (var i = 0; i < plane.systems.engines.length; i++) {
                plane.systems.engines[i].maxThrust *= 2;
            };
            plane.spatial.velocity.normalize();
            plane.spatial.velocity.mul(0.4);

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
            var instance = this;
            if (launch) {

				var engage = function() {
					delete this.passengers[plane.id];
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"-  -"});
					SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Engaged"});
					this.applyCatapultThrustToPlane(plane);
				}.bind(this)

				setTimeout(function() {
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:" "});
				}, 4500)

				setTimeout(function() {
					engage();
				}, 4000)

				setTimeout(function() {
					plane.spatial.velocity.mul(0.4);
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"- 1 -"});
				}, 3000)

				setTimeout(function() {
					plane.spatial.velocity.mul(0.4);
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"-  2  -"});
				}, 2000)

				setTimeout(function() {
					plane.spatial.velocity.mul(0.4);
					SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"-   3   -"});
					SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Systems Ready"});
				}, 1000)

				plane.spatial.velocity.mul(0.4);
            } else {
                setTimeout(function() {
                    instance.catapultPlane(plane);
                }, 3000)
            }
        };

		Boat.prototype.checkCatapultForLaunch = function(plane) {
			plane.spatial.velocity.mul(0.9);
			if (!plane.systems.engines[0].started){
				SystemBus.emit("message_to_gui", {channel:'hint_channel', message:"Start Engines"});
				return false;
			}

			if (plane.pieceInput.getAppliedState('canopy') > 0.01) {
				SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"Canopy Open"});
				SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Press [C] to toggle Canopy"});
				return false
			}

			if (plane.systems.engines[0].thrust < plane.systems.engines[0].maxThrust*0.92) {
				SystemBus.emit("message_to_gui", {channel:'hint_channel', message:"Increase Engine Power"});
				SystemBus.emit("message_to_gui", {channel:'system_channel', message:"[THR] "+Math.round((plane.systems.engines[0].thrust/plane.systems.engines[0].maxThrust)*100)});
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
			passenger.spatial.velocity.mul(0.2);
		//	playerPieceHandler.removePlayerControlFrom(passenger);
		};

        Boat.prototype.attachPassenger = function(passenger, parkingLot) {
            this.setPassengerParkingLot(passenger, parkingLot);
            console.log("Attach passenger:",passenger.id);
            passenger.spatial.velocity.mul(0.2);
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

            this.helmsman.updateHelmsman();

            this.pushWakes();
        };

        return Boat;
    });