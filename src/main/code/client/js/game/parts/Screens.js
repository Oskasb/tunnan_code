"use strict";

define([
    "application/EventManager",
    'goo/renderer/Texture',
    'game/parts/Display',
    'game/parts/ScreenSystem',
    'game/instruments/InstrumentScripts'
],     function(event,
                Texture,
                Display,
                ScreenSystem,
                InstrumentScripts
    ) {

    var screenCount = 0;
    var materialMaps = {};
    var builtDisplays = {};
    var screenMaterialSystems = {};


    var getDisplay = function(id) {
        return builtDisplays[id];
    };

    function registerEntityScreens(entity, screenData, ControlStateCallbacks) {
        var screens = {};
        entity.screens = screens;
    /*
        var materialMap = printScreenMaterialMap(entity, screenData);
        if (!materialMaps[materialMap.material.name]) {
            materialMaps[materialMap.material.name] = materialMap;
        }
        entity.screenMaterialMap = materialMaps[materialMap.material.name];
    */
        entity.screenMaterialMap = printScreenMaterialMap(entity, screenData);

            entity.screenSystem = new ScreenSystem(entity);

    //    entity.screenSystem = screenMaterialSystems[entity.screenMaterialMap.material.name];

        console.log("Register entity screens: ", entity, screenData);

        for (var keys in screenData.displays) {
            screenCount += 1;
            if (!entity.screenSystem.displays[keys]) {
                var display = new Display(keys, screenData.displays[keys].mapcoords, entity.screenMaterialMap)
                builtDisplays[keys] = display;
                for (var each in screenData.displays[keys].instruments) {
                    var instrument = screenData.displays[keys].instruments[each];
                    if (instrument.script) display.registerInstrument(each, InstrumentScripts[instrument.script](entity, display, instrument));
                }
                entity.screenSystem.addDisplay(display);
            }
        }
    //    entity.screenSystem.setMasterIntensity(0.6);
    }


    function printScreenMaterialMap(entity, screenData) {
        var childTransforms = entity.geometries[0].transformComponent.children;

        for (var i = 0; i < childTransforms.length; i++) {
            var meshEntity = childTransforms[i].entity;
            for (var j = 0; j < screenData.meshData.length; j++) {
                if (meshEntity.name == screenData.meshData[j].meshEntityName) {
                    var materials = meshEntity.meshRendererComponent.materials;
					meshEntity.meshRendererComponent.isReflectable = false;
                    for (var k = 0; k < materials.length; k++) {
                        if (materials[k]._textureMaps.EMISSIVE_MAP) {
                            if (materials[k]._textureMaps.EMISSIVE_MAP.image) {
                                console.log(materials[k].name);
                                var originalImage;

                                var canvas;
                                var t;
                                if (entity.lights) {
                                    if (entity.lightsMaterialMap.meshEntity.name == meshEntity.name) {
                                        canvas = entity.lightsMaterialMap.canvas;
                                        originalImage = entity.lightsMaterialMap.emitImg;
                                        t = entity.lightsMaterialMap.emissiveMap;
                                    }
                                }

                                if (!canvas) {
                                    originalImage = materials[k]._textureMaps.EMISSIVE_MAP.image;
                                    canvas = document.createElement("canvas");
                                    canvas.id = meshEntity.name+'_canvas';
                                    canvas.width = originalImage.naturalWidth;
                                    canvas.height = originalImage.naturalHeight;
                                    canvas.dataReady = true;
                                    t = new Texture(canvas, null, canvas.width, canvas.height);
                                    materials[k].setTexture('EMISSIVE_MAP', t);

                             /*
                                    document.getElementById('viewporter').appendChild(canvas);
                                    canvas.style.width = '256';
                                    canvas.style.height = '256';
                                    canvas.style.zIndex = 20000;
                             */
                                }

                                var screenMaterialMap = {
                                    meshRef:meshEntity.name,
                                    meshEntity:meshEntity,
                                    material:materials[k],
                                    emissiveMap:t,
                                    diffuseMap:materials[k]._textureMaps.DIFFUSE_MAP,
                                    emitImg:originalImage,
                                    canvas:canvas,
                                    ctx:canvas.getContext('2d')
                                };

                                return screenMaterialMap;
                            }
                        }
                    }
                }
            }
        }
    }

    function updateEntityScreenState(entity) {
        if (!entity.instruments) return;
        entity.screenSystem.updateDisplays();
		entity.screenSystem.attenuateIntensity();
    }

    return {
        registerEntityScreens:registerEntityScreens,
        getDisplay:getDisplay,
        updateEntityScreenState:updateEntityScreenState
    }
});