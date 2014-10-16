"use strict";

define([
	"application/EventManager",
	"io/PlayerMovementInput",
	"io/MouseListener",
	"io/GameScreen",
	"io/AnalogInput",
	"io/KeyboardHandler",
	'gui/CanvasGuiAPI'
], function(
	event,
	playerMovementInput,
	mouseListener,
	GameScreen,
	AnalogInput,
	keyboardHandler,
	CanvasGuiAPI
	) {

    var mouseWheelDelta = 0;
    var mouseMoveX = 0;
    var mouseMoveY = 0;
    var frameDX = 0;
    var frameDY = 0;
    var mouseX = 0;
    var mouseY = 0;
    var mousePressed = false;
    var keyBindingStates = {};
    var startDragX = 0;
    var startDragY = 0;
    var dragInProgress = false;
    var actionBarBindings = {};
    var keyBindings = {};
    var focusedElement = "game";
    var setZoom;

    var getCodeForKey = function(key) {
        if (typeof(key) == "number") {
            if (!code) code = key;
        } else {
            var skey = ""+key+""
            var code = skey.charCodeAt(0);
        }
        return code;
    };

    var registeKeyBinding = function(control, key) {
        var code = getCodeForKey(key);
//        console.log("--------->> Bind Key Code:", code, control)
        keyBindings[code] = control;
    };

    var unregisteKeyBinding = function(key) {
        var code = getCodeForKey(key);
//        console.log("--------->> Remove Key Code:", code);
        delete keyBindings[code];
    };

    var bindKeyboardListener = function() {
        document.body.onkeydown = function(e) {
            e.preventDefault();
        //    console.log("Key is pressed:", e.keyCode)
            var keyCode = e.keyCode;
            if (focusedElement == "game") {

                if (actionBarBindings[keyCode]) {
                    //        client.currentState.triggerButtonEntityAction(actionBarBindings[e.keyCode]);
                }

                if (keyBindings[keyCode] && !keyBindingStates[keyCode]) {
                //    playerMovementInput.keyboardInput(keyBindings[e.keyCode], "keydown");
             //       console.log("Keyboard Event", keyBindings[keyCode], "keydown")


                    keyBindingStates[keyCode] = 1;
                    event.fireEvent(event.list().UPDATE_KEYBINDING, {control:keyBindings[e.keyCode], value:1});

                }
            }

        };

		document.body.onkeyup = function(e) {
            var keyCode = e.keyCode;
            if (focusedElement == "game") {
                if (keyBindings[keyCode]) {
                    keyBindingStates[keyCode] = 0;
                //    console.log("Keyboard Event", keyBindings[e.keyCode], "keyup")
                //    userInput.keyboardMovementInput(keyBindings[e.keyCode], "keyup");
                    event.fireEvent(event.list().UPDATE_KEYBINDING, {control:keyBindings[e.keyCode], value:0});
                }
            }
        };
    };


    var bindKeyToActionBarFunction = function(buttonEntity, key) {
        var code = key.charCodeAt(0);
        actionBarBindings[code] = buttonEntity;
    };


    var setMouseWheelDelta = function(mwheeldelta) {
        setZoom = true;
        mouseWheelDelta = mwheeldelta;
        event.fireEvent(event.list().MOUSE_WHEEL_UPDATE, {delta:mwheeldelta})
    };

    var getMouseXY = function() {
        return [CanvasGuiAPI.getPointerState().x, CanvasGuiAPI.getPointerState().y];
    };

    var getDragState = function() {
        return dragInProgress;
    };

    var setMouseCoords = function(x, y) {
        mouseX = x;
        mouseY = y;
        event.fireEvent(event.list().MOUSE_POSITION_UPDATE, {xy:[x, y]})
    };

    var clearFrame = function() {
        frameDX = 0;
        frameDY = 0;
    };
    var clearTimer;

    var setMouseMove = function(dx, dy) {
        frameDX = dx;
        frameDY = dy;
        mouseMoveX += dx;
        mouseMoveY += dy;

        clearTimeout(clearTimer);
        clearTimer = setTimeout(function() {
            clearFrame();
        }, 100);
    };

    var getMouseMove = function() {
        return [mouseMoveX, mouseMoveY];
    };

    var setStartDragXY = function(xy) {
        startDragX = xy[0];
        startDragY = xy[1];
        dragInProgress = true;
    };

    var setupElementListener = function(id) {
    //    var elem = document.getElementById(element);
		GameScreen.setupMouseListener(id);
		GameScreen.getElement().addEventListener('mousemove', function(e) {
            e.stopPropagation();
            var x = (e.clientX);
            var y = (e.clientY);
            var dx = 2 * ((x) - GameScreen.getWidth() / 2) / GameScreen.getWidth();
            var dy = 2 * ((y) - GameScreen.getHeight() / 2) / GameScreen.getHeight();
            setMouseCoords(x, y);
            setMouseMove(dx, dy);
        });

		GameScreen.getElement().addEventListener('mouseout', function(e) {
            e.stopPropagation();
            setMouseMove(0,0);
        });

		var zoomTimout;

		GameScreen.getElement().addEventListener('mousewheel', function(e) {
            e.stopPropagation();
			if (zoomTimout) return;
            var wheeldelta = e.wheelDelta / 1200;
            if (wheeldelta != 0) {
                setMouseWheelDelta(wheeldelta);
            //    event.preventDefault();
            }
			setTimeout(function() {
				zoomTimout = false;
			}, 100);
			zoomTimout = true;
        });
    };

    var mouseCallback = function(mouseAction) {

        event.fireEvent(event.list().MOUSE_ACTION, {action:mouseAction, xy:[mouseX, mouseY]})
    };


    var initInput = function(e) {
		// event.eventArgs(e).goo.renderer.domElement; //
        setupElementListener(event.eventArgs(e).goo.renderer.domElement);
        mouseListener.setElementClickFunction(document.body, mouseCallback)
    };

    var handleStartDrag = function(e) {
        setStartDragXY(event.eventArgs(e).xy);
    };
    var stopDrag = function() {
        dragInProgress = false;
    };

    var handleStopDrag = function(e) {
        stopDrag();
    };

    var getDragDeltaXY = function() {
        return [startDragX - mouseX, startDragY - mouseY];
    };

    var getMouseFrameDelta = function() {

        return [frameDX, frameDY];
    };

    bindKeyboardListener();

    var handleFetchDragDelta = function(e) {
        event.eventArgs(e).callback(getMouseFrameDelta());
    };

    var getBoundKeys = function() {
        return keyBindings;
    };

	var guiApi;
	var setGuiApi = function(api) {
		guiApi = api;
	};

	var lastAction = [0, 0];

	var tickInput = function() {
		var pointerState = guiApi.getPointerState();

		setMouseMove(pointerState.dx, pointerState.dy);
		setMouseCoords(pointerState.x, pointerState.y);
		if (pointerState.wheelDelta) {
			event.fireEvent(event.list().MOUSE_WHEEL_UPDATE, {delta:pointerState.wheelDelta})
		}

		if (pointerState.drag) {
			setStartDragXY(pointerState.startDrag[0], pointerState.startDrag[1]);
		}

		if (lastAction[0] != pointerState.action[0] || lastAction[1] != pointerState.action[1]) {
			event.fireEvent(event.list().MOUSE_ACTION, {action:pointerState.action, xy:[pointerState.x, pointerState.y]});
		}

		lastAction[0] = pointerState.action[0];
		lastAction[1] = pointerState.action[1];


	};

    event.registerListener(event.list().RENDER_TICK, tickInput);
 //   event.registerListener(event.list().ENINGE_READY, initInput);
    event.registerListener(event.list().START_POINTER_DRAG, handleStartDrag);
    event.registerListener(event.list().START_CAMERA_DRAG, handleStartDrag);
    event.registerListener(event.list().STOP_CAMERA_DRAG, handleStopDrag);
    event.registerListener(event.list().FETCH_DRAG_DELTA, handleFetchDragDelta);

    return {
		setGuiApi:setGuiApi,
        registeKeyBinding:registeKeyBinding,
        unregisteKeyBinding:unregisteKeyBinding,
        getDragDeltaXY:getDragDeltaXY,
        getBoundKeys:getBoundKeys

    }
});
