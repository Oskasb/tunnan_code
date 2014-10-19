"use strict";

define([
	'goo/math/MathUtils',
	'game/controls/ControlStateCallbacks'
], function(
	MathUtils,
	ControlStateCallbacks
	) {


	var PieceControl = function(id, onChange) {
		this.data = {};
		this.min = -1;
		this.max = 1;
		this.control = id;
		this.onChange = onChange || function () {
			console.log("Control has no callback: ", this.id)
		};
		this.value = 0;
		this.inputState = 0;
		this.appliedState = 0;
		this.update = false;
	};


	PieceControl.prototype.applyConfig = function(data) {
		this.data = data;
		this.min = data.range.min;
		this.max = data.range.max;
		if (data.default) {
			this.value = data.default;
			this.inputState = data.default;
			this.appliedState = data.default;
			this.update = true;
		}
	};

	PieceControl.prototype.setInputAmount = function(value) {
		value = MathUtils.clamp(value, this.min, this.max);
		if (value == undefined) value = 0;
		this.value = value;
		this.inputState = value;
		this.update = true;
	};

	var PieceInput = function() {
		this.controls = {};
	};

	PieceInput.prototype.addPieceControl = function(controlId) {
	   	this.controls[controlId] = new PieceControl(controlId, ControlStateCallbacks.getControlUpdateCallback(controlId));
	};

	PieceInput.prototype.registerOnChangeCallback = function(control, onChange) {
		this.controls[control].onChange = onChange;
	};

	PieceInput.prototype.setInputState = function(control, state) {
	//	console.log("Set input state: ", control, state)
		if (this.controls[control]) {
			this.controls[control].setInputAmount(state);
		}

	};

	PieceInput.prototype.getInputState = function(control) {
		return this.controls[control].inputState;
	};


	PieceInput.prototype.setAppliedState = function(control, state) {
		this.controls[control].appliedState = state;
	};

	PieceInput.prototype.getAppliedState = function(control) {
		return this.controls[control].appliedState;
	};

	PieceInput.prototype.readControlValue = function(control) {
		return this.controls[control].value;
	};


	PieceInput.prototype.triggerUpdate = function(control) {
		if (this.controls[control]) {
			this.controls[control].update = true;
		}

	};

	PieceInput.prototype.applySystemConfigs = function(configs) {
		for (var i = 0;i < configs.length; i++) {
			if (!this.controls[configs[i].control]) {
				this.addPieceControl(configs[i].control)
			}
			this.controls[configs[i].control].applyConfig(configs[i]);
		}

	};


	return PieceInput;

});
