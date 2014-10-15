"use strict";

define([
    "application/EventManager",
    'goo/renderer/Texture',
    'game/parts/CanvasLight',
    'game/parts/LightSystem'
],     function(event,
                Texture,
                CanvasLight,
                LightSystem
    ) {


	var canvasCache = {};

    function registerEntityLights(gamePiece, lightData) {
        var lights = {};
        gamePiece.lights = lights;
        gamePiece.lightSystems = {};
        gamePiece.lightsMaterialMap = printLightMaterialMap(gamePiece, lightData);
//        console.log("Register gamePiece lights: ", gamePiece, lightData);

        for (var keys in lightData.systems) {
            gamePiece.lightSystems[keys] = new LightSystem(gamePiece, keys, lightData.patterns, gamePiece.lightsMaterialMap);
            for (var index in lightData.systems[keys]) {
 //               console.log("Create light; ", keys, index)
                gamePiece.lights[index] = new CanvasLight(lightData.systems[keys][index].meshData, lightData.systems[keys][index].txcoords, gamePiece.lightsMaterialMap, gamePiece.lightSystems[keys])
                gamePiece.lightSystems[keys].addLight(index, gamePiece.lights[index]);
            }
        }
    }



    function printLightMaterialMap(gamePiece, lightData) {
        var childTransforms = gamePiece.geometries[0].transformComponent.children;
        var lightsMaterialMap = {};

        for (var i = 0; i < childTransforms.length; i++) {
            var meshEntity = childTransforms[i].entity;
            for (var j = 0; j < lightData.meshData.length; j++) {
                if (meshEntity.name == lightData.meshData[j].meshEntityName) {
                    console.log("Emissive material: ", meshEntity.name)
                    var materials = meshEntity.meshRendererComponent.materials;
					meshEntity.meshRendererComponent.isReflectable = false;
                    for (var k = 0; k < materials.length; k++) {
                        if (materials[k]._textureMaps.EMISSIVE_MAP) {
                            if (materials[k]._textureMaps.EMISSIVE_MAP.image) {
                                console.log(materials[k].name);
                                var originalImage = materials[k]._textureMaps.EMISSIVE_MAP.image;
								var id =  meshEntity.name+'_canvas';
								var canvas;
								if (canvasCache[id]) {
									return canvasCache[id];
								}

								var canvas = document.createElement("canvas");
								canvas.id = id;
								canvas.width = originalImage.naturalWidth;
								canvas.height = originalImage.naturalHeight;
								canvas.dataReady = true;
								canvasCache[id] = canvas;


                                var t = new Texture(canvas, null, canvas.width, canvas.height);
                                materials[k].setTexture('EMISSIVE_MAP', t);

                                lightsMaterialMap = {
                                    meshRendComp:meshEntity.meshRendererComponent,
                                    meshEntity:meshEntity,
                                    material:materials[k],
                                    emissiveMap:t,
                                    diffuseMap:materials[k]._textureMaps.DIFFUSE_MAP,
                                    emitImg:originalImage,
                                    canvas:canvas,
                                    ctx:canvas.getContext('2d')
                                };
                            /*
                                document.getElementById('viewporter').appendChild(canvas);
                                canvas.style.width = '256';
                                canvas.style.height = '256';
                                canvas.style.zIndex = 20000;
                           */
                            //    console.log(lightsMaterialMap);
								canvasCache[id] = lightsMaterialMap;
                                return lightsMaterialMap;
                            }
                        }
                    }
                }
            }
        }

    }


    function setEntityLightIntensity(entity, light, intensity) {
        entity.lights[light].setIntensity(intensity);
    }

    function updateEntityLightState(entity, time) {

        for (var index in entity.lightSystems) {
            entity.lightSystems[index].updateLightSystem(time);
        }

		for (var index in entity.lightSystems) {
			entity.lightSystems[index].printAddImages();
		}
    }

	function attenuateWithDarkRects(entity) {
		for (var index in entity.lightSystems) {
			entity.lightSystems[index].printFillDarkRects();
		}
	}


    return {
        setEntityLightIntensity:setEntityLightIntensity,
        registerEntityLights:registerEntityLights,
        updateEntityLightState:updateEntityLightState,
		attenuateWithDarkRects:attenuateWithDarkRects
    }


});