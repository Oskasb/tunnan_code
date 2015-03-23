define([
        'physics/AmmoPhysics',
        'physics/CannonPhysics'
    ],
	function(
        AmmoPhysics,
        CannonPhysics
		) {
		"use strict";

        var physicsApi = new AmmoPhysics();
        var cannonPhysics = new CannonPhysics();
        function addPhysicalWorldMesh(meshData, x, y, z) {
            return physicsApi.addPhysicalWorldMesh(meshData, x, y, z);
        }

        function stepPhysicsSimulation() {
            return physicsApi.stepSimulation(1/60, 3);
        }

		function initPhysics(gooWorld) {
            cannonPhysics.initPhysics(gooWorld);
            return physicsApi.initPhysics();
		}

		function createPhysicsComponentScript() {
            return physicsApi.createPhysicsComponentScript();
		}

        function createPhysicsShapeComponent(gameEntity, gooEntity) {
            return physicsApi.createPhysicsShapeComponent(gameEntity, gooEntity);
        }

		function createPhysicsSphere(radius, pos) {
            return physicsApi.createPhysicsSphere(radius, pos);
		}

        function physicsRayRange(pos, dir) {
            return physicsApi.physicsRayRange(pos, dir);
        }

		function attachSphericalMovementScript(translateParent, gameEntity) {
            return physicsApi.attachSphericalMovementScript(translateParent, gameEntity);
		}

		function removePhysicsComponent(component) {
            return physicsApi.removePhysicsComponent(component);
		}

        function activatePhysicsComponent(component, pos, vel, radius) {
            return physicsApi.activatePhysicsComponent(component, pos, vel, radius);
        }

        function deactivateAmmoComponent(component) {
            return physicsApi.deactivateAmmoComponent(component);
        }

        function addHeightmap(matrix, dim, widthPoints, lengthPoints) {
            return physicsApi.addHeightmap(matrix, dim, widthPoints, lengthPoints);
        }

		return {
            addHeightmap:addHeightmap,
			initPhysics:initPhysics,
            stepPhysicsSimulation:stepPhysicsSimulation,
            addPhysicalWorldMesh:addPhysicalWorldMesh,
            physicsRayRange:physicsRayRange,
			createPhysicsSphere:createPhysicsSphere,
            createPhysicsShapeComponent:createPhysicsShapeComponent,
			createPhysicsComponentScript:createPhysicsComponentScript,
			attachSphericalMovementScript:attachSphericalMovementScript,
			removePhysicsComponent:removePhysicsComponent,
            deactivateAmmoComponent:deactivateAmmoComponent,
            activatePhysicsComponent:activatePhysicsComponent
		}
	});
