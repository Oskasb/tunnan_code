"use strict";

define(function() {



	var darker = 'darker';
	var sourceOver = 'source-over';
    var LightSystem = function(entity, systemId, patterns, materialMap) {
        this.id = systemId;
	    this.materialMap = materialMap;
        this.entity = entity;
        this.lights = {};
	    this.addImg = [];
	    this.fillDark = [];
		this.patterns = patterns;
		this.activePattern = 0;
		this.time = 0;
        this.masterIntensity = 1;
	    this.ctx = this.materialMap.ctx;
		this.ctx.globalCompositeOperation = sourceOver;
    };

    LightSystem.prototype.addLight = function(id, light) {
        this.lights[id] = light;
    };

    LightSystem.prototype.setMasterIntensity = function(intensity, color) {
        this.masterIntensity = intensity;
        for (var index in this.lights) {
            this.lights[index].adjustMasterIntensity(this.masterIntensity)
        }
        if (color) this.masterColor = color;
    };

    LightSystem.prototype.setSystemIntensity = function(intensity) {
        for (var index in this.lights) {
            this.lights[index].setIntensity(intensity)
        }
    };

    LightSystem.prototype.lightOn = function(light, intensity, time) {
		light.setIntensity(intensity);
    };

    LightSystem.prototype.lightOff = function(light) {

    };

	LightSystem.prototype.setLightPatterns = function(patternIndex) {
		this.activePattern = patternIndex
	};

    LightSystem.prototype.setMode = function(value) {
		if (value < -0.9) {
			this.setSystemIntensity(1);
			this.setLightPatterns(0);
			return;
		} else if (value < -0.4) {
			this.setSystemIntensity(1);
			this.setLightPatterns(1);
			return;
		} else if (value < 0.4) {
			this.setSystemIntensity(1);
			this.setLightPatterns(2);
			return;
		} else {
			this.setLightPatterns(0);
			this.setSystemIntensity(0);
		}
    };



	LightSystem.prototype.updateLightSystem = function(time) {
		if (this.activePattern == 0) return;

		var timeIndex = Math.floor(this.time*0.015) % this.patterns[this.activePattern].length;

		for (var index in this.lights) {
			if (timeIndex >= this.patterns[this.activePattern].length) timeIndex = 0;
			this.lights[index].approachIntensity(this.patterns[this.activePattern][timeIndex], 2);
			timeIndex += 1;
		}
		this.time+=time;

	};

	LightSystem.prototype.registerAddImageRect = function(data) {
		this.addImg.push(data);
	};


	LightSystem.prototype.registerFillRectDarker = function(data) {
		this.fillDark.push(data);
	};

	LightSystem.prototype.printAddImages = function() {
		this.ctx.globalCompositeOperation = 'source-over';
		for (var i = 0; i < this.addImg.length; i++) {
			this.ctx.drawImage(this.addImg[i][0],this.addImg[i][1],this.addImg[i][2],this.addImg[i][3],this.addImg[i][4],this.addImg[i][5],this.addImg[i][6],this.addImg[i][7],this.addImg[i][8]);
		}
		this.addImg = [];
	};

	LightSystem.prototype.printFillDarkRects = function() {
		this.ctx.globalCompositeOperation = darker;
		for (var i = 0; i < this.fillDark.length; i++) {
			this.ctx.fillStyle = this.fillDark[i][4];
			this.ctx.fillRect(this.fillDark[i][0],this.fillDark[i][1],this.fillDark[i][2],this.fillDark[i][3]);
		}
		this.fillDark = [];
	};

    return LightSystem;
});
