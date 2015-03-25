"use strict"
// 'lib/goo-0.3.1/goo'



define([
	'goo/shapes/Sphere',
	'goo/shapes/Box',



	'application/EventManager',

	'goo/renderer/Material',
	'goo/entities/components/MeshDataComponent',
	'goo/entities/components/MeshRendererComponent',
	'goo/renderer/shaders/ShaderLib',
    'game/movement/MobileUnits'
], function(
		Sphere,
		Box,
    event,
	Material,
	MeshDataComponent,
	MeshRendererComponent,
	ShaderLib,
    MobileUnits
    ) {

    var pieceCache = {};
    var entityCache = {};
    var meshCache = {};
    var skeletonCache = {};
    var animationCache = {};
    var animcompCache = {};
    var materialCache = {};
    var textureCache = {};
    var shaderDataCache = {};
    var definedShaders = {};

//    var loader = new Loader({rootPath: '../client/resources/'});
    var world;
    var goo;
    var meshLoader;
    var materialLoader;

	var clearCaches = function() {
		entityCache = {};
		meshCache = {};
		skeletonCache = {};
		animationCache = {};
	}

    var setGoo = function(goo0) {
        goo = goo0;
        world = goo.world;
        var loaderSettings = {
            world: world,
    //       loader: loader
        };
        MobileUnits.setWorld(goo);
 //       meshLoader = new MeshLoader(loaderSettings);
 //       materialLoader = new MaterialLoader(loaderSettings);
    };

    var applyMaterial = function(entity, material) {
        entity.meshRendererComponent.materials.push(material);
    };

    var applyTexture = function(entity, texture) {
        entity.meshRendererComponent.materials.push(material);
    };

    var handleError = function(error, type) {
        event.fireEvent(event.list().ANALYTICS_EVENT, {category:"3D INIT ERROR", action:type, labels:error, value:1})
        alert("Some sort of loading error!: "+type)
    };

    var addEntityMesh = function(entity, mesh) {
        var meshDataComponent = new MeshDataComponent(mesh);
        entity.setComponent(meshDataComponent);

        // Create meshrenderer component with material and shader
        var meshRendererComponent = new MeshRendererComponent();
        entity.setComponent(meshRendererComponent);
        return entity;
    };



    var handleLoadedMesh = function(e) {
        var meshData = JSON.parse(event.eventArgs(e).mesh)
        console.log(meshData)

        meshCache[event.eventArgs(e).url] = meshLoader._parseMeshData(meshData, 0);
        return
        var promise = meshLoader._parseMeshData(meshData, 0);

        var resolveData = function(meshdata) {
            meshCache[event.eventArgs(e).url] = meshdata;
        };

        promise.then(function(value) {
            resolveData(value)
        }, function(value) {
            console.log(value)
            alert("load Error: "+event.eventArgs(e).url)
        });
    };

    var handleLoadedSkeleton = function(e) {
        var skeletonData = JSON.parse(event.eventArgs(e).skeleton);

        var jointData = skeletonData.joints;
        var skellieName = event.eventArgs(e).url;
        var joints = [];
        console.log(jointData);
        for (var i = 0; i < jointData.length; i++) {
            var joint = new Joint(jointData[i].name);
            var source = {data:jointData[i].inverseBindPose.matrix}
            joint._inverseBindPose.matrix.copy(source);
            joint._index = jointData[i].index;
            joint._parentIndex = jointData[i].parentIndex;
            joints.push(joint);

        };

        var skellie = new Skeleton(skellieName, joints)

        skeletonCache[skellieName] = skellie;
        console.log(skeletonCache);
    };

    var handleLoadedAnimation = function(e) {
        var animData = JSON.parse(event.eventArgs(e).animation);

        animationCache[event.eventArgs(e).url] = animData;
        console.log(animationCache);
    };

    var handleLoadedTexture = function(e) {
        var image = event.eventArgs(e).texture;

        var texture = new Texture(image);
        textureCache[event.eventArgs(e).url] = texture;
    };

    var handleLoadedMaterial = function(e) {
        var materialData = JSON.parse(event.eventArgs(e).material);
        materialCache[event.eventArgs(e).url] = {
            data:materialData
        };

    };

    var registerShaderData = function(shaderId, dataType, data) {
        if (!shaderDataCache[shaderId]) shaderDataCache[shaderId] = {};
        var parsed = data;
        if (dataType == "shader") parsed = JSON.parse(data);
        shaderDataCache[shaderId][dataType] = parsed;
    };

    var defineShader = function(shaderId) {
        if (!shaderDataCache[shaderId]["shader"]) handleError("shader data incomplete ",shaderId)
        if (!shaderDataCache[shaderId]["vert"]) handleError("shader vert incomplete ",shaderId)
        if (!shaderDataCache[shaderId]["frag"]) handleError("shader frag incomplete ",shaderId)

        var data = shaderDataCache[shaderId]["shader"]
        var shaderDefinition = {
            attributes: data.attributes,
            uniforms: data.uniforms,
            vshader:shaderDataCache[shaderId]["vert"],
            fshader:shaderDataCache[shaderId]["frag"]
        };

        if (data.defines) {
            shaderDefinition.defines = data.defines;
        };
        if (data.processors) {
            shaderDefinition.processors = [];
            for (var i = 0; i < data.processors.length; i++) {
                shaderDefinition.processors.push(ShaderBuilder[data.processors[i]].processor);
            }
        };

        definedShaders[shaderId] = shaderDefinition;
        definedShaders[shaderId].program = new Shader(shaderId, shaderDefinition);
        definedShaders[shaderId].program = new Shader("uber", ShaderLib.uber);
        return shaderDefinition;
    };

    var buildModelMaterial = function(cache, textures, shaderId) {
        var materialData = cache.data;
        var materialUniforms = {};
        if (materialData.uniforms) {
            for (var key in materialData.uniforms) {
                materialUniforms[key] = materialData.uniforms[key];
            }
        }

        var shaderDef = definedShaders[shaderId];
        if (!shaderDef) shaderDef = defineShader(shaderId);


        var material = new Material(materialData.name);
        material.shader = definedShaders[shaderId].program;


        material.uniforms = materialData.uniforms;
        material.blendState.blending = 'CustomBlending';

        material.materialState = {
            ambient: materialData.uniforms.materialAmbient,
            diffuse: materialData.uniforms.materialDiffuse,
            emissive: materialData.uniforms.materialEmissive,
            specular: materialData.uniforms.materialSpecular,
            shininess: materialData.uniforms.materialSpecularPower,
            transparency: materialData.uniforms.opacity
        };

        material.renderQueue =2200;
        for (var index in textures) {
            if (index == "TRANSPARENCY_MAP") {
            //   material.blendState.blendEquation = 'AddEquation';
            //   material.blendState.blendSrc = 'SrcAlphaFactor';
            //   material.blendState.blendDst = 'OneMinusSrcAlphaFactor';
                material.renderQueue = 2100;
                material.depthState.write = false;
                material.depthState.read = true;
            }

            if (!textureCache[textures[index]])handleError("textureId not loaded: ",textures[index]);
            material.setTexture(index, textureCache[textures[index]]);
        }
        cache.material = material;
        return material
    };

    var buildEntityModel = function(entity, meshId, materialId, textures, shaderId) {
        if (!meshCache[meshId]) handleError("Mesh not loaded: ",meshId);
        if (!materialCache[materialId]) handleError("Material not loaded: ",materialId);
        if (!shaderDataCache[shaderId]) handleError("shaderId not loaded: ",shaderId);
        var ent = addEntityMesh(entity, meshCache[meshId]);

        var material = materialCache[materialId].material;
        if (!material)material = buildModelMaterial(materialCache[materialId], textures, shaderId)

        applyMaterial(ent, material)

        return ent;
    };


    var buildEntityHierarchy = function(name, modelData) {
        if (entityCache[name]) {
            var topentity = EntityUtils.clone(goo.world, entityCache[name])

        } else {
            var topentity = world.createEntity(name);
            entityCache[name] = topentity;
        }
        topentity.addToWorld();
        topentity.models = {};
        for (var material in modelData) {
            var meshId = modelData[material].mesh
            if (entityCache[meshId]) {
                var entity = EntityUtils.clone(goo.world, entityCache[meshId])

            } else {
                var data = modelData[material];
                var entity = world.createEntity("mesh_"+material);
                entityCache[meshId] = entity;

                buildEntityModel(entity, data.mesh, data.material, data.textures, data.shaderId)
            }

            if (modelData[material].skeleton) {

                var skellie = skeletonCache[modelData[material].skeleton];

            //    if (!animcompCache[skellieName]) {


                    var pose = new SkeletonPose(skellie)
                    var animComponent = new AnimationComponent(pose);
            //        animcompCache[skellieName] = animComponent;
            /*
                } else {

                    var animComponent = animcompCache[skellieName];

                }
             */
                console.log(skellie)

                console.log("Attach Skeleton to EntityHierarchy", name, pose);





        //        animComponent.addLayer(animationCache[modelData[material].animation])

         //       entity.setComponent(animComponent)
            //    entity.meshDataComponent.currentPose = animComponent._skeletonPose;

                console.log("Animation Component:", animComponent, entity);

            }

            topentity.transformComponent.attachChild(entity.transformComponent);
            entity.addToWorld();
            topentity.models[meshId] = entity;
        }

        return topentity;
    };

    var handleBuildPrimitive = function(e) {
        var parentGooEntity = event.eventArgs(e).parentGooEntity;
        var pos = event.eventArgs(e).pos.clone();
        var rot = event.eventArgs(e).rot.toAngles();
        var size = event.eventArgs(e).size.clone();
        var shape = event.eventArgs(e).shape;
        var color = event.eventArgs(e).color;

        var primitive = world.createEntity("primitive");

        switch (shape) {
            case "Box":
                var meshData = new Box(size.data[0], size.data[1], size.data[2]);
            break;
            case "Sphere":
                var meshData = new Sphere(8, 8, size.data[0]);
            break;
            case "Cylinder":
                var meshData = new Box(size.data[0], size.data[1], size.data[2]);
            break;
        }

        var material = new Material(ShaderLib.simpleColored, 'PrimitiveMaterial');

        if (color != undefined) material.uniforms.color = color;

        addEntityMesh(primitive, meshData)
        applyMaterial(primitive, material)
        parentGooEntity.transformComponent.attachChild(primitive.transformComponent)
        primitive.meshRendererComponent.isReflectable = false;
        primitive.addToWorld();
        primitive.transformComponent.transform.translation.setArray(pos.data);
        primitive.transformComponent.transform.setRotationXYZ(rot.data[0], rot.data[1], rot.data[2]) // = rot // .toAngles());
        event.eventArgs(e).callback(primitive);
    };

    var createWorldEntity = function(id) {
        var entity = world.createEntity(id);
        goo.world.world_root.transformComponent.attachChild(entity.transformComponent)
        return entity;
    };


    var randomAnimate = function(animComponent) {
    //    console.log("Random Animate ", animComponent)
        var localTransforms = animComponent._skeletonPose._localTransforms;
        localTransforms[3].setRotationXYZ( 0, 0, 0);
        localTransforms[3].update();

        animComponent._skeletonPose.updateTransforms();
    //    console.log(localTransforms[0].rotation.data)
    //    joints[0].inverseBindPose.matrix[1] = Math.random();
    //    joints[0].inverseBindPose.matrix[2] = Math.random();
    //    joints[0].inverseBindPose.matrix[3] = Math.random();

    }



    var handleLoadedShader = function(e) {
        registerShaderData(event.eventArgs(e).shaderId, event.eventArgs(e).type, event.eventArgs(e).data)
    };

	var handleActivateEntity = function(e) {
		var piece_root = event.eventArgs(e).gooEntity;
        var gameEntity = event.eventArgs(e).gameEntity;
        piece_root.gameSpatial = gameEntity.spatial;
        if (!gameEntity.spatial) alert("ActiveEntity Needs gameSpatial to work  o.O");
        piece_root.addToWorld();
	};




	event.registerListener(event.list().ACTIVATE_GOO_ENTITY, handleActivateEntity);
	event.registerListener(event.list().BUILD_GOO_PRIMITIVE, handleBuildPrimitive);
	event.registerListener(event.list().UN_LOAD_3D, clearCaches);

/*
    event.registerListener(event.list().REGISTER_GOO_MESH, handleLoadedMesh);
    event.registerListener(event.list().REGISTER_GOO_SKELETON, handleLoadedSkeleton);
    event.registerListener(event.list().REGISTER_GOO_ANIMATION, handleLoadedAnimation);
    event.registerListener(event.list().REGISTER_GOO_MATERIAL, handleLoadedMaterial);
    event.registerListener(event.list().REGISTER_GOO_TEXTURE, handleLoadedTexture);
    event.registerListener(event.list().REGISTER_GOO_SHADER, handleLoadedShader);


    event.registerListener(event.list().BUILD_GOO_PARTICLES, handleBuildParticles);
 */
    return {
        setGoo:setGoo
    }

});