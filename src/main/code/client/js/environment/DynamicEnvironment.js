"use strict";

define([
	'environment/editor/EnvEditorAPI',
    'goo/math/Vector3',
	'environment/Lighting',
	'environment/Water',
	'environment/EnvironmentData'
], function(
	EnvEditorAPI,
    Vector3,
    Lighting,
    Water,
    EnvironmentData
    ) {

    var stepDuration;
    var stepProgress;
    var cycleIndex;
    var envState = {
        sunLight     : new Vector3(),
        sunDir       : new Vector3(),
        ambientLight : new Vector3(),
        skyColor     : new Vector3(),
        fogColor     : new Vector3(),
        fogDistance  : new Vector3()
    };

    var tempVec = new Vector3();

    var environments = EnvironmentData.cycles;
	var globals = EnvironmentData.globals;

    var DynamicEnvironment = function() {

	    this.environments = environments;
	    this.globals = globals;
	    this.waterSettings = EnvironmentData.waterSettings;



	    Lighting.setBaseFogNearFar(this.globals.baseFogNear, this.globals.baseFogFar);

        cycleIndex = this.globals.startCycleIndex;
	    this.setDayStepDuration(this.globals.baseCycleDuration);

        stepProgress = 0;

	    this.paused = false;

	    var enablePauseEnv = function(env) {
		    document.getElementById("time_pause").addEventListener('click', function() {
			    env.togglePauseTime();
		    }, false);
	    };

	//    enablePauseEnv(this);


	    var includeEnvEditor = function(env) {
		    var envEditorAPI = new EnvEditorAPI(env);
		    var enableEditButton = function(editorAPI) {
			    document.getElementById("EditEnvironment").addEventListener('click', function() {
				    editorAPI.openEnvEditor();
			    }, false);
		    };

		    enableEditButton(envEditorAPI);
	    };

	//    includeEnvEditor(this);
    };

	DynamicEnvironment.prototype.addWater = function(goo, skySphere, resourcePath) {
		this.water = new Water(goo, skySphere, resourcePath);
	};

	DynamicEnvironment.prototype.setFogGlobals = function(near, far) {
		this.globals.baseFogNear = near;
		this.globals.baseFogFar  = far;
		Lighting.setBaseFogNearFar(this.globals.baseFogNear, this.globals.baseFogFar);
		this.water.setBaseFogNearFat(this.globals.baseFogNear*4, this.globals.baseFogFar*48);
	};

	DynamicEnvironment.prototype.setDayStepDuration = function(duration) {
		stepDuration = duration / this.environments.length;
	};


	DynamicEnvironment.prototype.togglePauseTime = function() {
		this.paused = !this.paused;
		console.log("Pause env time: ", this.paused)
	};

    DynamicEnvironment.prototype.getEnvironmentState = function() {
        return {fogColor:envState.fogColor.data, sunLight:envState.sunLight.data, ambientLight:envState.ambientLight.data, sunDir:envState.sunDir.data, skyColor:envState.skyColor.data, fogDistance:envState.fogDistance.data};
    };

    DynamicEnvironment.prototype.stepCycle = function() {
        cycleIndex += 1;
        stepProgress = 0;
        if (cycleIndex == this.environments.length) cycleIndex = 0;
    };

	DynamicEnvironment.prototype.applyEnvStateToColors = function() {
		var frameState = this.getEnvironmentState();
		Lighting.setAmbientColor([envState.ambientLight.data[0], envState.ambientLight.data[1], envState.ambientLight.data[2]]);
		Lighting.scaleFogNearFar(envState.fogDistance[0], envState.fogDistance[1]);
		Lighting.setFogColor([frameState.fogColor[0],frameState.fogColor[1],frameState.fogColor[2]]);
		Lighting.setSunlightDirection(envState.sunDir.data);
		Lighting.setSunlightColor(envState.sunLight.data);
        this.water.updateWaterEnvironment(frameState.sunLight, frameState.sunDir, frameState.fogColor, frameState.fogDistance)

	};

    DynamicEnvironment.prototype.advanceTime = function(time) {
	    if (this.paused) return;
        stepProgress += time;
	//    document.getElementById("time_hint").innerHTML = "Cycle: "+this.environments[cycleIndex].name+" ("+cycleIndex+"/"+(this.environments.length-1)+") Progress:"+Math.round(stepProgress);
        var stepFraction = time / stepDuration;
        if (stepProgress >= stepDuration) this.stepCycle();

    //    var nextIndex = cycleIndex+1;
    //   if (nextIndex >= environments.length) nextIndex = 0;

        for (var index in this.environments[cycleIndex].values) {
             tempVec.set(this.environments[cycleIndex].values[index]);
             envState[index].lerp(tempVec, stepFraction);
        }

	    this.applyEnvStateToColors();
    };

    return DynamicEnvironment;

});