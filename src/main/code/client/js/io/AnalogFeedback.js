"use strict";

define([
	"application/EventManager",
	'io/InputSettersGetters',
	"goo/math/Vector3"
],
	function(
		event,
		inputSettersGetters,
		Vector3

		) {


		var AnalogFeedback = function(analogMap, setupEndedCallback) {
		//	this.controllerOverlay = DomUtils.createDivElement('viewporter', 'ctrl_overlay', '', 'full_size config_overlay');
		//	this.title = DomUtils.createDivElement(this.controllerOverlay, 'ctrl_title', 'Analog Control v:'+analogMap.version, 'title_label');
		//
		//	this.buttonsBox = DomUtils.createDivElement(this.controllerOverlay, 'ctrl_buttons', '', 'ctrl_buttons');
		//	this.axesBox = DomUtils.createDivElement(this.controllerOverlay, 'ctrl_buttons', '', 'ctrl_axes');
		//	this.samplePrompt = DomUtils.createDivElement(this.controllerOverlay, 'sample_prompt', 'Connect controller or press a button to detect controller', 'sample_prompt');




			this.ctrlDetectBox = DomUtils.createDivElement(this.controllerOverlay, 'ctrl_detect', 'Controller...', 'ctrl_detect');

			this.analogMap = analogMap;

			this.axesDirections = {
				pitch:{up:1, left:0},
				roll:{up:0, left:1},
				yaw:{up:0, left:1},
				throttle:{up:1, left:0},
				flaps:{up:1, left:0},
				look_up:{up:1, left:0},
				look_left:{up:0, left:1}
			};

			this.allButtonElems = [];
			this.allAxesElems = [];

			this.buttonElems = [];
			this.axesElems = [];
			this.analogElems = [];
			this.updateElem = null;

			var build = function() {
				this.loadButtonDetect(analogMap.buttons);
				this.loadAxesDetect(analogMap.axes);
				this.addCancelButton();
			}.bind(this);

			setTimeout(function() {
				 build();
			}, 100);

			this.done = setupEndedCallback;


		};


		AnalogFeedback.prototype.showDetectedButtonsAndAxes = function(buttons, axes) {
			for (var i = 0; i < buttons.length; i++) {
				this.allButtonElems[i] = DomUtils.createDivElement(this.allButtons, 'all_buttons_'+i, ''+i, 'possible_button');
			}


			var allAxEl = this.allAxesElems;
			var addCtrAxis = function(parent, index) {
				setTimeout(function() {
					allAxEl[index] = DomUtils.createDivElement(parent, 'all_axes_'+index, '', 'crtl_axis');
				}, 200);
			};

			for (i = 0; i < axes.length; i++) {
				var parent = DomUtils.createDivElement(this.allAxes, 'all_axes_'+i, ''+i, 'possible_axis');
				addCtrAxis(parent, i);

			}

		};

		AnalogFeedback.prototype.loadButtonDetect = function(buttons) {
			this.allButtons = DomUtils.createDivElement(this.buttonsBox, 'all_buttons', 'Controller Buttons:', 'all_candidates');
			for (var i = 0; i < buttons.length; i++) {
				this.buttonElems[i] = DomUtils.createDivElement(this.buttonsBox, 'ctrl_button_detect_'+buttons[i], buttons[i], 'ctrl_button_detect');
			}
		};

		AnalogFeedback.prototype.loadAxesDetect = function(axes) {

			var addAnalog = function(parent, count) {
				var analogs = this.analogElems;
				setTimeout(function() {
					console.log("Elems: ", analogs);
					analogs[count] = DomUtils.createDivElement(parent, 'ctrl_axes_value_'+count, count, 'ctrl_axes_value');
				}, 200*count);

			}.bind(this);

			this.allAxes = DomUtils.createDivElement(this.axesBox, 'all_axes', 'Controller Axes:', 'all_candidates');

			for (var i = 0; i < axes.length; i++) {
				this.axesElems[i] = DomUtils.createDivElement(this.axesBox, 'ctrl_axes_detect_'+axes[i], axes[i], 'ctrl_axes_detect');
				addAnalog(this.axesElems[i], i);
			}
		};

		AnalogFeedback.prototype.addCancelButton = function() {

			var cancelSetup = function() {
				DomUtils.removeElement(this.controllerOverlay);
				this.done();
			}.bind(this);

			this.cancelButton = DomUtils.createDivElement(this.controllerOverlay, 'config_cancel', 'Close', 'config_cancel');

			DomUtils.addElementClickFunction(this.cancelButton, cancelSetup);

		};

		AnalogFeedback.prototype.startControllerDetect = function() {
			return this.setupDetectElement(this.ctrlDetectBox)
		};

		AnalogFeedback.prototype.startButtonDetect = function(buttonNr) {
			var text = "Press [ "+this.analogMap.buttons[buttonNr]+" ]";
			if (buttonNr != 0) text += " (or press [ "+this.analogMap.buttons[0]+" ] to skip)";
			this.samplePrompt.innerHTML = text;
			return this.setupDetectElement(this.buttonElems[buttonNr])
		};

		AnalogFeedback.prototype.startAxisDetect = function(axisNr) {
			this.samplePrompt.innerHTML = "Move [ "+this.analogMap.axes[axisNr]+" ] (or press [ "+this.analogMap.buttons[0]+" ] to skip)";
			this.analogStateElem = this.analogElems[axisNr];
			return this.setupDetectElement(this.axesElems[axisNr])
		};

		AnalogFeedback.prototype.setupDetectElement = function(element) {
			this.updateElem = element;
			var onDetect = function(ctrlId) {
				setTimeout(function() {
					DomUtils.removeElementClass(element, 'sampling_activated');
					element.innerHTML = ctrlId;
					DomUtils.addElementClass(element, 'sampling_successful');
				}, 200)
			};
			DomUtils.addElementClass(element, 'sampling_activated');
			return onDetect;
		};

		AnalogFeedback.prototype.skipMappingOfRequestedControl = function() {
			DomUtils.removeElementClass(this.updateElem, 'sampling_activated');
			this.updateElem.style.opactiy = 0.5;
		};

		AnalogFeedback.prototype.controllerSetupDone = function(finished) {

			var cancelSetup = function() {
				DomUtils.removeElement(this.controllerOverlay);
				finished();
				this.done();
			}.bind(this);

			this.doneButton = DomUtils.createDivElement(this.controllerOverlay, 'config_done', 'Done', 'config_done');

			DomUtils.addElementClickFunction(this.doneButton, cancelSetup);
		};

		AnalogFeedback.prototype.controllerSetupLoaded = function(useLoaded, overWrite) {

			var useSetup = function() {
				DomUtils.removeElement(this.controllerOverlay);
				useLoaded();
				this.done();
			}.bind(this);

			this.doneButton = DomUtils.createDivElement(this.controllerOverlay, 'config_done', 'UseLoaded', 'config_done');

			DomUtils.addElementClickFunction(this.doneButton, useSetup);


			var redoSetup = function() {
				DomUtils.removeElement(this.doneButton);
				DomUtils.removeElement(this.redoButton);
				overWrite();
			}.bind(this);

			this.redoButton = DomUtils.createDivElement(this.controllerOverlay, 'config_use', 'Replace', 'config_use');

			DomUtils.addElementClickFunction(this.redoButton, redoSetup);

		};

		AnalogFeedback.prototype.updateSampleState = function(value) {
			this.updateElem.innerHTML = value;
		};

		AnalogFeedback.prototype.showControllerButtonState = function(index, value) {
			this.allButtonElems[index].style.backgroundColor = "rgba(100, 255, 100, "+value+")";
		};

		AnalogFeedback.prototype.showControllerAxisState = function(index, value) {
			if (!this.allAxesElems[index]) return;
			this.allAxesElems[index].style.backgroundColor = "rgba(125"+125*value+", 125"-125*value+", 100, 1)";
			this.allAxesElems[index].style.left = 50+50*value+"%";

		};

		AnalogFeedback.prototype.showMappedButtonState = function(mapped, buttonNr, value) {
		//	console.log("Show Button state: ", mapped, buttonNr, this.buttonElems);

			this.buttonElems[this.analogMap.buttons.indexOf(mapped.control)].style.backgroundColor = "rgba(100, 255, 100, "+value+")";
		};

		AnalogFeedback.prototype.showSamplePercent = function(axisId, value) {
			this.analogStateElem.style.top = 50 + value*50*this.axesDirections[axisId].up  +'%';
			this.analogStateElem.style.left = 50 + value*50*this.axesDirections[axisId].left +'%';
		};

		return AnalogFeedback;

	});