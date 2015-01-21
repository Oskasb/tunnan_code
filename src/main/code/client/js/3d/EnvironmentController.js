"use strict";

define(["application/EventManager",
    '3d/WorldParticleSystems',
    '3d/HeightmapManager',

    'game/world/ZoneData',
    'game/GameConfiguration',

        'load/ClientLoader',
        'goo/renderer/Material',
        'goo/entities/components/ScriptComponent',
        'geometrypack/Surface',
    'goo/shapes/Sphere',
        'goo/entities/EntityUtils',
        'goo/renderer/shaders/ShaderLib',
        'goo/renderer/MeshData',
        'goo/renderer/Shader',
        'goo/renderer/TextureCreator',
	'goo/addons/waterpack/FlatWaterRenderer',
        'goo/math/Plane',
    'game/world/ZoneBuilder',
    '3d/GooEffectController',
    'goo/util/Skybox',
    'goo/renderer/shaders/ShaderBuilder',
    'goo/renderer/Texture',
	'data_pipeline/PipelineAPI',
	'environment/EnvironmentAPI'

    //   '3d/TxInjectedFlatWaterRenderer'
    //    'goo/addons/water/ProjectedGridWaterRenderer'
    ], function(
    event,
    worldParticleSystems,
    HeightmapManager,

    zoneData,
    gameConfig,

    ClientLoader,
    Material,
    ScriptComponent,

    Surface,
    Sphere,
    EntityUtils,
    ShaderLib,
    MeshData,
    Shader,
    TextureCreator,
    FlatWaterRenderer,
    Plane,
    ZoneBuilder,
    GooEffectController,
    Skybox,
    ShaderBuilder,
    Texture,
    PipelineAPI,
	EnvironmentAPI

    ) {


    var goo;
    var cameraEntity;
    var camPos;
    var skybox;
    var waterEntity;
    var dynamicSky;
    var dynamicEnv;
    var worldRootEntity;
    var scenario;

    var waterRenderer;
	var environmentAPI = new EnvironmentAPI();

    var setCameraEntity = function(camEnt) {
        cameraEntity = camEnt;
        camPos = cameraEntity.transformComponent.worldTransform.translation;
    };

	var dataLoadCompleted = function() {

	};

    function makeWaterMaterial(texturePath) {
		var material = new Material('water_material', ShaderLib.simple);
		return material;
    }

	var sky
    function addSpaceBox() {
	    console.log("Setup Space Box")
		environmentAPI.setupEnvironment(goo);



	    var applyEnv = function(srcKey, data) {
		    environmentAPI.applyEnvironmentData(data)
	    };

	    PipelineAPI.subscribeToCategoryKey('environments', 'ocean_env', applyEnv);

    }

    function addWorldRoot(callback) {

        worldRootEntity = goo.world.createEntity();
        worldRootEntity.addToWorld();

        callback(worldRootEntity);
    }




    var addTerrains = function(goo, callback, imgReady) {

        var zones = scenario.loadZones;

        var zCount = 0;
        var toLoad = 0;
        var readyUp = function() {
            zCount+=1;
            if (zCount == toLoad) {
                callback();
            }
        };

        for (var i = 0; i < zones.length; i++) {
            if (zones[i].heightData) {
                toLoad +=1;
                HeightmapManager.addHeightMap(goo, zones[i], zones[i].id, readyUp, imgReady);
            }
            if (!toLoad) imgReady();
        }
        toLoad +=1;

        setTimeout(function() {
            readyUp();
        }, 10);

    };

    var createClouds = function(zoneData) {
        event.fireEvent(event.list().SPAWN_CLOUDS, {pos:zoneData.pos, size:[zoneData.width, zoneData.height, zoneData.depth], intensity:zoneData.clouds.intensity})
    };

    var addskyAndWorldRoot = function() {
        event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'load_sky'});
        sky = addSpaceBox();
        var waterReady = function(worldRoot) {
            createEnv(worldRoot);
            event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0,id:'load_sky'});
        };

        var callback = function() {
            addWorldRoot(waterReady);
        };
        callback();
    };

    var initEnvironment = function(e) {
        goo = event.eventArgs(e).goo;
        addskyAndWorldRoot();
    //    addWater();
    };

    var updateEnvironment = function(e) {
		environmentAPI.updateCameraFrame(event.eventArgs(e).lastFrameDuration, cameraEntity);
    };

    var createEnv = function(rootEntity) {

        worldParticleSystems.addWorldParticles(rootEntity);

        event.registerListener(event.list().RENDER_TICK, updateEnvironment);
    };

    var envSounds={};
    var playEnvironmentSound = function() {
        var callback = function(sound) {
            envSounds[sound.playId] = sound;
        };
        event.fireEvent(event.list().START_SOUND_LOOP, {soundData:event.sound().SEATOWN_AMB, loopId:"env_amb", callback:callback});
        event.fireEvent(event.list().START_SOUND_LOOP, {soundData:event.sound().DARK_SUSPENS, loopId:"susp_amb", callback:callback});
    };

    var addClouds = function(callback) {

        for (var i = 0; i < scenario.loadZones.length; i++) {
            createClouds(scenario.loadZones[i])
        }

    };

    function loadScenarioEnvironment(goo, scen, callback, imgReady) {
        scenario = scen;
        addTerrains(goo, callback, imgReady);

    //    dynamicEnv = new DynamicEnvironment(1, 124000);

    }

    function loadEnvironment(callback) {

        var ready = function() {
            playEnvironmentSound();
            //    setTimeout(function() {
                //    addskyAndWater();
            //    }, 8000)


            callback();
        };

        ZoneBuilder.buildTerrainZone(goo, scenario.loadLevels, HeightmapManager.getTerrainData(), ready);

        addClouds(callback);
    }

    function repositionWater() {
    //    var pos = cameraEntity.transformComponent.worldTransform.translation.data;
        water.waterEntity.transformComponent.transform.translation.data[0] = camPos.data[0];
        water.waterEntity.transformComponent.transform.translation.data[2] = camPos.data[2];
        water.waterEntity.transformComponent.setUpdated();
    }


    event.registerListener(event.list().ENINGE_READY, initEnvironment);
  //  event.registerListener(event.list().SET_ENVIRONMENT, handleSetEnvironment);

    return {
		dataLoadCompleted:dataLoadCompleted,
        setCameraEntity:setCameraEntity,
        loadScenarioEnvironment:loadScenarioEnvironment,
        loadEnvironment:loadEnvironment
    }

});
