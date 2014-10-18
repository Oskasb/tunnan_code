"use strict";

define([
	'3d/GooJointAnimator',
    'goo/math/Vector3',
    'goo/math/Matrix3x3'
],
    function(
		GooJointAnimator,
		Vector3,
        Matrix3x3
		) {

    var clientEntities = {};
    var clientSeedNr = 0;

    var getEntityById = function(entityId) {
        var entity = clientEntities[entityId];
        return entity;
    };

    var removeGeometryFromWorld = function(geometry) {
        removeGeometry(geometry);
    //    console.log(geometry)
        geometry.removeFromWorld();
    };

    var removeGeometry = function(geometry) {
        if (!geometry.transformComponent) return;
        for (var j = 0; j < geometry.transformComponent.children.length; j++) {
            var child = geometry.transformComponent.children[j];
            removeGeometryFromWorld(child.entity);
        }
        geometry.removeFromWorld();
    };

    var deleteClientEntity = function(entityId) {
        if (clientEntities[entityId].geometries) {
            var entity = clientEntities[entityId]



            for (var i = 0; i < entity.geometries.length; i++) {
                var topEntity = entity.geometries[i];
				if (topEntity.animationComponent) GooJointAnimator.resetEntityAnimationState(entity);
                removeGeometry(topEntity);
            }
        }
        delete clientEntities[entityId];
    };

        var addEntity = function(entity) {
        clientEntities[entity.id] = entity;
        return clientEntities[entity.id];
    };

    var addEntitySpatial = function(entity, pos, rot, dir) {
        entity.controls = {
            forward:            {value:0, controlState:0},
            back:               {value:0, controlState:0},
            turnleft:           {value:0, controlState:0},
            turnright:          {value:0, controlState:0},
            mouseturn:          {value:0, controlState:0},
            mouseforward:       {value:0, controlState:0},
            strafe:             {value:0, controlState:0},
            jump:               {value:0, controlState:0}
        };
		entity.stats = {
			altitude:0,
			speed:0,
			heading:0
		};
        entity.spatial = {
            pos:new Vector3(0, 0, 0),
            visualPos:new Vector3(0, 0, 0),
            visualRot: new Matrix3x3(),
            rot: new Matrix3x3(),
            dir:dir || [0, 0, 0],
            acc:new Vector3([0, 0, 0]),
            axisAttitudes:new Vector3([0, 0, 0]),
            velocity:new Vector3([0, 0.000001, 0]),
            audioVel:new Vector3([0, 0.000001, 0]),
            angularVelocity:new Vector3([0, 0, 0]),
        //    angularVelocity:new Vector3([0, 0, 0]),
            speed: 0,
            state: "stop",
            angle: 0,
            lastFrame: new Date().getTime()
        };
    //    entity.spatial.rot.rotateX(Math.PI / 2);
        entity.forces = {
            lift:new Vector3([0, 1, 0]),
            wingLiftLeft:{mag:new Vector3([0, 0, 0]),poa:new Vector3([0, 0, 0])},
            wingLiftRight:{mag:new Vector3([0, 0, 0]),poa:new Vector3([0, 0, 0])},
            rudderYaw:{mag:new Vector3([0, 0, 0]),poa:new Vector3([0, 0, 0])},
            elevatorLift:{mag:new Vector3([0, 0, 0]),poa:new Vector3([0, 0, 0])},

        //    rudderLift:new Vector3([0, 1, 0]),
            buoyancy:new Vector3([0, 0, 0]),
            drag:new Vector3([0, 0, 1]),
            weight:new Vector3([0, 1, 0]),
            thrust:new Vector3([0, 0, 0]),
            torque:new Vector3([0, 0, 0]),
            g:new Vector3([0, 0, 0])
        };

        entity.combat = {
            hitPoints:1,
            damageTaken:0,
            isAlive:true
        };
        entity.geometries = [];
    };

    var createClientEntityId = function() {
        clientSeedNr = clientSeedNr +1;
        var id = "cl"+clientSeedNr+"";
        return id;
    };

    var createClientEntity = function(entityId) {
        if (!entityId) {
            var entityId = createClientEntityId();
        };
        var newEntity = {};
        newEntity.id = entityId;
        newEntity.isSelected = false;
        addEntity(newEntity);
        addEntitySpatial(newEntity);
        return newEntity;
    };

        var delayedHide = function(entity, delay) {
            entity.hideDelay = setTimeout(function() {
                entity.removedFromWorld = true;

                entity.geometries[0].removeFromWorld();

                for (var i = 0; i < entity.geometries[0].transformComponent.children.length; i++) {
            //        entity.geometries[0].transformComponent.children[i].entity.removeFromWorld();
                }
            }, delay);
        };

        var showEntityGeometry = function(entity) {
            clearTimeout(entity.hideDelay)
            entity.hideDelay = null;
            if (!entity.removedFromWorld) return;

          entity.geometries[0].addToWorld();
            entity.removedFromWorld = false;
       //  return;
            for (var i = 0; i < entity.geometries[0].transformComponent.children.length; i++) {
                //            entity.geometries[0].transformComponent.children[i].entity.addToWorld();
            }

        };

        var hideEntityGeometry = function(entity) {
            if (entity.hideDelay) return;
            if (entity.removedFromWorld) return;

        //    entity.geometries[0].removeFromWorld();
        //    return;
            delayedHide(entity, 5000);

        };

		var resetSeed = function() {
			clientSeedNr = 0;
		};

    return {
		clientEntities:clientEntities,
		resetSeed:resetSeed,
        getEntityById:getEntityById,
        createClientEntity:createClientEntity,
        deleteClientEntity:deleteClientEntity,
        hideEntityGeometry:hideEntityGeometry,
        showEntityGeometry:showEntityGeometry

    }
})
