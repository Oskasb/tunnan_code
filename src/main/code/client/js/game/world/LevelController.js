"use strict";

define(["application/EventManager",
    'game/EntityModel',
    'game/world/VideoBroadcasts',
    "game/ships/BoatData",
    "game/cars/CarData",
    "game/piece/TargetData",
    "game/planes/PlaneData",
    "game/characters/CharacterData",
    'game/world/ZoneData',
    'game/world/SpawnSystem',
    'game/planes/AiPilot'
],
    function(event,
             entityModel,
             VideoBroadcasts,
             boatData,
             carData,
             targetData,
             planeData,
             characterData,
             zoneData,
             spawnSystem,
             AiPilot) {

        var scenario;
        var loadPlayerId;

        var levelEntities;

		var resetLevel = function() {
			levelEntities = {
				boats:{},
				cars:{},
				planes:{},
				targets:{},
				humans:{}
			};
		};
		resetLevel();


        var addBoat = function(name, dataKey, pos, vel, rot, state, boatReady) {

			var levelBoat = function(boat) {

				levelEntities.boats[boat.entity.id] = boat;
				boatReady(boat.entity);
			};

            spawnSystem.spawnBoat(name, dataKey, pos, rot, vel, levelBoat);
        };

        var addCar = function(name, data, pos, vel, rot) {
            var car = spawnSystem.spawnCar(name, data, pos, rot, vel);
            levelEntities.cars[car.entity.id] = car;
            return car.entity;
        };

        var addPlane = function(name, planeId, pos, vel, rot, state, planeReady) {

			var planeAdded = function(plane) {
				levelEntities.planes[plane.entity.id] = plane;
			//	if (plane.entity.state != 1) new AiPilot(plane);
				planeReady(plane.entity)
			};
			spawnSystem.spawnPlane(name, planeId, pos, vel, rot, state, planeAdded);


        };

        var addTarget = function(name, data, pos, vel, rot, state) {
            var target = spawnSystem.spawnTarget(name, data, pos, vel, rot, state);
            levelEntities.targets[target.entity.id] = target;
            return target.entity;
        };

        var addHuman = function(name, data, pos, vel, rot, state, humanReady) {

			var charReady = function(char) {
				levelEntities.humans[char.entity.id] = char;

				console.log("ADD HUMAN TO LEVEL: ", levelEntities);
				humanReady(char.entity);
			};

            spawnSystem.spawnHuman(name, data, pos, vel, rot, state, charReady);

        };

        var loadZoneBoats = function(zonePos, boats) {
            for (var boatType in boats) {
                for (var i = 0; i < boats[boatType].length; i++) {
                    var piece = boats[boatType][i];
                    var pos = [piece.pos[0]+zonePos[0], 0, piece.pos[2]+zonePos[2]];
                    addBoat(boatType, boatType, pos, piece.rot, piece.vel, null, null);
                }
            }
        };

        var loadZoneCars = function(zonePos, cars) {
            for (var carType in cars) {
                for (var i = 0; i < cars[carType].length; i++) {
                    var piece = cars[carType][i];
                    var pos = [piece.pos[0]+zonePos[0], piece.pos[1]+zonePos[1], piece.pos[2]+zonePos[2]];
                    addCar(carType, carData[carType], pos, piece.rot, piece.vel);
                }
            }
        };

        var loadZoneTargets = function(zonePos, targets) {
            for (var targetType in targets) {
                for (var i = 0; i < targets[targetType].length; i++) {
                    var piece = targets[targetType][i];
                    var pos = [piece.pos[0]+zonePos[0], piece.pos[1]+zonePos[1], piece.pos[2]+zonePos[2]];
                    addTarget(targetType, targetData[targetType], pos, piece.rot, piece.vel);
                }
            }
        };

        var loadZonePlanes = function(zonePos, planes) {
            for (var planeType in planes) {
                for (var i = 0; i < planes[planeType].length; i++) {
                    var piece = planes[planeType][i];
                    var pos = [piece.pos[0]+zonePos[0], piece.pos[1]+zonePos[1], piece.pos[2]+zonePos[2]];
                    addPlane(planeType, planeType, pos, piece.vel, piece.rot, piece.state);

                }
            }
        };



        var loadZoneVehicles = function(zoneData, vehicles) {
            var zonePos = zoneData.pos;
            loadZoneBoats(zonePos, vehicles.boats);
            loadZoneCars(zonePos, vehicles.cars);
            loadZonePlanes(zonePos, vehicles.planes);
            loadZoneTargets(zonePos, vehicles.targets);
        };

        var loadPlayerCar = function() {
            console.log(scenario)
            var piece = scenario.loadPlayer.playerSpawn.car;
            var zonePos = scenario.loadPlayer.pos;
            var pos = [piece.pos[0]+zonePos[0], piece.pos[1]+zonePos[1], piece.pos[2]+zonePos[2]];
            return addCar(scenario.playerCar, carData[scenario.playerCar], pos, piece.vel, piece.rot, piece.state);
        };

		var loadScenarioGamePiece = function(spawnFunction, pieceDefinition, pieceData, spawnPoint, pieceReady) {
			var zonePos = scenario.loadPlayer.pos;
			var pos = [spawnPoint.pos[0]+zonePos[0], spawnPoint.pos[1]+zonePos[1], spawnPoint.pos[2]+zonePos[2]];
			return spawnFunction(pieceDefinition, pieceData, pos, spawnPoint.vel, spawnPoint.rot,  spawnPoint.state, pieceReady);
		};



		var initLevel = function(e) {

			resetLevel();
			if (!scenario) alert("NO SCENARIO LOADED");
			console.log("initLevel Scen", scenario);
			var pilotPieceType = scenario.playerCharacter;
			var spawnPoint = scenario.loadPlayer.playerSpawn.human;

			var pilotLoaded = function(pilot) {
				loadPlayerId = pilot.id;

				if (scenario.playerVehicle) {

					var planePieceType = scenario.playerVehicle;
					var spawnPoint = scenario.loadPlayer.playerSpawn.plane;

					var pieceReady = function(plane) {

						var checkCarrier = function() {
							if (scenario.playerCarrier) {
								var boatPieceType = scenario.playerCarrier;
								var point = scenario.loadPlayer.playerSpawn.carrier;


								var carrierAdded = function(carrier) {
									carrier.cables[1].boat.initPlaneReadyAtLot(plane, carrier.pieceData.parkingLots.launch);
									carrier.cables[1].boat.catapultPlane(plane);
									console.log("CARRIER: ", carrier);
								}

								loadScenarioGamePiece(addBoat, boatPieceType, boatPieceType, point, carrierAdded);

							}

						};

						event.fireEvent(event.list().PILOT_VEHICLE, {pilot:pilot, vehicle:plane, callback:checkCarrier});
					};


					loadScenarioGamePiece(addPlane, planePieceType, planePieceType, spawnPoint, pieceReady);

				}

				if (scenario.playerCar) loadPlayerId = loadPlayerCar().id;

				for (var i = 0; i < scenario.loadZones.length; i++) {
					for (var j = 0; j < scenario.loadVehicles[i].length; j++) {
						loadZoneVehicles(scenario.loadZones[i], scenario.loadVehicles[i][j]);
					}
				}

				event.eventArgs(e).callback();
			};

			loadScenarioGamePiece(addHuman, pilotPieceType, characterData[characterData], spawnPoint, pilotLoaded);

		};

        var updateBoats = function() {
            for (var index in levelEntities.boats) {
                levelEntities.boats[index].updateBoat();
            }
        };

        function getEntityClosestToPos(pos) {
            var distance = Infinity;
            var selection;
            for (var index in levelEntities) {
                for (var one in levelEntities[index]) {
                    var point = levelEntities[index][one].entity.spatial.pos.clone();
                    point.set(pos);
                    point.sub(levelEntities[index][one].entity.spatial.pos);
                    if (point.lengthSquared() < distance && point.lengthSquared() !=0) {
                        distance = point.lengthSquared();
                        selection = levelEntities[index][one].entity
                    }
                }
            }
            console.log(levelEntities);
            return selection;
        }


        var handleFetchLevelEntity = function(e) {
            console.log("FETCH LEVEL ENTITY", levelEntities, e)
            var id = event.eventArgs(e).entityId;
            var type = event.eventArgs(e).type;
            var callback = event.eventArgs(e).callback;

            if (id == "NEAREST") {
                callback(getEntityClosestToPos(event.eventArgs(e).pos));
                return
            }

            if (type) {
                for (var index in levelEntities[type]) {
                    callback(levelEntities[type][index].entity);
                    return;
                }
            }

            if (id) {
                callback(entityModel.getEntityById(id));
                return;
            }

            for (index in levelEntities) {
                for (var one in levelEntities[index]) {
                    callback(levelEntities[index][one].entity);
                    return;
                }
            }
        };

    //    event.registerListener(event.list().UPDATE_ACTIVE_ENTITIES, updateBoats);
        event.registerListener(event.list().FETCH_LEVEL_ENTITY, handleFetchLevelEntity);
        event.registerListener(event.list().SCENARIO_LOADED, initLevel);

        var getBoats = function() {
            return levelEntities.boats;
        };

        function registerScenario(scen) {
            scenario = scen;
        };


        function playerLoaded() {
        //    VideoBroadcasts.playRandom();
        };

        function addPlayerToLevel(resetCallback) {
            var callback = function(entity) {

				var playerAdded = function(entity) {
					playerLoaded();
					resetCallback(entity)
				};
				event.fireEvent(event.list().SET_PLAYER_CONTROLLED_ENTITY, {entity:entity, callback:playerAdded});
            };
            console.log("Player:", loadPlayerId)

            event.fireEvent(event.list().FETCH_LEVEL_ENTITY, {entityId:loadPlayerId, callback:callback});
        };


        var spawnMobileUnit = function(pos, callback) {
            //    var sphereEntity = MobileUnits.sphericalMobile(radius, pos, true);
            callback(addHuman("PILOT", null, pos, [0, 0, 0], [0, 0, 0], 0));
        };

        var handleSpawnPhysical = function(e) {
            spawnMobileUnit(event.eventArgs(e).pos, event.eventArgs(e).callback)
        };

        event.registerListener(event.list().SPAWN_PHYSICAL, handleSpawnPhysical);

        return {
            getBoats:getBoats,
			updateBoats:updateBoats,
            registerScenario:registerScenario,
            addPlayerToLevel:addPlayerToLevel
        }
    });
