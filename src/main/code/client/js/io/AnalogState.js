"use strict";

define([
	"application/EventManager"
], function(
	event
	) {

	var AnalogState = function (gamePad, version) {
		this.version = version;
		this.controllerId = gamePad.id;
		this.axesMap = {};
		this.buttonMap = {};
		this.altAxes = 0;
		this.altAxesShift = gamePad.axes.length;
		this.controlMap = {
			fire_1:'cannons',
			fire_2:'taxi_lights',
			pitch:'elevator',
			roll:'aeilrons',
			yaw:'rudder',
			throttle:'throttle',
			reset_trim:'reset_trim',
			adjust_trim:'adjust_trim',
			alt_axes:'alt_axes',
			flaps:'flaps',
			canopy:'canopy',
			gear:'gears',
			brake:'breaks',
			look_up:	'look_up',
			look_left:	'look_left'
		};

		this.controlState = {
			fire_1:0,
			fire_2:0,
			pitch:0,
			roll: 0,
			yaw: 0,
			throttle: 0
		}
	};

	AnalogState.prototype.checkButtonMapping = function(index) {
		return this.buttonMap[index];
	};

	AnalogState.prototype.checkAxesMapping = function(index) {
		return this.axesMap[index];
	};

	AnalogState.prototype.mapButtonToControl = function(buttonNr, control) {
		this.buttonMap[buttonNr] = {control:control};
		console.log("MapButtonToCtrl: ", this.buttonMap, buttonNr, control);
	};

	AnalogState.prototype.mapAxisToControl = function(axis, control, axisSign, factor) {
		if (this.axesMap[axis]) {
			if (this.axesMap[axis].factor > factor*axisSign) {
				factor = this.axesMap[axis].factor*axisSign;
			}
		}

		this.axesMap[axis] = {control:control, factor:factor*axisSign};
		console.log("MapAxisToCtrl: ", this.axesMap, axis, control, factor, axisSign);
	};

	AnalogState.prototype.mapAxes = function (controlMap) {
		for (var key in controlMap) {
			this.mapAxisToControl(controlMap[key].key, key, controlMap[key].factor);
		}
	};

	var camMove = false;
	AnalogState.prototype.updateAxes = function(axes, altAxes, adjustTrim) {
		var key;
		var axValue;
		camMove = false;

		for (var i = 0; i < axes.length; i++) {
			key = i+altAxes*this.altAxesShift;
			if (this.axesMap[key]) {
				axValue = axes[i];

				var control = this.controlMap[this.axesMap[key].control];

				if(control) {
					if (adjustTrim) {
						event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:'trim_'+control, value:Math.abs(axValue*axValue)*axValue*this.axesMap[key].factor*0.2});
						//		event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:'trim_'+control, currentState:Math.abs(axValue*axValue)*axValue*this.axesMap[key].factor});
					} else if (control == 'look_up' || control == 'look_left') {
						this.controlState[this.axesMap[key].control] = axValue;
						camMove = true;
					} else if (axValue != this.controlState[this.axesMap[key].control]) {

						event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:control, value:Math.abs(axValue*axValue)*axValue*this.axesMap[key].factor});
						this.controlState[this.axesMap[key].control] = axValue;
					}
				}
			}
		}

		if (camMove) {
			event.fireEvent(event.list().SET_CAMERA_ANALOGS, {rotX:this.controlState['look_left'], rotY:this.controlState['look_up'], rotZ:0});
		} else {
			if (this.controlState['look_left'] != 0 || this.controlState['look_up' != 0]) {
				this.controlState['look_left'] = 0;
				this.controlState['look_up'] = 0;
				event.fireEvent(event.list().SET_CAMERA_ANALOGS, {rotX:this.controlState['look_left'], rotY:this.controlState['look_up'], rotZ:0});
			}
		}




	};

	AnalogState.prototype.updateButtons = function(buttons) {
		for (var key in this.buttonMap) {
			if (buttons[key].value != this.controlState[this.buttonMap[key].control]) {
				console.log("Button changed", key, this.buttonMap[key], buttons[key]);
				if(this.controlMap[this.buttonMap[key].control]) {
					event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:this.controlMap[this.buttonMap[key].control], value:buttons[key].value});
					this.controlState[this.buttonMap[key].control] = buttons[key].value;
					// event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:this.controlMap[this.buttonsMap[key]], currentState:buttons[key]})
				}
			}
		}
	};

	return AnalogState;
});