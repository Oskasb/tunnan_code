"use strict";



define(['application/EventManager',
	'3d/effects/EffectPlayer',
    'goo/entities/EntityUtils',
    'goo/renderer/light/DirectionalLight',
    'goo/math/Vector3',
    'goo/entities/components/ScriptComponent',
    'goo/entities/components/LightComponent',
    'goo/renderer/shaders/ShaderBuilder'

], function(
    event,
	EffectPlayer,
    EntityUtils,
    DirectionalLight,
    Vector3,
    ScriptComponent,
    LightComponent,
    ShaderBuilder
    ) {

    var goo;
    var tempVec = new Vector3();
    var shadowReso = 128;
    var shadowNear = 3.2;
    var shadowSize = 25;
    var shadowFar = 27;
    var shadowType = "basic";
    var lightOffset = new Vector3(3.5, 8, -2.1);

    var baseFogNear = 2000;
    var basefogFar = 20000;

	var effectPlayer;

    var lightEntity;
    var dirLight;
    var lightComp;

    ShaderBuilder.USE_FOG = true;
    function setGoo(g00) {
        goo = g00;
		effectPlayer = new EffectPlayer(goo);
        console.log("SET GOO: ", goo)

    }

	function initFxPlayer() {
		effectPlayer.initEffectPlayer();
	}

    function setSunlightColor(color) {
        dirLight.color.setd(color[0]*(1+Math.random()*0.03), color[1]*(1+Math.random()*0.02), color[2]*(1+Math.random()*0.05), 1.0);
    }

    function setAmbientColor(color) {
        ShaderBuilder.GLOBAL_AMBIENT = color;
    }

    function setFogColor(color) {
        ShaderBuilder.FOG_COLOR = color;
    }

    function scaleFogNearFar(near, far) {
        setFogNearFar(baseFogNear*near, basefogFar*far);
    }

    function setFogNearFar(near, far) {
        ShaderBuilder.FOG_SETTINGS = [near, far];
        ShaderBuilder.USE_FOG = true;
    }

    function setSunlightDirection(dir) {
        tempVec.set(-dir[2], -dir[1], -dir[0]);
    //    lightEntity.transformComponent.transform.translation.set(dir);
        lightEntity.transformComponent.transform.rotation.lookAt(tempVec, Vector3.UNIT_Y);
        lightEntity.transformComponent.setUpdated();
    }

    var setupMainLight = function() {


        lightEntity = goo.world.createEntity('Light1');
        dirLight = new DirectionalLight();
        dirLight.color.setd(1, 0.95, 0.85, 1.0);
        dirLight.specularIntensity = 1.8;
        dirLight.intensity = 1;

        lightComp = new LightComponent(dirLight);
        lightComp.light.shadowCaster = false;
        lightComp.light.shadowSettings.darkness = 0.9;
        lightComp.light.shadowSettings.near = shadowNear;
        lightComp.light.shadowSettings.far = shadowFar;
        lightComp.light.shadowSettings.size = shadowSize;
        lightComp.light.shadowSettings.shadowType = shadowType;
        lightComp.light.shadowSettings.resolution = [shadowReso,shadowReso];
        console.log("lightComp ---- ",lightComp);
        lightEntity.setComponent(lightComp);

        lightEntity.transformComponent.transform.translation.setd(0, 0, 0);
        lightEntity.transformComponent.transform.lookAt(new Vector3(-0.5,-0.4, 0.43), Vector3.UNIT_Y);
        lightEntity.addToWorld();


        return lightEntity;
    };

    function handlePlayerMoved(e) {
        tempVec.set(event.eventArgs(e).pos);
        tempVec.add(lightOffset);
        lightEntity.transformComponent.transform.translation.set(tempVec);
        lightEntity.lightComponent.light.translation.set(tempVec);
        tempVec.set(event.eventArgs(e).pos);
        lightEntity.transformComponent.transform.lookAt(tempVec, Vector3.UNIT_Y);
        lightEntity.transformComponent.setUpdated();
    }

    function setEffectParamToValue(effect, param, value) {
        getEffects()[effect].fx[param] = value;
        event.fireEvent(event.list().ANALYTICS_EVENT, {category:"CONFIG_EFFECT", action:effect, labels:JSON.stringify(value), value:0});
    }

    function setSettingParamToValue(effect, param, value) {
        getSettings()[effect].fx[param] = value;
        event.fireEvent(event.list().ANALYTICS_EVENT, {category:"CONFIG_OPTION", action:effect, labels:JSON.stringify(value), value:0});
    }

    function handleEffectParam(e) {
        setEffectParamToValue(event.eventArgs(e).effect, event.eventArgs(e).parameter, event.eventArgs(e).value);
    }

    function getComposers() {
		console.log(goo.renderSystem.composers)
        return goo.renderSystem.composers[0].passes
    }

    function getEffects() {
        return {
        //    'Shadow Pass':{fx:getShadowPass(), param:"enabled"},
         //   Shadows:{fx:lightComp.light, param:"shadowCaster"},
        //    Sepia:{fx:getComposers()[1], param:"enabled"},
        //      Bloom:{fx:getComposers()[1], param:"enabled"}
        //    Grain:{fx:getComposers()[3], param:"enabled"},
        //    Contrast:{fx:getComposers()[4], param:"enabled"},
        //    'RGB Shift':{fx:getComposers()[5], param:"enabled"},
        //    Vignette:{fx:getComposers()[6], param:"enabled"},
        //    Bleach:{fx:getComposers()[7], param:"enabled"}
        }
    }

    var handleReady = function() {

    //      getEffects()["Bloom"].fx["enabled"] = true;
    //    if (settings.water.fancy) getEffects()["Shadows"].fx["shadowCaster"] = true;
    };

    var settings = {
        particles: {highDensity:1},
        bullets  : {visible:0},
        water    : {fancy:1},
        nature   : {manyTrees:0}
    };


    function getSettings() {
        return {
         //   'Dense Particles':  {fx:settings.particles, param:"highDensity"},
         //   'Visible Bullets':  {fx:settings.bullets,   param:"visible"},
            'Fancy Water':      {fx:settings.water,     param:"fancy"},
            'Lots of Trees':    {fx:settings.nature,    param:"manyTrees"}
        }
    }

    function getSettingParam(setting, param) {
        return settings[setting][param];
    }

    event.registerListener(event.list().SET_EFFECT_PARAMETER, handleEffectParam);
//    event.registerListener(event.list().MOVE_AUDIO_LISTENER, handlePlayerMoved);
    event.registerListener(event.list().SCENARIO_LOADED, handleReady);

    return {
        setGoo:setGoo,
		initFxPlayer:initFxPlayer,
        getEffects:getEffects,
        getSettingParam:getSettingParam,
        getSettings:getSettings,
        setSettingParamToValue:setSettingParamToValue,
        setEffectParamToValue:setEffectParamToValue,
        setSunlightColor:setSunlightColor,
        setSunlightDirection:setSunlightDirection,
        setAmbientColor:setAmbientColor,
        setFogColor:setFogColor,
        scaleFogNearFar:scaleFogNearFar,
        setupMainLight:setupMainLight
    }

});