define([
        'goo/entities/SystemBus',
        'physics/CannonPhysics',
		'goo/entities/components/ScriptComponent'
    ],
	function(
        SystemBus,
        CannonPhysics,
		ScriptComponent
		) {
		"use strict";

    //    var physicsApi = new AmmoPhysics();
        var physicsApi = new CannonPhysics();
        function addPhysicalWorldMesh(meshData, x, y, z) {
            return physicsApi.addPhysicalWorldMesh(meshData, x, y, z);
        }

        function stepPhysicsSimulation() {
            return physicsApi.stepSimulation(1/60, 3);
        }

		function initPhysics(goo) {
            return physicsApi.initPhysics(goo);
		}

		function createPhysicsComponentScript() {
            return physicsApi.createPhysicsComponentScript();
		}

        function createPhysicsShapeComponent(gameEntity, gooEntity) {
            return physicsApi.createPhysicsShapeComponent(gameEntity, gooEntity);
        }

		function createPhysicsSphere(entity, radius, pos) {
            return physicsApi.createPhysicsSphere(entity, radius, pos);
		}

        function physicsRayRange(pos, dir) {
            return physicsApi.physicsRayRange(pos, dir);
        }

		function attachSphericalMovementScript(translateParent, gameEntity) {

			translateParent.gameEntity = gameEntity;

			 var attachToSphereScript = new ScriptComponent({
			 run: function(entity, tpf) {
			    entity.gameEntity.spatial.pos.setVector(entity.sphereEntity.transformComponent.transform.translation);
                entity.gameEntity.moveSphere.rigidBodyComponent.getVelocity(entity.gameEntity.spatial.velocity);
                entity.gameEntity.spatial.velocity.mulDirect(tpf, tpf, tpf);
			    entity.gameEntity.moveSphere.spatialControl.sphereMovement.groundContact = physicsApi.groundContact(entity.gameEntity.spatial.pos, entity.gameEntity.pieceData.dimensions.mobRadius, entity.gameEntity.spatial.velocity)
             }}
			 );

			 translateParent.set(attachToSphereScript);


			var _this = this;
            /*
			translateParent.sphereEntity.updatePhysics = function() {
				gameEntity.spatial.pos.set(translateParent.sphereEntity.transformComponent.transform.translation);
				gameEntity.moveSphere.spatialControl.sphereMovement.groundContact = physicsApi.groundContact(gameEntity.spatial.pos, gameEntity.pieceData.dimensions.mobRadius, gameEntity.spatial.velocity)
			};
            */

			translateParent.sphereEntity.deactivate = function() {
				_this.deactivateAmmoComponent(translateParent.sphereEntity.ammoComponent)
			};

			translateParent.sphereEntity.activate = function(pos, vel, radius) {
				_this.activatePhysicsComponent(translateParent.sphereEntity.ammoComponent, pos, vel, radius)
			};

			return translateParent;
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

        var controlEvent = function(eArgs) {
            if (eArgs.setting != "toggle_debug_physics") {
                return;
            };
            physicsApi.toggleDebugPhysics();

        }

        SystemBus.addListener('guiInitConfiguration', controlEvent);

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
