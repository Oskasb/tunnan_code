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



	var addDisplayScreen = function(entity, screenId, dispData) {
		var display = new Display(screenId, dispData.mapcoords, entity.screenMaterialMap)
		builtDisplays[dispData] = display;
		for (var i = 0; i < dispData.instruments.length; i++) {
			var instrument = dispData.instruments[i];
			if (instrument.script) display.registerInstrument(instrument.id, InstrumentScripts[instrument.script](entity, display, instrument));
		}
		entity.screenSystem.addDisplay(display);
	};


    function registerEntityScreens(entity, screenData, meshData) {
		if (!screenData.length) return;
        var screens = {};
        entity.screens = screens;

        entity.screenMaterialMap = printScreenMaterialMap(entity, meshData);

        entity.screenSystem = new ScreenSystem(entity);

        console.log("Register entity screens: ", entity, screenData);

        for (var i = 0; i < screenData.length; i++) {
            screenCount += 1;
			var dispData = screenData[i];
			var screenId = dispData.id;
            if (!entity.screenSystem.displays[screenId]) {
				addDisplayScreen(entity, screenId, dispData);
            }
        }
    }


    function printScreenMaterialMap(entity, meshData) {
        var childTransforms = entity.geometries[0].transformComponent.children;

        for (var i = 0; i < childTransforms.length; i++) {
            var meshEntity = childTransforms[i].entity;
            for (var j = 0; j < meshData.length; j++) {
                if (meshEntity.name == meshData[j].meshEntityName) {
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