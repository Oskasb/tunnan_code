"use strict";

define(["application/EventManager",
    "game/ships/BoatFactory",
    'game/piece/PieceBuilder',
    "game/characters/CharacterFactory",
    "game/cars/CarFactory",
    "game/piece/TargetFactory",
    'physics/PhysicalWorld',
    'game/movement/MobileUnits'
],
    function(event,
             boatFactory,
             pieceBuilder,
             characterFactory,
             carFactory,
             targetFactory,
             AmmoPhysicalWorld,
             MobileUnits) {

        var humanCount = 0;
        var boatCount = 0;
        var carCount = 0;
        var targetCount = 0;
        var planeCount = 0;

        var activateSpawned = function(entity) {
            event.fireEvent(event.list().REGISTER_ACTIVE_ENTITY, {entity:entity});
            event.fireEvent(event.list().ACTIVATE_GOO_ENTITY, {gooEntity:entity.geometries[0], gameEntity:entity});
        };

        var spawnBoat = function(name, boatData, pos, rot, vel) {
            boatCount += 1;
            var boat = boatFactory.buildShip(name+'_'+boatCount, boatData);
            boat.entity.spatial.pos.set(pos);
            boat.entity.spatial.rot.fromAngles(rot[0], rot[1], rot[2]);
            boat.entity.spatial.velocity.set(vel);
            pieceBuilder.buildBoatPiece(boat.entity, boatData);
            activateSpawned(boat.entity);
         //   console.log(gooEntity.transformComponent.children[0].entity.meshDataComponent)
            AmmoPhysicalWorld.createAmmoShapeComponent(boat.entity, boat.entity.geometries[0]);

            return boat;
        };


        var spawnCar = function(name, carData, pos, rot, vel) {
            carCount += 1;
            var car = carFactory.buildCar(name+'_'+carCount, carData);
            car.entity.spatial.pos.set(pos);
            car.entity.spatial.rot.fromAngles(rot[0], rot[1], rot[2]);
            car.entity.spatial.velocity.set(vel);
            pieceBuilder.buildPiece(car.entity, carData, 1);
            activateSpawned(car.entity);
            return car;
        };

        var spawnTarget =  function(name, targetData, pos, rot, vel) {
            targetCount += 1;
            var target = targetFactory.buildTarget(name+'_'+targetCount, targetData, pos);
        //    target.entity.spatial.pos.set(pos);
            target.entity.spatial.rot.fromAngles(rot[0], rot[1], rot[2]);
            target.entity.spatial.velocity.set(vel);
            pieceBuilder.buildPiece(target.entity, targetData, 1);
            activateSpawned(target.entity);
            return target;
        };

        var spawnPlane = function(name, planeData, pos, vel, rot, state, spawnedActivated) {
            planeCount += 1;

			var planeReady = function(plane) {
				plane.entity.spatial.pos.set(pos);
				plane.entity.spatial.rot.fromAngles(rot[0], rot[1], rot[2]);
				plane.entity.spatial.velocity.set(vel);
				activateSpawned(plane.entity);
				spawnedActivated(plane);
			};

            pieceBuilder.buildPlane(name+'_'+planeCount, planeData, state, planeReady);

        };

        var spawnHuman = function(name, humanData, pos, vel, rot, state) {
            humanCount += 1;
            var human = characterFactory.buildCharacter(name+'_'+humanCount, humanData, pos);
        //    human.entity.spatial.pos.set(pos);
            human.entity.spatial.rot.fromAngles(rot[0], rot[1], rot[2]);
            human.entity.spatial.velocity.set(vel);
            pieceBuilder.buildHuman(human.entity, human.entity.pieceData, 0);
            activateSpawned(human.entity);
            return human;
        };

        return {
            spawnHuman:spawnHuman,
            spawnBoat:spawnBoat,
            spawnCar:spawnCar,
            spawnTarget:spawnTarget,
            spawnPlane:spawnPlane
        }
    });
