"use strict";

define([
    "goo/entities/SystemBus",
    "application/EventManager"
], function(
    SystemBus,
    event
) {

    var gamepadConfig = {
        controls:[
            {
                "id":"elevator",
                "params":{
                    "control":"elevator",
                    "name":"Pitch Up",
                    "axis": 1
                }
            },
            {
                "id":"aeilrons",
                "params":{
                    "control":"aeilrons",
                    "name":"Roll Left",
                    "axis": 0
                }
            },
            {
                "id":"rudder",
                "params":{
                    "control":"rudder",
                    "name":"Yaw Left",
                    "axis": 2
                }
            },
            {
                "id":"throttle",
                "params":{
                    "control":"throttle",
                    "name":"Throttle",
                    "axis":3
                }
            }
        ]
    };

    var InputState = function(id) {
        this.sourceId = id;
        this.controlChannel = "";
        this.factor = 1;
        this.state = 0;
        this.analogValue = 0;
        this.controlId = null;
    };

    InputState.prototype.setFactor = function(factor) {
        this.factor = factor;
    };

    InputState.prototype.setControlId = function(controlId) {
        this.controlId = controlId;
    };

    InputState.prototype.setControlChannel = function(controlChannel) {
        this.controlChannel = controlChannel;
    };

    var GamePadState = function() {
        this.axes = [];
        this.buttons = [];
    };

    var GamePadSampler = function() {

        var ctx = this;

        ctx.registerGamepadAxis = function(padIndex, axis, axisIndex) {
            ctx.gamePadStates[padIndex].axes[axisIndex] = new InputState("pad_"+padIndex+'_axis_'+axisIndex)
        };

        ctx.registerGamepadButton = function(padIndex, button, buttonIndex) {
            console.log("Register gamepad button: ", buttonIndex, button, padIndex);
            ctx.gamePadStates[padIndex].buttons[buttonIndex] = new InputState("pad_"+padIndex+'_button_'+buttonIndex, buttonIndex, 1, ctx.entity)
        };

        ctx.comparePadStateWithInputState = function(gamePadValue, gamePadInputState) {
            if (Math.abs(gamePadValue) < 0.02) {
                gamePadValue = 0;
            }
            if (gamePadValue != gamePadInputState.state * gamePadInputState.factor) {
                gamePadInputState.analogValue = gamePadValue;
                gamePadInputState.state = gamePadInputState.analogValue * gamePadInputState.factor;

                event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:gamePadInputState.controlChannel, value:gamePadInputState.state})

            }
        };

        ctx.gamepadCallback = function(gamePad, index) {
//		console.log("Gamepad status: ", index, gamepad.axes, gamepad.buttons);

            if (ctx.gamePadsFound.indexOf(index) == -1) {
                ctx.initCallback(gamePad, index);
            }

            for (var i = 0; i < ctx.gamePadStates[index].axes.length; i++) {
                ctx.comparePadStateWithInputState(gamePad.axes[i], ctx.gamePadStates[index].axes[i]);
            }

            for (var i = 0; i < ctx.gamePadStates[index].buttons.length; i++) {
                //	console.log("Button:", i, gamePad.buttons[i], ctx.gamePadStates[index])
                ctx.comparePadStateWithInputState(gamePad.buttons[i].value, ctx.gamePadStates[index].buttons[i]);
            }

        };

        ctx.initCallback = function(gamepad, index) {
            console.log("Init Gamepad status: ", index, gamepad, gamepad.axes, gamepad.buttons);

            for (var i = 0; i < gamepad.axes.length; i++) {
                ctx.registerGamepadAxis(index, gamepad.axes[i], i);
            }

            for (i = 0; i < gamepad.buttons.length; i++) {
                ctx.registerGamepadButton(index, gamepad.buttons[i], i);
            }

            ctx.gamePadsFound.push(index);

        };

        var setupValues;
        var biggestFactor;
        var registeringForStateId;

        ctx.gamePadStates = [new GamePadState(),new GamePadState(),new GamePadState(),new GamePadState()];

        ctx.init = function() {
            gamepadSupport.pollStatus(ctx.initCallback);
            ctx.setupInProgress = false;
            ctx.setupCompleted = false;
            ctx.setupIndex = 0;
            setupValues = {};
            biggestFactor = 0;
            registeringForStateId;
        };

        ctx.gamePadsFound = [];

        ctx.init();
        gamepadSupport.init();





        var selectionApplied = function() {
            biggestFactor = 0;
            registeringForStateId = "";
            console.log("Setup Done", ctx.setupIndex, gamepadConfig.controls[ctx.setupIndex]);
            ctx.setupIndex++;

            if (ctx.setupIndex ==  gamepadConfig.controls.length) {
                SystemBus.emit("message_to_gui", {channel:'system_channel', message:"Controller setup completed"});
                SystemBus.removeListener('input_state_change', ctx.handleSetupInputStateUpdate);
                ctx.setupInProgress = false;
            }

        };

        var applySelection = function(inputState, controlData) {
            inputState.setControlId(controlData.id);
            SystemBus.emit("message_to_gui", {channel:'alert_channel', message:[controlData.params.name, "Bound To:"+ controlData.id]});
            selectionApplied();
        };

        var applyTimeout;

        var cancelled = function(inputState, controlData) {
            setupValues = {};
            inputState.factor = 0;

            clearTimeout(applyTimeout);
            applyTimeout = null;
        };


        ctx.registerInputStateToControl = function(inputState, controlData) {
            if (registeringForStateId && registeringForStateId != inputState.sourceId) {
                SystemBus.emit("message_to_gui", {channel:'alert_channel', message:[controlData.params.name, " -- Cancelled -- ", " -- Control Switched -- "]});
                console.log(registeringForStateId, inputState.sourceId)
                cancelled(inputState, controlData);
                return;
            }

            if (Math.abs(inputState.analogValue) < 0.5) {
                console.log(inputState)
                SystemBus.emit("message_to_gui", {channel:'alert_channel', message:[controlData.params.name, " -- Cancelled -- ", " -- Value Cut -- "]});
                cancelled(inputState, controlData);
                return;
            }

            registeringForStateId = inputState.sourceId;

                biggestFactor = inputState.analogValue;
                inputState.setFactor(inputState.analogValue);
                inputState.setControlChannel(controlData.params.control);
                var registeredState = inputState;
                var registeredData = controlData;
                SystemBus.emit("message_to_gui", {channel:'alert_channel', message:[controlData.params.name, "Factor:", biggestFactor]});

                if (!applyTimeout) {
                    applyTimeout = setTimeout(function(){
                        applySelection(registeredState, registeredData);
                    }, 1000)
                }

        };


        ctx.getBiggestAnalogState = function() {
            var biggestState = null;

            for (var i = 0; i < ctx.gamePadStates.length; i++) {
                for (var j = 0; j < ctx.gamePadStates[i].axes.length; j++) {
                    if (!biggestState) {
                        biggestState = ctx.gamePadStates[i].axes[j];
                    }

                    if (Math.abs(ctx.gamePadStates[i].axes[j].analogValue) > Math.abs(biggestState.analogValue)) {
                        biggestState = ctx.gamePadStates[i].axes[j];
                    }


                }

                for (var k = 0; k < ctx.gamePadStates[i].buttons.length; k++) {
                    if (!biggestState) {
                        biggestState = ctx.gamePadStates[i].buttons[k];
                    }

                    if (Math.abs(ctx.gamePadStates[i].buttons[k].analogValue) > Math.abs(biggestState.analogValue)) {
                        biggestState = ctx.gamePadStates[i].buttons[k];
                    }

                }

            }

            return biggestState;

        };

        ctx.handleSetupInputStateUpdate = function(gamePadInputState) {

            SystemBus.emit("message_to_gui", {channel:'hint_channel', message:["Setup Control:", gamepadConfig.controls[ctx.setupIndex].params.name]});

            if (gamePadInputState.controlId) {
                SystemBus.emit("message_to_gui", {channel:'system_channel', message:["Control Registered: "+ gamePadInputState.controlId+" "+gamePadInputState.sourceId, "Factor: "+gamePadInputState.factor]});
                return;
            }
            setupValues[gamePadInputState.sourceId] = gamePadInputState.analogValue;

            var selectedBiggestState = ctx.getBiggestAnalogState();

            if (selectedBiggestState && !selectedBiggestState.controlId) {
                ctx.registerInputStateToControl(selectedBiggestState, gamepadConfig.controls[ctx.setupIndex])
                SystemBus.emit("message_to_gui", {channel:'system_channel', message:[gamepadConfig.controls[ctx.setupIndex].params.name, selectedBiggestState.sourceId, " value: "+selectedBiggestState.analogValue]});
            };


        };

        ctx.initGamePadConfiguration = function() {

            ctx.init();

            if (ctx.setupInProgress) {
                return;
            }
            ctx.setupInProgress = true;

            SystemBus.addListener('input_state_change', ctx.handleSetupInputStateUpdate);
            SystemBus.emit("message_to_gui", {channel:'alert_channel', message:"Init Controller Setup"});

        };


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

