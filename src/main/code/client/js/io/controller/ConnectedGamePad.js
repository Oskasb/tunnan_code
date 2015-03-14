"use strict";

define(['io/controller/InputState'], function(InputState) {


	var ConnectedGamePad = function(gamePad) {
		this.gamePadId = gamePad.id;
		this.axes = [];
		this.buttons = [];
		this.updateCallback = function(state) {
			console.log("unbound update", state)
		}
	};

	ConnectedGamePad.prototype.getInputBySourceId = function(sourceId) {
		for (var i = 0; i < this.axes.length; i++) {
			if (this.axes[i].sourceId == sourceId) {
				return this.axes[i];
			}
		}

		for (i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].sourceId == sourceId) {
				return this.buttons[i];
			}
		}
	};

	ConnectedGamePad.prototype.loadStoredInput = function(sourceId, config) {
		this.getInputBySourceId(sourceId).setFactor(config.factor);
		this.getInputBySourceId(sourceId).setControlId(config.controlId);
		this.getInputBySourceId(sourceId).setControlChannel(config.controlChannel);
		console.log("Load Input to controller: ", config, this)
	};

	ConnectedGamePad.prototype.registerGamepadAxis = function(padId, axis, axisIndex) {
		this.axes[axisIndex] = new InputState(padId, padId+"_axis_"+axisIndex)
	};

	ConnectedGamePad.prototype.registerGamepadButton = function(padId, button, buttonIndex) {
		this.buttons[buttonIndex] = new InputState(padId, padId+"_button_"+buttonIndex)
	};

	ConnectedGamePad.prototype.connectController = function(gamePad) {
		this.gamePadId = gamePad.id;

		for (var i = 0; i < gamePad.axes.length; i++) {
			this.registerGamepadAxis(this.gamePadId, gamePad.axes[i], i);
		}

		for (i = 0; i < gamePad.buttons.length; i++) {
			this.registerGamepadButton(this.gamePadId, gamePad.buttons[i], i);
		}
	};

	ConnectedGamePad.prototype.resetGamePadConfig = function() {

		for (var i = 0; i < this.axes.length; i++) {
			this.axes[i].resetConfiguration();
		}

		for (i = 0; i < this.buttons.length; i++) {
			this.buttons[i].resetConfiguration();
		}
	};

	ConnectedGamePad.prototype.setUpdateCallback = function(callback) {
		this.updateCallback = callback;
	};

	ConnectedGamePad.prototype.comparePadStateWithInputState = function(gamePadValue, gamePadInputState) {
		gamePadInputState.lastAnalogValue = gamePadInputState.analogValue;
		if (Math.abs(gamePadValue) < 0.02) {
			gamePadValue = 0;
		}

		if (gamePadValue != gamePadInputState.analogValue) {
			gamePadInputState.valueUpdated(gamePadValue);
			this.updateCallback(gamePadInputState);
		}
	};

	ConnectedGamePad.prototype.handleGamePadFrame = function(gamePad) {

		for (var i = 0; i < this.axes.length; i++) {
			this.comparePadStateWithInputState(gamePad.axes[i], this.axes[i]);
		}

		for (i = 0; i < this.buttons.length; i++) {
			this.comparePadStateWithInputState(gamePad.buttons[i].value, this.buttons[i]);
		}

	};

	return ConnectedGamePad;

});