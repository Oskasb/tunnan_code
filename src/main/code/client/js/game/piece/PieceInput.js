"use strict";

define([
	'goo/math/MathUtils'
], function(
	MathUtils
	) {


	var PieceControl = function(id, data, onChange) {
		if (!data) data = {value:0};
		this.min = -1;
		this.max = 1;
		this.control = id;
		this.onChange = onChange || function () {
			console.log("Control has no callback: ", this.id)
		};
		this.value = data.value || 0;
		this.inputState = data.value || 0;
		this.appliedState = 0;

		this.update = this.value != 0;
	};


	PieceControl.prototype.applyConfig = function(data) {
		this.data = data;
		this.min = data.range.min;
		this.max = data.range.max;
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

	PieceInput.prototype.addPieceControl = function(control, ctrlData, callback) {
		this[control] = new PieceControl(control, ctrlData, callback);
	   	this.controls[control] = this[control];
	};

	PieceInput.prototype.registerOnChangeCallback = function(control, onChange) {
		this.controls[control].onChange = onChange;
	};

	PieceInput.prototype.setInputState = function(control, state) {
		this.controls[control].setInputAmount(state);
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
		this.controls[control].update = true;
	};

	PieceInput.prototype.applySystemConfigs = function(configs) {
		for (var i = 0;i < configs.length; i++) {
			this.controls[configs[i].control].applyConfig(configs[i]);
		}

	};


	return PieceInput;

});
