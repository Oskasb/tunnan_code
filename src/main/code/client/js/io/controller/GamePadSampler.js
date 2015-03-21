"use strict";

define([
    'data_pipeline/PipelineAPI',
    "goo/entities/SystemBus",
    "application/EventManager",
	'io/controller/ConnectedGamePad',
	'io/controller/DetectDesiredControl'
], function(
    PipelineAPI,
    SystemBus,
    event,
	ConnectedGamePad,
	DetectDesiredControl
) {

    var gamepadConfig = {};

    var saveConfiguration = function(gamePads) {
		console.log("Save pads:", gamePads);
		var pads = [];

        var saveState = function(id, stateObj, padState) {
            var saveObj = {
				sourceId:stateObj.sourceId,
				config:stateObj.getConfiguration()
			};
			padState.inputs.push(saveObj);
        };


	//	for (var pads in allControllers) {

			for (var index in gamePads) {

				var padState = {
					id:gamePads[index].gamePadId,
					inputs:[]
				};

				for (var j = 0; j < gamePads[index].axes.length; j++) {
					if (gamePads[index].axes[j].getControlId()) {
						saveState(gamePads[index].sourceId, gamePads[index].axes[j], padState);
					}
				}

				for (var k = 0; k < gamePads[index].buttons.length; k++) {
					if (gamePads[index].buttons[k].getControlId()) {
						saveState(gamePads[index].sourceId, gamePads[index].buttons[k], padState);
					}
				}
				pads.push(padState);
			}

	//	}





        localStorage.setItem("gamePadConfigs", JSON.stringify(pads));
		console.log("Saved:", pads);

    };

    var loadSavedConfig = function(configJson, gamePadStates) {
        var storedGamePads = JSON.parse(configJson);
		console.log("Connected pads: ", gamePadStates);
		var loadedControls = 0;
		var id;
		for (var i = 0; i < storedGamePads.length; i++) {
			console.log("Stored pads: ", storedGamePads[i]);
				if (gamePadStates[storedGamePads[i].id]) {
					id = storedGamePads[i].id;
					console.log("Saved and connected pad: ", storedGamePads[i].id);
					for (var j = 0; j < storedGamePads[i].inputs.length; j++) {

						var sourceId = storedGamePads[i].inputs[j].sourceId;
						var config = storedGamePads[i].inputs[j].config;
						gamePadStates[storedGamePads[i].id].loadStoredInput(sourceId, config);
						loadedControls++
					}
				}
		}

		console.log("Saved config: ", storedGamePads);
		if (loadedControls) {
			SystemBus.emit("message_to_gui", {channel:'alert_channel', message:["Controller Config Loaded", "ID: "+ id, "Control Count: "+loadedControls]});
		}
    };

	var resetGamePadStates = function(gamePadStates){
		for (var index in gamePadStates) {
			gamePadStates[index].resetGamePadConfig();
		}
	};


    var GamePadSampler = function() {

        var ctx = this;

        ctx.inputUpdated = function(inputState) {

        };

        ctx.playingInputUpdate = function(inputState) {
            event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:inputState.getChannel(), value:inputState.state})
        };


		ctx.inputDeltaFrame = function(state) {
			ctx.inputUpdated(state)
		};


        ctx.gamepadCallback = function(gamePad, index) {
            if (!ctx.gamePadStates[gamePad.id]) {
                ctx.initCallback(gamePad, index);
            }

			ctx.gamePadStates[gamePad.id].handleGamePadFrame(gamePad);
        };

        ctx.initCallback = function(gamepad, index) {
            console.log("Init Gamepad status: ", index, gamepad, gamepad.axes, gamepad.buttons);

			ctx.gamePadStates[gamepad.id] = new ConnectedGamePad(gamepad);
			ctx.gamePadStates[gamepad.id].connectController(gamepad);
			ctx.gamePadStates[gamepad.id].setUpdateCallback(ctx.inputDeltaFrame);

            var savedConfig = localStorage.getItem("gamePadConfigs");
            if (savedConfig) {
               loadSavedConfig(savedConfig, ctx.gamePadStates)
            }
        };

        var setupValues;
        var biggestFactor;
        var registeringForStateId;
		var applyTimeout;
		var selectedBiggestValue = 0;
		var selectedSetupInputId = null;
		var configuredInputs = {};

        ctx.gamePadStates = {};

        ctx.init = function() {
            ctx.setupInProgress = false;
            ctx.setupCompleted = false;
            ctx.setupIndex = 0;
            setupValues = {};
            biggestFactor = 0;
            registeringForStateId = null;
			selectedSetupInputId = null;
			configuredInputs = {};
			gamepadSupport.pollStatus(ctx.initCallback);
            ctx.inputUpdated = ctx.playingInputUpdate;
        };

        ctx.gamePadsFound = [];

        ctx.init();
        gamepadSupport.init();

        var selectionApplied = function() {
            console.log("Setup Done", ctx.setupIndex, gamepadConfig.controls[ctx.setupIndex]);
            ctx.setupIndex++;

            if (ctx.setupIndex ==  gamepadConfig.controls.length) {
                SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"Setup completed"});
                ctx.setupInProgress = false;
                ctx.inputUpdated = ctx.playingInputUpdate;
                saveConfiguration(ctx.gamePadStates);
				detectDesiredControl = null;
            } else {
				detectDesiredControl.determineCandidate = function() {

				};
				setTimeout(function() {

					detectDesiredControl = new DetectDesiredControl();
				}, 1000)
			}
        };

        var applySelection = function(inputState, controlData) {
			selectedSetupInputId = null;
            inputState.setControlId(controlData.id);
			inputState.setControlChannel(controlData.id);
			configuredInputs[inputState.sourceId] = controlData.params.control;
            SystemBus.emit("message_to_gui", {channel:'system_channel', message:[controlData.params.name, "Bound To:"+ inputState.sourceId]});
            selectionApplied();
        };

		ctx.registerInputStateToControl = function(inputState, controlData) {
			applySelection(inputState, controlData);
		};

        ctx.handleSetupInputStateUpdate = function(detectDesiredControl) {
			SystemBus.emit("message_to_gui", {channel:'system_channel', message:["Setup Control:", gamepadConfig.controls[ctx.setupIndex].params.name]});
			var candidateSelectedCallback = function(selectedSetupState) {
				SystemBus.emit("message_to_gui", {channel:'alert_channel', message:[gamepadConfig.controls[ctx.setupIndex].params.name, " -- OK --"]});
				ctx.registerInputStateToControl(selectedSetupState, gamepadConfig.controls[ctx.setupIndex]);

			};

			var seekingCallback = function(message) {
				SystemBus.emit("message_to_gui", {channel:'alert_channel', message:message});
			};

			detectDesiredControl.determineCandidate(candidateSelectedCallback, seekingCallback);
        };

		var detectDesiredControl;

        ctx.initGamePadConfiguration = function() {

			resetGamePadStates(ctx.gamePadStates);

            ctx.init();
			configuredInputs = {};
            if (ctx.setupInProgress) {
                return;
            }
            ctx.setupInProgress = true;

			detectDesiredControl = new DetectDesiredControl();

            ctx.inputUpdated = function(inputState) {
				detectDesiredControl.inputUpdated(inputState);
				ctx.handleSetupInputStateUpdate(detectDesiredControl)
			};

            SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"Init Controller Setup"});

        };

        ctx.loadControlConfigs = function() {
            var applyConfig = function(srcKey, data) {
                console.log("Controls data:", srcKey, data)
                gamepadConfig[srcKey] = data;
            };
            PipelineAPI.subscribeToCategoryKey('default_controls', 'controls', applyConfig);
        };


        ctx.loadControlConfigs();

        SystemBus.addListener('guiInitConfiguration', ctx.initGamePadConfiguration);

    };

    GamePadSampler.prototype.update = function() {
        gamepadSupport.pollStatus(this.gamepadCallback);
    };



    var gamepadSupport = {
        // A number of typical buttons recognized by Gamepad API and mapped to
        // standard controls. Any extraneous buttons will have larger indexes.
        TYPICAL_BUTTON_COUNT: 16,

        // A number of typical axes recognized by Gamepad API and mapped to
        // standard controls. Any extraneous buttons will have larger indexes.
        TYPICAL_AXIS_COUNT: 4,

        // Whether we’re requestAnimationFrameing like it’s 1999.
        ticking: false,

        // The canonical list of attached gamepads, without “holes” (always
        // starting at [0]) and unified between Firefox and Chrome.
        gamepads: [],

        // Remembers the connected gamepads at the last check; used in Chrome
        // to figure out when gamepads get connected or disconnected, since no
        // events are fired.
        prevRawGamepadTypes: [],

        // Previous timestamps for gamepad state; used in Chrome to not bother with
        // analyzing the polled data if nothing changed (timestamp is the same
        // as last time).
        prevTimestamps: [],

        /**
         * Initialize support for Gamepad API.
         */
        init: function() {
            var gamepadSupportAvailable = navigator.getGamepads ||
                !!navigator.webkitGetGamepads ||
                !!navigator.webkitGamepads;

            if (!gamepadSupportAvailable) {
                // It doesn’t seem Gamepad API is available – show a message telling
                // the visitor about it.
                tester.showNotSupported();
            } else {
                // Check and see if gamepadconnected/gamepaddisconnected is supported.
                // If so, listen for those events and don't start polling until a gamepad
                // has been connected.
                if ('ongamepadconnected' in window) {
                    window.addEventListener('gamepadconnected',
                        gamepadSupport.onGamepadConnect, false);
                    window.addEventListener('gamepaddisconnected',
                        gamepadSupport.onGamepadDisconnect, false);
                }
            }
        },

        /**
         * React to the gamepad being connected.
         */
        onGamepadConnect: function(event) {
            // Add the new gamepad on the list of gamepads to look after.
            gamepadSupport.gamepads.push(event.gamepad);

            // Ask the tester to update the screen to show more gamepads.
            tester.updateGamepads(gamepadSupport.gamepads);

            // Start the polling loop to monitor button changes.
            gamepadSupport.startPolling();
        },

        /**
         * React to the gamepad being disconnected.
         */
        onGamepadDisconnect: function(event) {
            // Remove the gamepad from the list of gamepads to monitor.
            for (var i in gamepadSupport.gamepads) {
                if (gamepadSupport.gamepads[i].index == event.gamepad.index) {
                    gamepadSupport.gamepads.splice(i, 1);
                    break;
                }
            }

            // Ask the tester to update the screen to remove the gamepad.
            tester.updateGamepads(gamepadSupport.gamepads);
        },

        /**
         * Checks for the gamepad status. Monitors the necessary data and notices
         * the differences from previous state (buttons for Chrome/Firefox,
         * new connects/disconnects for Chrome). If differences are noticed, asks
         * to update the display accordingly. Should run as close to 60 frames per
         * second as possible.
         */
        pollStatus: function(gamepadCallback) {
            // Poll to see if gamepads are connected or disconnected. Necessary
            // only on Chrome.
            gamepadSupport.pollGamepads();

            for (var i in gamepadSupport.gamepads) {
                var gamepad = gamepadSupport.gamepads[i];

                // Don’t do anything if the current timestamp is the same as previous
                // one, which means that the state of the gamepad hasn’t changed.
                // This is only supported by Chrome right now, so the first check
                // makes sure we’re not doing anything if the timestamps are empty
                // or undefined.
                if (gamepad.timestamp &&
                    (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
                    continue;
                }
                gamepadSupport.prevTimestamps[i] = gamepad.timestamp;
                gamepadCallback(gamepad, i)
            }
        },

        // This function is called only on Chrome, which does not yet support
        // connection/disconnection events, but requires you to monitor
        // an array for changes.
        pollGamepads: function() {
            // Get the array of gamepads – the first method (getGamepads)
            // is the most modern one and is supported by Firefox 28+ and
            // Chrome 35+. The second one (webkitGetGamepads) is a deprecated method
            // used by older Chrome builds.
            var rawGamepads =
                (navigator.getGamepads && navigator.getGamepads()) ||
                (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

            if (rawGamepads) {
                // We don’t want to use rawGamepads coming straight from the browser,
                // since it can have “holes” (e.g. if you plug two gamepads, and then
                // unplug the first one, the remaining one will be at index [1]).
                gamepadSupport.gamepads = [];

                // We only refresh the display when we detect some gamepads are new
                // or removed; we do it by comparing raw gamepad table entries to
                // “undefined.”
                var gamepadsChanged = false;

                for (var i = 0; i < rawGamepads.length; i++) {
                    if (typeof rawGamepads[i] != gamepadSupport.prevRawGamepadTypes[i]) {
                        gamepadsChanged = true;
                        gamepadSupport.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                    }

                    if (rawGamepads[i]) {
                        gamepadSupport.gamepads.push(rawGamepads[i]);
                    }
                }

            }
        }

    };

    return GamePadSampler;

});

