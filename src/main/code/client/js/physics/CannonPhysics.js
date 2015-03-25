define([
    'goo/math/Vector3',
    'goo/addons/physicspack/components/ColliderComponent',
    'goo/addons/physicspack/systems/PhysicsSystem',
    'goo/addons/physicspack/RaycastResult',
    'goo/addons/physicspack/systems/ColliderSystem',
    'goo/addons/physicspack/components/RigidBodyComponent',
    'goo/addons/physicspack/colliders/BoxCollider',
    'goo/addons/physicspack/colliders/CylinderCollider',
    'goo/addons/physicspack/colliders/SphereCollider',
    'goo/addons/physicspack/colliders/PlaneCollider',
    'goo/addons/physicspack/colliders/MeshCollider',
    'goo/addons/physicspack/joints/BallJoint',
    'goo/addons/physicspack/joints/HingeJoint',
    'goo/addons/linerenderpack/LineRenderSystem',
    'goo/addons/physicspack/systems/PhysicsDebugRenderSystem'
], function (
    Vector3,
    ColliderComponent,
    PhysicsSystem,
    RaycastResult,
    ColliderSystem,
    RigidBodyComponent,
    BoxCollider,
    CylinderCollider,
    SphereCollider,
    PlaneCollider,
    MeshCollider,
    BallJoint,
    HingeJoint,
    LineRenderSystem,
    PhysicsDebugRenderSystem
    ) {

        var calcVec = new Vector3();
        var calcVec2 = new Vector3();




    var RayHitContainer = function() {
        this.start;
        this.direction = new Vector3();
        this.hitVector = new Vector3();
        this.distance = 0;
        this.fraction = 1;
        this.normal;
        this.entity;
    };

    RayHitContainer.prototype.setupRayCast = function(start, end) {
        this.fraction = 1;
        this.start = start;
        this.end = end;
        this.direction.setVector(end);
        this.direction.subVector(start);
        this.distance = this.direction.length();
        this.direction.normalize();
    };

    RayHitContainer.prototype.applyHitResult = function(raycastResult) {
        this.normal = raycastResult.normal;
        this.raycastResult = raycastResult;
    };

    RayHitContainer.prototype.calcFraction = function() {

        this.hitVector.setVector(this.raycastResult.point);
        this.hitVector.subVector(this.start);
        this.fraction = this.hitVector.length() / this.distance;
        return this.fraction;
    };






    var CannonPhysics = function() {
            this.physicsSystem = new PhysicsSystem();
            this.rayOpts = this.physicsSystem._getCannonRaycastOptions({skipBackfaces : true});
            this.rayResult = new RaycastResult();
            this.rayHitContainer = new RayHitContainer();
        };

        CannonPhysics.prototype.createTriangleMeshShape = function(meshData, translate) {

        };


        function attachKinematic(entity, spatial) {
            entity.transformComponent.transform.translation.setVector(spatial.pos);
            entity.transformComponent.transform.rotation.copy(spatial.rot);
            entity.transformComponent.updateWorldTransform();
            var rbComponent = new RigidBodyComponent({
                mass: 0,
                velocity: new Vector3(0, 0, 0),
                angularVelocity: new Vector3(0, 0, 0),
                isKinematic: true
            });
            entity.set(rbComponent);
        }

        function attachMeshCollider(entity, meshData) {
            entity.set(
                new ColliderComponent({
                    collider: new MeshCollider({ meshData: meshData})
                })
            );
        }

        CannonPhysics.prototype.addPhysicalWorldMesh = function(meshData, x, y, z) {

        };

        CannonPhysics.prototype.setTrimeshPhysicsTransform = function(pos, rot) {

        };

        CannonPhysics.prototype.stepSimulation = function() {

        };

        CannonPhysics.prototype.initPhysics = function(goo) {
            this.goo = goo;
            this.world = goo.world;
            this.world.setSystem(this.physicsSystem);
            this.world.setSystem(new ColliderSystem());


            goo.setRenderSystem(new PhysicsDebugRenderSystem());
            this.lineRenderSystem = new LineRenderSystem(this.world);
            goo.setRenderSystem(this.lineRenderSystem);

        };

        CannonPhysics.prototype.createPhysicsComponentScript = function() {

        };

        CannonPhysics.prototype.createAmmoMovableShapeScript = function(gameEntity, gooEntity) {

        };


        CannonPhysics.prototype.addPhysicalMeshChild = function(meshData, gooEntity) {
            attachMeshCollider(gooEntity, meshData)
        };

        CannonPhysics.prototype.createPhysicsShapeComponent = function(gameEntity, gooEntity) {
            attachKinematic(gooEntity, gameEntity.spatial);

            this.addPhysicalMeshChild(gooEntity.transformComponent.children[0].entity.meshDataComponent.meshData, gooEntity.transformComponent.children[0].entity, gameEntity);
        };

        CannonPhysics.prototype.createPhysicsSphere = function(radius, pos) {

        };


        CannonPhysics.prototype.physicsRayRange = function(start, end) {

            this.rayHitContainer.setupRayCast(start, end);
            this.lineRenderSystem.drawLine(this.rayHitContainer.start, this.rayHitContainer.end, this.lineRenderSystem.MAGENTA);
        //    this.lineRenderSystem.drawLine(this.rayHitContainer.start, end, this.lineRenderSystem.GREEN);
            var hit = this.physicsSystem.raycastClosest(this.rayHitContainer.start, this.rayHitContainer.direction, this.rayHitContainer.distance, this.rayOpts, this.rayResult);

            if (hit) {
                this.lineRenderSystem.drawCross(this.rayResult.point, this.lineRenderSystem.YELLOW, 0.4);
            //    console.log("Cannon ray hit: ", hit, this.rayResult);
                this.rayHitContainer.applyHitResult(this.rayResult);
                this.rayHitContainer.calcFraction();
                return this.rayHitContainer;
            }
            return false;
        };


        CannonPhysics.prototype.groundContact = function(pos, radius) {

        }


        CannonPhysics.prototype.attachSphericalMovementScript = function(translateParent, gameEntity) {

        }

        CannonPhysics.prototype.removePhysicsComponent = function(component) {

        }

        CannonPhysics.prototype.activatePhysicsComponent = function(component, pos, vel, radius) {

        }

        CannonPhysics.prototype.deactivateAmmoComponent = function(component) {

        }

        CannonPhysics.prototype.addHeightmap = function(matrix, dim, widthPoints, lengthPoints) {

        }

        return CannonPhysics;

    });