"use strict";

define([
    'goo/math/Vector3',
    'game/EntityController',
    'game/GameUtil',
    '3d/HeightmapManager',
    'physics/PhysicalWorld'
],
    function(
        Vector3,
        entityController,
        gameUtil,
        HeightmapManager,
        AmmoPhysicalWorld
        ) {

        var calcVec = new Vector3();
        var calcVec2 = new Vector3();
        var physicalEntities = {};

        var registerPhysicalEntity = function(entity) {
            physicalEntities[entity.id] = entity;
        };

        var checkHitAgainstPhysicalShape = function(posToCheck, targetEntity) {
            for (var i = 0; i < targetEntity.pieceData.physicalShapes.length; i++) {

                var part = targetEntity.pieceData.physicalShapes[i];
                calcVec.seta(part.posOffset);
                var pos = gameUtil.applyRotationToVelocity(targetEntity.geometries[0], calcVec);
                pos.addv(targetEntity.spatial.pos);
                var distance = pos.subv(posToCheck);
                var range = Math.sqrt(distance.lengthSquared());
                if (range < part.radius) {
                    return {part:part, entity:targetEntity, pos:[posToCheck.data[0], posToCheck.data[1], posToCheck.data[2]]};
                }
            }

        };

        var checkEntityPosAgainstShapes= function(entity, posToCheck) {
            for (var index in physicalEntities) {
                if (entity.originatorId != index && entity.id != index) {
                    var targetEntity = physicalEntities[index];
                    var size = targetEntity.pieceData.physicalRadius;

                    var tPos = calcVec.setv(targetEntity.spatial.pos);
                    if (tPos.data == undefined) console.log(index, targetEntity);
                    var distance = tPos.subv(posToCheck);
                    var range = Math.sqrt(distance.lengthSquared());
                    if (range < size) {
                        var hit = checkHitAgainstPhysicalShape(posToCheck, targetEntity);
                        if (hit) return hit;
                    }
                }
            }
        };

        var checkSpatialConflict = function(entity, time) {
            var posToCheck = entity.spatial.pos;

            var timeFactor = time;
            var hit;

            var meshHit = AmmoPhysicalWorld.physicsRayRange(entity.spatial.pos, [entity.spatial.pos[0]+entity.spatial.velocity[0]*timeFactor, entity.spatial.pos[1]+entity.spatial.velocity[1]*timeFactor,entity.spatial.pos[2]+entity.spatial.velocity[2]*timeFactor]);
            if (meshHit) {
                var pos = calcVec2.set(entity.spatial.pos[0]+entity.spatial.velocity[0]*meshHit.fraction*timeFactor, entity.spatial.pos[1]+entity.spatial.velocity[1]*meshHit.fraction*timeFactor,entity.spatial.pos[2]+entity.spatial.velocity[2]*meshHit.fraction*timeFactor);
                hit = checkEntityPosAgainstShapes(entity, pos);

                if (hit) return hit;
			//	console.log("hit: ", hit)
                return {part:"mesh", entity:null, pos:pos};
            }

        //    hit = checkEntityPosAgainstShapes(entity, posToCheck);
         //   if (hit) return hit;

            var aboveGround = HeightmapManager.getHeightAboveGroundAtPos(posToCheck.data);

            if(aboveGround < 0.5) return {part:"ground", entity:null, pos:[posToCheck.data[0], posToCheck.data[1], posToCheck.data[2]]};
            if (posToCheck.data[1] < 0) return {part:"water", entity:null, pos:[posToCheck.data[0], posToCheck.data[1], posToCheck.data[2]]};
            return false;
        };

        var getRangesToNearbyConflics = function(entity) {
            var posToCheck = entity.spatial.pos;
            var ranges = {entities:[]};

        //   for (var index in physicalEntities) {
        //       if (entity.originatorId != index && entity.id != index) {
        //           var targetEntity = physicalEntities[index];
        //           var size = targetEntity.pieceData.physicalRadius;
        //           var tPos = calcVec.setv(targetEntity.spatial.pos);
        //           var distance = tPos.subv(posToCheck);
        //           var range = Math.sqrt(distance.lengthSquared());
        //           if (range < size) {
        //               ranges.entities.push(targetEntity)
        //           }
        //       }
        //   }

            var aboveGround = HeightmapManager.getHeightAboveGroundAtPos(posToCheck.data);
            ranges.ground = aboveGround;
            return ranges;
        };

        var renderGroundHitEffect = function(pos) {

            HeightmapManager.paintTerrainPoint(pos, 2, {color:[0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random(), 0.1]});
            HeightmapManager.paintTerrainPoint(pos, 1, {color:[0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random(), 0.2]});
            HeightmapManager.paintTerrainPoint(pos, 0.4, {color:[0.1*Math.random(), 0.1*Math.random(), 0.1*Math.random(), 0.3]});
        };

        var removePhysical = function(entityId) {
            delete physicalEntities[entityId];
        };

        return {
            registerPhysicalEntity:registerPhysicalEntity,
            getRangesToNearbyConflics:getRangesToNearbyConflics,
            checkHitAgainstPhysicalShape:checkHitAgainstPhysicalShape,
            checkSpatialConflict:checkSpatialConflict,
            renderGroundHitEffect:renderGroundHitEffect,
            removePhysical:removePhysical
        };
    });