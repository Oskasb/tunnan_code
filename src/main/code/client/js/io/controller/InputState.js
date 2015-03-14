"use strict";

define([], function() {

	var InputConfiguration = function() {
		this.controlId = null;
		this.controlChannel = "";
		this.factor = 1;

	};

	var InputState = function(controllerId, sourceId) {
		this.controllerId = controllerId;
		this.sourceId = sourceId;
		this.inputConfiguration = new InputConfiguration();
		this.state = 0;
		this.analogValue = 0;
		this.lastAnalogValue = 0;
	};

	InputState.prototype.resetConfiguration = function() {
		this.inputConfiguration = new InputConfiguration();
		this.state = 0;
		this.analogValue = 0;
		this.lastAnalogValue = 0;
	};

	InputState.prototype.getConfiguration = function() {
		return this.inputConfiguration;
	};

	InputState.prototype.getState = function(factor) {
		this.inputConfiguration.factor = factor;
	};

	InputState.prototype.setFactor = function(factor) {
		this.inputConfiguration.factor = factor;
	};

	InputState.prototype.getFactor = function() {
		return this.inputConfiguration.factor;
	};

	InputState.prototype.setControlId = function(controlId) {
		this.inputConfiguration.controlId = controlId;
	};

	InputState.prototype.getControlId = function() {
		return this.inputConfiguration.controlId;
	};

	InputState.prototype.setControlChannel = function(controlChannel) {
		this.inputConfiguration.controlChannel = controlChannel;
	};

	InputState.prototype.valueUpdated = function(analogValue) {
		this.analogValue = analogValue;
		this.state = this.analogValue / this.getFactor();
	};

	InputState.prototype.getChannel = function() {
		return this.inputConfiguration.controlChannel;
	};

	return InputState;

});