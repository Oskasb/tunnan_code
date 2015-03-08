"use strict";

define([
	"application/EventManager",
	"goo/entities/SystemBus"
],
	function(
		event,
		SystemBus
		) {

		var curves = {
			"zeroToOne":    [[0, 0], [1, 1]],
			"oneToZero":    [[0, 1], [1, 0]],
			"zeroToOneExp": [[0, 0], [0.25, 0.1], [0.5, 0.25], [0.75, 0.5], [1, 1]],
			"quickFadeOut": [[0, 1], [0.9,1], [1,   0]],
			"quickFadeIn":  [[0, 0], [0.2,1], [1,   1]],
			"centerStep":   [[0, 0], [0.45,0],[0.55,1], [1, 1]],
			"quickInOut":   [[0, 0], [0.1,1], [0.9, 1], [1, 0]],
			"posToNeg":     [[0, 1], [1,-1]],
			"negToPos":     [[0,-1], [1, 1]],
			"zeroOneZero":  [[0, 0], [0.5,1], [1,  0]],
			"oneZeroOne":   [[0, 1], [0.5,0], [1,  1]],
			"growShrink":   [[0, 1], [0.5,0], [1, -2]]
		};




		var Setting = function(name, defaultValue, min, max, curve) {
			this.name = name;
			this.value = defaultValue;
			this.curve = curve || curves["zeroToOne"];
			this.processedValue;

			if (typeof(this.value) != 'number') {
				this.value = 1;
			}

			this.min = min || 0;
			this.max = max || 1;
			this.changedCallbacks = [];
			this.processValue();
		};

		Setting.prototype.getInterpolatedInCurveAboveIndex = function(value, curve, index) {
			return curve[index][1] + (value - curve[index][0]) / (curve[index+1][0] - curve[index][0])*(curve[index+1][1]-curve[index][1]);
		};

		Setting.prototype.valueFromCurve = function(value, curve) {
			for (var i = 0; i < curve.length; i++) {
				if (!curve[i+1]) return 0;
				if (curve[i+1][0] >= value) return this.getInterpolatedInCurveAboveIndex(value, curve, i)
			}
			return curve[i-1][1];
		};

		Setting.prototype.setValue = function(value) {
			if (value > this.max) {
				value = this.max
			} else if (value < this.min) (
			    value = this.min
			);

			if (this.value != value) {
				this.value = value;
				this.processValue();
				this.onStateChange(this.processedValue);
			}
		};

		Setting.prototype.processValue = function() {
			this.processedValue = Math.round(100*(this.min + this.valueFromCurve(this.value / this.max, this.curve) * (this.max - this.min))) / 100;
		};

		Setting.prototype.getValue = function() {
			return this.value;
		};

		Setting.prototype.getProcessedValue = function() {
			return this.processedValue;
		};

		Setting.prototype.addOnChangeCallback = function(callback) {
			this.changedCallbacks.push(callback)
		};

		Setting.prototype.onStateChange = function(value) {
			SystemBus.emit("message_to_gui", {channel:'system_channel', message:["Setting Change", this.name+": "+this.processedValue]});
			for (var i = 0; i < this.changedCallbacks.length; i++) {
				this.changedCallbacks[i](value)
			}
		};

		var list = {
			sound_master:new Setting('Master Sound Level', 1, 0, 1, curves['zeroToOneExp']),
			sound_ambient:new Setting('Ambient Sound Level', 0.7, 0, 1, curves['zeroToOneExp']),
			sound_fx_ambient:new Setting('Ambient FX Send', 0, 0, 1, curves['zeroToOneExp']),
			sound_game:new Setting('Game Sound Level',0.7, 0, 1, curves['zeroToOneExp']),
			sound_fx_game:new Setting('Game FX Send', 0.7, 0, 1, curves['zeroToOneExp']),
			sound_ui:new Setting('UI Sound Level', 0.3, 0, 1, curves['zeroToOneExp']),
			sound_fx_ui:new Setting('UI FX Send', 1, 0, 1, curves['zeroToOneExp']),
			sound_music:new Setting('Music Level', 0.7, 0, 1, curves['zeroToOneExp']),
			sound_fx_music:new Setting('Music FX Senf', 0, 0, 1, curves['zeroToOneExp']),
			display_pixel_scale:new Setting('Pixel Scale', 1, 0.5, 4, curves['zeroToOneExp']),
			environemnt_time_scale:new Setting('Environment Time Scale', 0.05, 0, 1, curves['zeroToOneExp']),
			environemnt_time_of_day:new Setting('Environment Time Of Day', 0.3, 0, 1, curves['zeroToOne'])
		};

		var Settings = function() {

		};

		Settings.getAllSettings = function() {
			return list;
		};

		Settings.getSetting = function(settingId) {
			return list[settingId];
		};

		var handleSettingChanged = function(e){
		    list[event.eventArgs(e).setting].setValue(event.eventArgs(e).value);
		};

		event.registerListener(event.list().SETTING_CONTROL_EVENT, handleSettingChanged);

		return Settings;

	});