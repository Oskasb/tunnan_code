define([
    'goo/entities/EntityUtils',
    'goo/shapes/Sphere',
    'goo/renderer/Material',
    'goo/renderer/shaders/ShaderLib',
    'game/movement/sphereSpatial',
    'physics/PhysicalWorld'

], function (
    EntityUtils,
	Sphere,
    Material,
    ShaderLib,
    SphereSpatial,
    PhysicalWorld
    ) {
    'use strict';

    var world;

    function setWorld(gooWorld) {
        world = gooWorld;
        PhysicalWorld.initPhysics();
    }

    function deleteMobileUnit(gameEntity) {
        console.log("DELETE MOBILE UNIT: ", gameEntity)
        PhysicalWorld.removeAmmoComponent(gameEntity.moveSphere.ammoComponent);
    }

    function sphericalMobile(radius, pos, visualise) {

        if (visualise) {
            var sphereMesh = new Sphere(16, 16, radius);
            var material = new Material(ShaderLib.simpleLit);
            var sphereEntity = world.createEntity(sphereMesh, material);
        } else {
            var sphereEntity = world.createEntity();
        }

        sphereEntity.ammoComponent = PhysicalWorld.createAmmoJSSphere(radius, pos);
        sphereEntity.setComponent(PhysicalWorld.createAmmoComponentScript());
        sphereEntity.addToWorld();
        return sphereEntity;
    }

    function addEntityToMobile(sphereEntity, world, entity) {
    //    entity.spatial.pos = sphereEntity.getComponent("transformComponent").transform.translation
        entity.moveSphere = sphereEntity;
        var visualMobile = entity.geometries[0];

        var moveParent = world.createEntity();
        moveParent.sphereEntity = sphereEntity;
    //    moveParent.transformComponent.transform.translation.sub(0, entity.pieceData.dimensions.mobRadius, 0);
    //    entity.geometries[0] = moveParent;

        PhysicalWorld.attachSphericalMovementScript(moveParent, entity);
        moveParent.transformComponent.attachChild(visualMobile.transformComponent);

        moveParent.transformComponent.transform.translation.set(0, -entity.pieceData.dimensions.mobRadius, 0);
        moveParent.transformComponent.setUpdated();
        moveParent.addToWorld();
    }

    function attachEntityToMobileSphere(entity, mobileSphere) {
        addEntityToMobile(mobileSphere, world, entity);
        var spatialControl = new SphereSpatial(mobileSphere);
        mobileSphere.spatialControl = spatialControl;
    //    spatialControl.walk();
    }



    return {
        deleteMobileUnit:deleteMobileUnit,
        setWorld:setWorld,
        sphericalMobile:sphericalMobile,
        attachEntityToMobileSphere:attachEntityToMobileSphere
    }

});
