"use strict";

define([
		'data_pipeline/PipelineAPI',
	"application/EventManager",
	"goo/entities/SystemBus"
],
	function(
		PipelineAPI,
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


		var Setting = function(id) {
			this.id = id;
			this.params = {

			};
			this.name = id;
			this.value = 1;
			this.curve = [[0, 0], [1, 1]];
			this.processedValue;
			this.min = 0;
			this.max = 1;
			this.changedCallbacks = [];
			this.processValue();
		};

		Setting.prototype.applyConfigParams = function(name, defaultValue, min, max, curve) {
			this.name = name;
			this.curve = curve;
			this.min = min;
			this.max = max;
			this.setValue(defaultValue);
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

		Setting.prototype.onStateChange = function(value) {
			SystemBus.emit("message_to_gui", {channel:'system_channel', message:["Setting Change", this.name+": "+this.processedValue]});
			Settings.fireOnChangeCallbacks(this.id, value)
		};

		var list = {};
		var onChangeCallbacks = {};

		var applySettingConfigData = function(id, params) {
			console.log("add to list", id, list)
			if (!list[id]) {
				list[id] = new Setting(id);
			}
			list[id].applyConfigParams(params.name, params.value, params.min,  params.max, curves[params.curveId])
			Settings.fireOnChangeCallbacks(id, params.value);
		};


		var setupQueue = [];

		var Settings = function() {};

		Settings.addOnChangeCallback = function(settingId, callback) {
			if (!onChangeCallbacks[settingId]) {
				onChangeCallbacks[settingId] = [];
			}

			if (onChangeCallbacks[settingId].indexOf(callback) == -1) {
				onChangeCallbacks[settingId].push(callback);
			} else {
				console.error("Setting callback function already registered: ", settingId, onChangeCallbacks[settingId]);
			}

			var setting = Settings.getSetting(settingId);
			if (setting) {
				callback(setting.getProcessedValue());
			} else {
				console.log("Setting Callback registered, setting not yet defined", settingId);
				setupQueue.push(settingId);
			};

		};

		Settings.fireOnChangeCallbacks = function(settingId, value) {
			if (!onChangeCallbacks[settingId]) {
				onChangeCallbacks[settingId] = [];
				setupQueue.push(settingId);
				console.error("Fire request on non existing callbacks:", settingId);
			}

			for (var i = 0; i < onChangeCallbacks[settingId].length; i++) {
				onChangeCallbacks[settingId][i](value)
			}

		};


		Settings.loadSettingConfigs = function() {
			var applyConfig = function(srcKey, data) {
				console.log("Setting data:", srcKey, data)
				for (var i = 0; i < data.length; i++) {
					applySettingConfigData(data[i].id, data[i].params)
				}
			};

			PipelineAPI.subscribeToCategoryKey('application_settings', 'controller', applyConfig);
			PipelineAPI.subscribeToCategoryKey('application_settings', 'sound', applyConfig);
			PipelineAPI.subscribeToCategoryKey('application_settings', 'display', applyConfig);
			PipelineAPI.subscribeToCategoryKey('application_settings', 'environment', applyConfig);
		};

		Settings.getAllSettings = function() {
			return list;
		};

		Settings.getSetting = function(settingId) {
			return list[settingId];
		};

		Settings.readSettingValue = function(settingId) {
			if (!list[settingId]) return false;
			return list[settingId].value;
		};

		var handleSettingChanged = function(e){
		    list[event.eventArgs(e).setting].setValue(event.eventArgs(e).value);
		};

		event.registerListener(event.list().SETTING_CONTROL_EVENT, handleSettingChanged);

		return Settings;

	});