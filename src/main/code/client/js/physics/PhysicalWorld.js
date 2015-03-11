define([
    'application/EventManager',
    'goo/entities/components/ScriptComponent',
	'goo/entities/EntityUtils',
	'goo/math/Quaternion',
    'goo/math/Matrix3x3',
	'goo/math/Vector3'],
	function(
        event,
		ScriptComponent,
		EntityUtils,
		Quaternion,
        Matrix3x3,
		Vector3
		) {
		"use strict";

		var calcVec = new Vector3();
		var ammoWorld;

		// worker variables.
		var physTransform;
		var quaternion;
		var btVec = new Ammo.btVector3();
        var btVec2 = new Ammo.btVector3();
        var rayFromVec = new Ammo.btVector3();
        var rayToVec = new Ammo.btVector3();
        var calcMat = new Matrix3x3();
		// enum PHY_ScalarType
		var PHY_FLOAT = 0;
		var PHY_DOUBLE = 1;
		var PHY_INTEGER = 2;
		var PHY_SHORT = 3;
		var PHY_FIXEDPOINT88 = 4;
		var PHY_UCHAR = 5;


		function createTriangleMeshShape(meshData, translate) {
			var vertices = meshData.dataViews.POSITION;
			var indices = meshData.indexData.data;

			var numTriangles = meshData.indexCount / 3;
			var numVertices = meshData.vertexCount;

			var triangleMesh = new Ammo.btTriangleIndexVertexArray();

			var indexType = PHY_INTEGER;
			var mesh = new Ammo.btIndexedMesh();

			var floatByteSize = 4;
			var vertexBuffer = Ammo.allocate( floatByteSize * vertices.length, "float", Ammo.ALLOC_NORMAL );

			var scale = 1;

			for ( var i = 0, il = vertices.length; i < il; i ++ ) {

				Ammo.setValue( vertexBuffer + i * floatByteSize, scale * vertices[ i ], 'float' );

			}
			var use32bitIndices = true;
			var intByteSize = use32bitIndices ? 4 : 2;
			var intType = use32bitIndices ? "i32" : "i16";


			var indexBuffer = Ammo.allocate( intByteSize * indices.length, intType, Ammo.ALLOC_NORMAL );

			for ( var i = 0, il = indices.length; i < il; i ++ ) {

				Ammo.setValue( indexBuffer + i * intByteSize, indices[ i ], intType );

			}

			var indexStride = intByteSize * 3;
			var vertexStride = floatByteSize * 3;

			mesh.set_m_numTriangles( numTriangles );
			mesh.set_m_triangleIndexBase( indexBuffer );
			mesh.set_m_triangleIndexStride( indexStride );

			mesh.set_m_numVertices( numVertices );
			mesh.set_m_vertexBase( vertexBuffer );
			mesh.set_m_vertexStride( vertexStride );

			triangleMesh.addIndexedMesh( mesh, indexType );

			var useQuantizedAabbCompression = true;
			var buildBvh = true;

			var shape = new Ammo.btBvhTriangleMeshShape( triangleMesh, useQuantizedAabbCompression, buildBvh );
			return shape;
		}


        function addPhysicalWorldMesh(meshData, x, y, z) {
            console.log("Phys Mesh: ", meshData)
            var groundShape = createTriangleMeshShape(meshData);
            var groundTransform = new Ammo.btTransform();
            groundTransform.setIdentity();
            groundTransform.setOrigin(new Ammo.btVector3(x, y, z));
            var groundMass = 0; // Mass of 0 means ground won't move from gravity or collisions
            var localInertia = new Ammo.btVector3(0, 0, 0);
            var motionState = new Ammo.btDefaultMotionState( groundTransform );
            var rbInfo = new Ammo.btRigidBodyConstructionInfo(groundMass, motionState, groundShape, localInertia);
            var groundAmmo = new Ammo.btRigidBody( rbInfo );



            groundAmmo.setFriction(5);
            ammoWorld.addRigidBody(groundAmmo);
        }

        function setTrimeshPhysicsTransform(pos, rot) {

        }

        function stepAmmoSimulation() {

            // TODO:  Try updating in a Worker()
            ammoWorld.stepSimulation(1/60, 3)
        }

		function initPhysics() {
			console.log("Init Physics")

			physTransform = new Ammo.btTransform();
			quaternion = new Quaternion();


			var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
			var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
			var overlappingPairCache = new Ammo.btDbvtBroadphase();
			var solver = new Ammo.btSequentialImpulseConstraintSolver();
			ammoWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration );
			ammoWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));
        //    event.registerListener(event.list().RENDER_TICK, stepAmmoSimulation);
		}

		function createAmmoComponentScript() {
			var script = new ScriptComponent({
				run: function(entity) {
					var transformComp = entity.getComponent("transformComponent");
					entity.ammoComponent.getMotionState().getWorldTransform(physTransform);
					var origin = physTransform.getOrigin();
					transformComp.setTranslation(origin.x(), origin.y(), origin.z());
					var pquat = physTransform.getRotation();
					quaternion.setDirect(pquat.x(), pquat.y(), pquat.z(), pquat.w());
					transformComp.transform.rotation.copyQuaternion(quaternion);
					transformComp.setUpdated();
				}
			});
			return script
		}

        function createAmmoMovableShapeScript(gameEntity, gooEntity) {
        //    var translation = gooEntity.transformComponent.transform.translation;
			gooEntity.physTransform = new Ammo.btTransform();
            gooEntity.physQuat = new Ammo.btQuaternion();
        //    gooEntity.physTransform.setRotation(gooEntity.physQuat);
			var script = new ScriptComponent({
				run: function(entity) {
					entity.ammoShapeComponent.getWorldTransform(entity.physTransform);

					entity.physTransform.getOrigin().setX(entity.gameSpatial.pos.data[0]);
					entity.physTransform.getOrigin().setY(entity.gameSpatial.pos.data[1]);
					entity.physTransform.getOrigin().setZ(entity.gameSpatial.pos.data[2]);
					calcMat.set(entity.gameSpatial.rot);
					calcMat.rotateX(-Math.PI*0.5)
					var rot = calcMat.toAngles();

					entity.physQuat.setEuler(rot.data[2], rot.data[0], rot.data[1]);
					entity.physTransform.setRotation(entity.physQuat);
					entity.ammoShapeComponent.setWorldTransform(entity.physTransform);

					entity.ammoShapeComponent.activate();

				}
			});



            return script
        }


        function addPhysicalMeshChild(meshData, gooEntity, gameEntity) {
            var physShape = createTriangleMeshShape(meshData);
            //   gooEntity.transformComponent.children[0].entity.transformComponent.transform.rotation.rotateX(Math.PI*0.5);
            //    gooEntity.transformComponent.children[0].entity.transformComponent.transform.setRotationXYZ(0, 0, 0);



            var pTransform = new Ammo.btTransform();
            pTransform.setIdentity();
            pTransform.setOrigin(new Ammo.btVector3(gameEntity.spatial.pos.data[0], gameEntity.spatial.pos.data[1], gameEntity.spatial.pos.data[2]));
            var mass = 0; // Mass of 0 means ground won't move from gravity or collisions
            var localInertia = new Ammo.btVector3(0, 0, 0);

            //    physShape.calculateLocalInertia( mass, localInertia );

            var motionState = new Ammo.btDefaultMotionState( pTransform );
            var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physShape, localInertia);
            var rBodyAmmo = new Ammo.btRigidBody( rbInfo );
                btVec.setValue(1, 0, 1);
                rBodyAmmo.setLinearFactor(btVec);
            ammoWorld.addRigidBody(rBodyAmmo);
            gooEntity.ammoShapeComponent = rBodyAmmo;
            rBodyAmmo.setFriction(1);
            gameEntity.rbPtr = rBodyAmmo.ptr;
			var script = createAmmoMovableShapeScript(gameEntity, gooEntity)

            gooEntity.setComponent(script);
        }

        function createAmmoShapeComponent(gameEntity, gooEntity) {
        //    for (var i = 0; i < gooEntity.transformComponent.children.length; i++) {
                addPhysicalMeshChild(gooEntity.transformComponent.children[0].entity.meshDataComponent.meshData, gooEntity, gameEntity);
        //    }
        }

		function createAmmoJSSphere(radius, pos) {

            var mass = 5 * radius * radius * radius;
			var startTransform = new Ammo.btTransform();
			startTransform.setIdentity();

            startTransform.getOrigin().setX(pos[0]);
			startTransform.getOrigin().setY(pos[1]+radius);
            startTransform.getOrigin().setZ(pos[2]);

			var localInertia = new Ammo.btVector3(0, 0, 0);

			var shape = new Ammo.btSphereShape(radius);
			shape.calculateLocalInertia( mass, localInertia );
			var motionState = new Ammo.btDefaultMotionState( startTransform );
			var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
			var rBody = new Ammo.btRigidBody( rbInfo );
            rBody.setFriction(0.5);   // set this on the ground instead...
			ammoWorld.addRigidBody(rBody);
			return rBody;
		}


        var rayCallback = new Ammo.ClosestRayResultCallback(rayFromVec, rayToVec);

        function physicsRayRange(pos, dir) {

            rayFromVec.setX(pos[0]);
            rayFromVec.setY(pos[1]);
            rayFromVec.setZ(pos[2]);

            rayToVec.setX(dir[0]);
            rayToVec.setY(dir[1]);
            rayToVec.setZ(dir[2]);

        //           console.log(rayCallback)

        //    rayCallback.set_m_collisionObject(null);
            rayCallback.set_m_closestHitFraction(1);
            rayCallback.get_m_rayFromWorld().setValue(pos[0], pos[1], pos[2]);
            rayCallback.get_m_rayToWorld().setValue(dir[0], dir[1], dir[2]);

            ammoWorld.rayTest(rayFromVec, rayToVec, rayCallback); // m_btWorld is btDiscreteDynamicsWorld

            var fraction = rayCallback.get_m_closestHitFraction();
            var hit = false;
            if(fraction < 1){

                hit={fraction:fraction, normal:rayCallback.get_m_hitNormalWorld(), rbPtr:rayCallback.get_m_collisionObject().ptr}
            //    console.log("Ray hit:",hit, rayCallback.get_m_collisionObject(), rayCallback.get_m_collisionFilterGroup());
            }
            return hit;
        }


        function groundContact(pos, radius) {
            return physicsRayRange([pos[0], pos[1]-radius*0.5, pos[2]], [pos[0], pos[1]-radius*1.5, pos[2]]);
        }


		function attachSphericalMovementScript(translateParent, gameEntity) {
			translateParent.gameEntity = gameEntity;
	/*
			var attachToSphereScript = new ScriptComponent({
				run: function(entity) {
					entity.gameEntity.spatial.pos.set(entity.sphereEntity.transformComponent.transform.translation);
					entity.gameEntity.moveSphere.spatialControl.sphereMovement.groundContact = groundContact(entity.gameEntity.spatial.pos, entity.gameEntity.pieceData.dimensions.mobRadius)
				}}
			);

			 translateParent.setComponent(attachToSphereScript);

*/
			translateParent.sphereEntity.updatePhysics = function() {
				gameEntity.spatial.pos.set(translateParent.sphereEntity.transformComponent.transform.translation);
				gameEntity.moveSphere.spatialControl.sphereMovement.groundContact = groundContact(gameEntity.spatial.pos, gameEntity.pieceData.dimensions.mobRadius)
			};


			translateParent.sphereEntity.deactivate = function() {
				deactivateAmmoComponent(translateParent.sphereEntity.ammoComponent)
			};

			translateParent.sphereEntity.activate = function(pos, vel, radius) {
				activateAmmoComponent(translateParent.sphereEntity.ammoComponent, pos, vel, radius)
			};

			return translateParent;
		}

		function removeAmmoComponent(component) {
			ammoWorld.removeRigidBody(component);
		}

        function activateAmmoComponent(component, pos, vel, radius) {
            component.activate();
            if (pos) {
				if (!radius) radius = 0.5;
                var transform = component.getCenterOfMassTransform();
                transform.getOrigin().setX(pos[0]);
                transform.getOrigin().setY(pos[1]+radius);
                transform.getOrigin().setZ(pos[2]);
                console.log(pos[0] ,pos[1],pos[2])
                component.setCenterOfMassTransform(transform);
            }
            if (vel) {
                console.log("SET VEL: ", vel)
                component.setLinearVelocity(new Ammo.btVector3(vel[0], vel[1], vel[2]));
            }
            component.enabled = true;
        }

        function deactivateAmmoComponent(component) {
            component.enabled = false;
        //    component.deactivate();
        }

        function addHeightmap(matrix, dim, widthPoints, lengthPoints) {
            var xw = dim.maxX - dim.minX;
            var yw = dim.maxY - dim.minY;
            var zw = dim.maxZ - dim.minZ;

            // --- Physics Start ---
            var floatByteSize = 4;
            var heightBuffer = Ammo.allocate(floatByteSize * widthPoints * lengthPoints, "float", Ammo.ALLOC_NORMAL);

            for (var z = 0; z < lengthPoints; z++) {
                for (var x = 0; x < widthPoints; x++) {
                    Ammo.setValue(heightBuffer + (z * widthPoints + x) * floatByteSize, matrix[x][z] * yw, 'float');
                }
            }

            var heightScale = 1.0;
            var minHeight = dim.minY;
            var maxHeight = dim.maxY;
            var upAxis = 1; // 0 => x, 1 => y, 2 => z
            var heightDataType = 0; //PHY_FLOAT;
            var flipQuadEdges = false;

            var shape = new Ammo.btHeightfieldTerrainShape(
                widthPoints,
                lengthPoints,
                heightBuffer,
                heightScale,
                minHeight,
                maxHeight,
                upAxis,
                heightDataType,
                flipQuadEdges
            );

            var sx = xw / widthPoints;
            var sz = zw / lengthPoints;
            var sy = 1.0;

            var sizeVector = new Ammo.btVector3(sx, sy, sz);
            shape.setLocalScaling(sizeVector);

            var ammoTransform = new Ammo.btTransform();
            ammoTransform.setIdentity(); // TODO: is this needed ?
            ammoTransform.setOrigin(new Ammo.btVector3(dim.minX, dim.minY, dim.minZ));
            // ammoTransform.setOrigin(new Ammo.btVector3( xw / 2, 0, zw / 2 ));
            // this.gooQuaternion.fromRotationMatrix(gooTransform.rotation);
            // var q = this.gooQuaternion;
            // ammoTransform.setRotation(new Ammo.btQuaternion(q.x, q.y, q.z, q.w));
            var motionState = new Ammo.btDefaultMotionState( ammoTransform );
            var localInertia = new Ammo.btVector3(0, 0, 0);

            var mass = 0;
            // rigidbody is dynamic if and only if mass is non zero, otherwise static
            // if(mass !== 0.0) {
            // shape.calculateLocalInertia( mass, localInertia );
            // }

            var info = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
            var body = new Ammo.btRigidBody(info);

            ammoWorld.addRigidBody(body);
        }


		return {
            addHeightmap:addHeightmap,
			initPhysics:initPhysics,
            stepAmmoSimulation:stepAmmoSimulation,
            addPhysicalWorldMesh:addPhysicalWorldMesh,
            setTrimeshPhysicsTransform:setTrimeshPhysicsTransform,
            physicsRayRange:physicsRayRange,
			createAmmoJSSphere:createAmmoJSSphere,
            createAmmoShapeComponent:createAmmoShapeComponent,
			createAmmoComponentScript:createAmmoComponentScript,
			attachSphericalMovementScript:attachSphericalMovementScript,
			removeAmmoComponent:removeAmmoComponent,
            deactivateAmmoComponent:deactivateAmmoComponent,
            activateAmmoComponent:activateAmmoComponent
		}
	});
