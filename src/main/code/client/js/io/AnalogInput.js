"use strict";

define([
	"application/EventManager",
	'io/AnalogFeedback',
	'io/AnalogState',
	'io/OculusRiftInput',
], function(
	event,
	AnalogFeedback,
	AnalogState,
	OculusRiftInput
	) {


	var analogState;
	var analogFeedback;
	var oculusRiftInput = new OculusRiftInput();

	var analogMap = {
			version:'0.1',
			axes:['pitch', 'roll', 'yaw', 'throttle', 'flaps', 'look_up', 'look_left'],
			buttons:['fire_1', 'alt_axes', 'adjust_trim', 'reset_trim', 'adjust_yaw', 'gear', 'canopy', 'brake']
		};


	var executeButtonMapping = function(onDetect, buttonNr, buttonId) {
		onDetect(buttonId+'<br>button: '+buttonNr);
		analogState.mapButtonToControl(buttonNr, buttonId);
	};

	var checkButtonIdPressed = function(gamePad, id) {
		for (var i = 0; i < gamePad.buttons.length; i++) {
			var mapped = analogState.checkButtonMapping(i);
			if (mapped) {
				if (mapped.control == analogMap.buttons[analogMap.buttons.indexOf(id)]) {
					if (gamePad.buttons[i].pressed) {
						return 1;
					}

				}
			}
		}
		return 0;
	};

	var manuallyMapController = function(gamePad) {
		analogFeedback.showDetectedButtonsAndAxes(gamePad.buttons, gamePad.axes);
		var allReleased = false;
		var buttonsMapped = 0;
		var axesMapped = 0;

		var buttonStates = {};
		var mapWhenReleased = {};


		var manuallyMapButton = function(gamePad, buttonId) {


			if (!mapWhenReleased.buttonId) {
				mapWhenReleased.onDetect = analogFeedback.startButtonDetect(buttonsMapped);
			}

			//	analogFeedback.updateSampleState(analogMap.buttons[buttonId]);
				for (var i = 0; i < gamePad.buttons.length; i++) {
					if (buttonStates[i] != gamePad.buttons[i].pressed) {
						if (allReleased) {
							if (!analogState.checkButtonMapping(i)) {
								analogFeedback.updateSampleState(gamePad.buttons[i].value);
								mapWhenReleased.buttonNr = i;
								mapWhenReleased.buttonId = buttonId;

							}

						}
					}
					buttonStates[i] = gamePad.buttons[i].pressed;
				}

			allReleased = true;

			for (i = 0; i < gamePad.buttons.length; i++) {
				if (gamePad.buttons[i].pressed) {
					allReleased = false;
				}
			}

			if (allReleased && mapWhenReleased.buttonId) {
				executeButtonMapping(mapWhenReleased.onDetect, mapWhenReleased.buttonNr, mapWhenReleased.buttonId);
				mapWhenReleased = {};
				buttonsMapped += 1;
			}
		};

		var skip = false;

		var mapButtons = function(callback, gamePad) {
			for (var i = 0; i < gamePad.buttons.length; i++) {
				var mapped = analogState.checkButtonMapping(i);
				if (mapped) {
					if (mapped.control == analogMap.buttons[0]) {
						if (!skip && gamePad.buttons[i].pressed) {
							skip = true;
						}
						if (skip && !gamePad.buttons[i].pressed) {
							if (axesMapped != 0) {
								axesMapped += 1;
							} else {
								buttonsMapped += 1;
							}
							analogFeedback.skipMappingOfRequestedControl();
							skip = false;
						}
					}
					analogFeedback.showMappedButtonState(mapped, i, gamePad.buttons[i].value);
				}

				analogFeedback.showControllerButtonState(i, gamePad.buttons[i].value);
			}

			for (i = 0; i < gamePad.axes.length; i++) {
				analogFeedback.showControllerAxisState(i, gamePad.axes[i]);
			}

			var next = function() {
				manuallyMapButton(gamePad, analogMap.buttons[buttonsMapped])
			};
			if (!analogMap.buttons[buttonsMapped]) {
				callback(gamePad);
			} else {
				next();
			}
		};

		var mappingState = {};
		var lastBigSample = 0;
		var growCount = 0;
		var filterGate = 0.5;
		var endTimeout;
		var winnerAxis = 0;
		var winnerSample = 0;

		var lastFrame = {axes:{}};

		var manuallyMapAxis = function(gamePad, axisId) {
			var biggestAxis = 0;
			var onDetect = analogFeedback.startAxisDetect(axesMapped);

			var altAxis = checkButtonIdPressed(gamePad, 'alt_axes');

			var altAxisAdd = gamePad.axes.length*altAxis

			for (var i = 0; i < gamePad.axes.length; i++) {
				if (lastFrame.axes[i] != gamePad.axes[i]) {
					if (Math.abs(gamePad.axes[i]) > Math.abs(gamePad.axes[biggestAxis])) {
						biggestAxis = i;
					}
					lastFrame.axes[i] = gamePad.axes[i];
				}
			}

		//	if (biggestAxis == -1) return;



			console.log('Biggest:', biggestAxis, 'AltAxis:', altAxis);

			if (Math.abs(gamePad.axes[biggestAxis]) > filterGate) {


					if (Math.abs(lastBigSample) < Math.abs(gamePad.axes[biggestAxis])) {

						if (mappingState[biggestAxis] != gamePad.axes[biggestAxis]) {
							growCount += 1;
						}
						winnerSample = lastBigSample;
						console.log("Growing: ", axisId, growCount, lastBigSample);
						analogFeedback.showSamplePercent(axisId, gamePad.axes[biggestAxis]);
						if (growCount > 5) {
							winnerAxis = biggestAxis;
							if (!analogState.checkAxesMapping(winnerAxis+altAxisAdd)) {

								clearTimeout(endTimeout);
							//	endTimeout = setTimeout(function(){


									var diff = 1-Math.abs(winnerSample);

									analogState.mapAxisToControl(winnerAxis+altAxisAdd, axisId, axisSign, Math.round(winnerSample));


								//	axisSign *= -1;
									filterGate = 0.5;
								//	if (axisSign == 1) {
										axesMapped +=1;
								var text = axisId+'<br> axis: '+winnerAxis;
								if (altAxis) text += ' alt'
										onDetect(text);
								//	}

									growCount = 0;
							//	}, 500);
							}
						}
					}

				lastBigSample = gamePad.axes[biggestAxis];
				mappingState[biggestAxis] = gamePad.axes[biggestAxis];
			} else {
			//	filterGate *= 0.99;
				if (axisId) analogFeedback.showSamplePercent(axisId, 0);
				clearTimeout(endTimeout);
			}
		};

		var axisSign = 1;

		var saveConfiguration = function() {
			localStorage.setItem(analogState.controllerId, JSON.stringify(analogState));
			controllerEnabled(analogState.controllerId)
		};

		var mapAxes = function(gamePad) {

			var next = function() {
				manuallyMapAxis(gamePad, analogMap.axes[axesMapped])
			};
			if (!analogMap.axes[axesMapped]) {
				keepMapping = function() {
					analogFeedback.controllerSetupDone(saveConfiguration);
					console.log("Axes Mapping ended")
				};
			} else {
				next();
			}

		};

		var keepMapping = function() {
			mapButtons(mapAxes, readGamePad());
			requestAnimationFrame(function() {
				keepMapping();
			});
		};
		keepMapping();

	};

	var fromLocal;

	var gamePadDetected = function(gamePad) {

		var useLoaded = function() {
			console.log("Loaded controller from localStorage: ", gamePad, fromLocal);
			analogState.axesMap = fromLocal.axesMap;
			analogState.buttonMap = fromLocal.buttonMap;
			controllerEnabled(gamePad.id)
			document.getElementById('config_controller').innerHTML = "Edit Loaded";
		};

		var overWrite = function() {

		};

		analogState = new AnalogState(gamePad, analogMap.version);
		fromLocal = JSON.parse(localStorage.getItem(gamePad.id));
		if (fromLocal && fromLocal.version == analogMap.version) {
			useLoaded();
		//	analogFeedback.controllerSetupLoaded(useLoaded, overWrite)
		}
	};


	var configureController = function(e) {
		console.log("Configure Controller: ", e);

		if (event.eventArgs(e).controllerType != 'GamePad') return;

		seeking = true;
		analogState = null;

		var onDetect = function(gamePad) {
			console.log("Remap Controller: ", gamePad);
			analogState = new AnalogState(gamePad, analogMap.version);
			analogFeedback = new AnalogFeedback(analogMap, endGamePadConfiguration);
			var loaded = analogFeedback.startControllerDetect();
			setTimeout(function() {
				loaded(gamePad.id);
				manuallyMapController(gamePad);
			}, 300);

		};

		seekGamePad(onDetect);

	};

	event.registerListener(event.list().CONFIGURE_CONTROLLER, configureController);

	var readGamePad = function() {
		var gamePads = navigator.getGamepads();
		for (var i = 0; i < gamePads.length; i++) {
			if (gamePads[i]) return gamePads[i];
		}
	};

	var seeking = false;

	var seekGamePad = function(onDetect) {
		if (!seeking) return;

		var time = new Date().getTime()*0.005;

		var r = Math.round(99 + Math.sin(time)*88);
		var g = Math.round(100 + Math.cos(time)*25);
		var b = Math.round(99 + Math.sin(0.5+time)*44);

	//	document.getElementById('config_controller').style.backgroundColor = 'rgb(40 , '+g+' , 25)';

	//	document.getElementById('controller_enabled').style.color = 'rgb('+r*2+','+g*2+','+b+')';

//		document.getElementById('config_controller').style.backgroundColor = 'rgb('++','+  125 + Math.cos(time*0.01)*125+','+ 100 + Math.sin(0.5+time*0.01)*99+')';

		var gamePad = readGamePad();
	//	console.log("Read GP: ", gamePad)
		if (gamePad && !analogState) {
			seeking = false;
			onDetect(gamePad);
		} else {
			requestAnimationFrame(function() {
				seekGamePad(onDetect);
			});
		}
	};



	var startControllerConfig = function(gamePad) {
		gamePadDetected(gamePad);
		document.getElementById('config_controller').style.backgroundColor = 'rgb(117, 200, 37)';
		document.getElementById('controller_enabled').innerHTML = gamePad.id;
		document.getElementById('controller_enabled').style.color = '#FEA';
	};

	var ended = false;

	var initSeeking = function() {
		if (seeking || ended) return;
		seeking = true;
		analogState = null;

		var onDetect = function(gamePad) {
			startControllerConfig(gamePad)
		};

		setTimeout(function() {
	//		seekGamePad(onDetect);
	//		oculusRiftInput.seekRiftBridge();
	//		document.getElementById('config_controller').style.backgroundColor = 'rgb(137, 100, 37)';
	//		document.getElementById('config_controller').innerHTML = 'Press Button';
	//		document.getElementById('controller_enabled').innerHTML = "Seeking Gamepad";
	//		document.getElementById('controller_enabled').style.color = '#FC7';
		}, 1300);

	};



	var scenarioStarted = function() {
		ended = true;
		endGamePadConfiguration();
	};

	var endGamePadConfiguration = function() {

		console.log("End GamePad config");
		seeking = false;
	};

	var controllerEnabled = function(id) {
		document.getElementById('config_controller').style.backgroundColor = 'rgb(37, 219, 37)';
		document.getElementById('controller_enabled').innerHTML = id;
		document.getElementById('controller_enabled').style.color = '#EFE';
	};

	var tickInput = function() {
		if (analogState) {
			var gamePad = readGamePad();
			analogState.updateButtons(gamePad.buttons);
		//	checkButtonIdPressed(gamePad, 'alt_axes');
			analogState.updateAxes(gamePad.axes, checkButtonIdPressed(gamePad, 'alt_axes'), checkButtonIdPressed(gamePad, 'adjust_trim'));
		//	console.log("AnalogState: ", gamePad);
		}
	};

	event.registerListener(event.list().SCENARIO_SELECTED, scenarioStarted);
	event.registerListener(event.list().RENDER_TICK, tickInput);
	event.registerListener(event.list().LOADING_COMPLETED, initSeeking);
//	initSeeking();

});