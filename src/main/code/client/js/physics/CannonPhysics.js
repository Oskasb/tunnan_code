define([
    'goo/math/Vector3',
    'goo/addons/physicspack/components/ColliderComponent',
    'goo/addons/physicspack/systems/PhysicsSystem',
    'goo/addons/physicspack/systems/ColliderSystem',
    'goo/addons/physicspack/components/RigidBodyComponent',
    'goo/addons/physicspack/colliders/BoxCollider',
    'goo/addons/physicspack/colliders/CylinderCollider',
    'goo/addons/physicspack/colliders/SphereCollider',
    'goo/addons/physicspack/colliders/PlaneCollider',
    'goo/addons/physicspack/joints/BallJoint',
    'goo/addons/physicspack/joints/HingeJoint'
], function (
    Vector3,
    ColliderComponent,
    PhysicsSystem,
    ColliderSystem,
    RigidBodyComponent,
    BoxCollider,
    CylinderCollider,
    SphereCollider,
    PlaneCollider,
    BallJoint,
    HingeJoint
    ) {

        var CannonPhysics = function() {

        };

        CannonPhysics.prototype.createTriangleMeshShape = function(meshData, translate) {

        };


    function attachKinematic(entity) {
        var rbComponent = new RigidBodyComponent({
            mass: 0,
            velocity: new Vector3(0, 0, 3),
            angularVelocity: new Vector3(0, 0, 3),
            isKinematic: true
        });

        var halfExtents = new Vector3(1, 1, 1);

        entity.set(rbComponent)
        entity.set(
            new ColliderComponent({
                collider: new BoxCollider({
                    halfExtents: halfExtents
                })
            })
        );
    }

        CannonPhysics.prototype.addPhysicalWorldMesh = function(meshData, x, y, z) {

        };

        CannonPhysics.prototype.setTrimeshPhysicsTransform = function(pos, rot) {

        };

        CannonPhysics.prototype.stepSimulation = function() {

        };

        CannonPhysics.prototype.initPhysics = function(gooWorld) {
            this.world = gooWorld;
            var physicsSystem = new PhysicsSystem();
            this.world.setSystem(physicsSystem);
            this.world.setSystem(new ColliderSystem());
        };

        CannonPhysics.prototype.createPhysicsComponentScript = function() {

        };

        CannonPhysics.prototype.createAmmoMovableShapeScript = function(gameEntity, gooEntity) {

        };


        CannonPhysics.prototype.addPhysicalMeshChild = function(meshData, gooEntity, gameEntity) {

        };

        CannonPhysics.prototype.createPhysicsShapeComponent = function(gameEntity, gooEntity) {
            this.addPhysicalMeshChild(gooEntity.transformComponent.children[0].entity.meshDataComponent.meshData, gooEntity, gameEntity);
        };

        CannonPhysics.prototype.createPhysicsSphere = function(radius, pos) {

        };

        CannonPhysics.prototype.physicsRayRange = function(pos, dir) {

        }


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