"use strict";

define([
	'goo/entities/SystemBus',
    "application/EventManager",
    'io/InputSettersGetters',

	'io/GameScreen'
],
    function(
		SystemBus,
        event,
        inputSettersGetters,
		PointerCursor,
		GameScreen

        ) {

        var sampleDrag = false;
        var dragDelta;
        var dragX;
        var dragY;
        var startXy;
        var registered = false;
        var pieceData;
        var currentTargets = [];
        var screenControlTargets = {};
		var screenSelectionSufaces = {};
        var currentHover = [];
        var cameraDrag;
		var pointerCursor;
		var widgets = [];

		var guiLayers = [];

        var loadControlTargets = function(guiWidgetComposer) {
			screenControlTargets = guiWidgetComposer.screenControlTargets;
			screenSelectionSufaces = guiWidgetComposer.screenSelectionSufaces;
			widgets = guiWidgetComposer.widgets;
        };



	    var hintCount = 0;
        var tickInput = function(time) {
			processMouseFrame();
			var i= 0;
			var tpf = time;



			for (i = 0; i < widgets.length; i++) {
				widgets[i].showControlState()
			}

			if (buttonDownTarget) buttonDownTarget.showControlState();
			if (cameraDrag) return;

			var controls = [];

            if (sampleDrag) {
                dragDelta = inputSettersGetters.getDragDeltaXY();
				pointerCursor.inputVector(startXy[0], startXy[1], startXy[0]-dragDelta[0], startXy[1]-dragDelta[1])
            //    showDragToPoint(startXy[0]-dragDelta[0], startXy[1]-dragDelta[1]);

                for (i = 0; i < currentTargets.length; i++) {
					currentTargets[i].onControlActive();
                    currentTargets[i].setDragValue(dragDelta);
                }

                dragX = dragDelta[0];
                dragY = dragDelta[1];
            } else if (currentHover.length != 0) {
            //    hover.style.opacity *=0.95;
				for (i = 0; i < currentHover.length; i++) {
					currentHover[i].onControlHover();
					currentHover[i].showControlState();
				}

            } else {

				if (pointerUpdated) {
					pointerUpdated = false;
					hintCount += 0.001*tpf;
				} else {

				}

				for (i = 0; i < widgets.length; i++) {
					widgets[i].onControlEnable();
				}

				for (i = 0; i < screenSelectionSufaces.length; i++) {
					if (screenSelectionSufaces[i].state == 1) {
						screenSelectionSufaces[i].showSelectionSurface([0.5, 0.7, 0.7, 0.3]);
						hintCount = 0;
					}
				}

				for (i = 0; i < screenSelectionSufaces.length; i++) {
					screenSelectionSufaces[i].showSelectionSurface([0.2, 0.4, 0.5, 0.5*hintCount]);
				}

				hintCount *= 1-0.002*tpf;

			}

        };

		var xy = [0,0];
		var pointerUpdated = false;
        var handleMouseXY = function(e) {
			xy = event.eventArgs(e).xy;
		};

		var processMouseFrame = function() {

            if (buttonDownTarget) {
				targets = readInputRectsAtXY(xy[0], xy[1]);
				var keepPressing = false;
				buttonDownTarget.showControlState();
				for (i = 0; i < targets.length; i++) {
					if (targets[i].data.axis == 2 && buttonDownTarget == targets[i]) {
						keepPressing = true;
						return;
					}
				}
				buttonDownTarget = null;

			} else if (sampleDrag || cameraDrag) {
				return;
			}

            targets = readInputRectsAtXY(xy[0], xy[1]);
            if (targets.length > 0) {
				currentHover = targets;
				hintCount = 0;
                for (var i = 0; i < targets.length; i++) {
					targets[i].onControlHover();
                }
            } else {
				pointerUpdated = true;
                currentHover = [];
            }
        };
		var targets = [];

		var ptX;
		var ptY;
		var nx;
		var ny;

		var readInputRectsAtXY = function(x, y) {
			ptX = x;
			ptY = y;
			guiLayers = pointerCursor.interactiveLayers;


			nx = pointerCursor.pxXtoPercentX(x);
			ny = pointerCursor.pxYtoPercentY(y);

			pointerCursor.moveTo(nx, ny, currentHover.length);

            targets = [];

			for (var index in guiLayers) {
				guiLayers[index].checkHoverHit(nx, ny, targets);
			}


			for (var i = 0; i < screenSelectionSufaces.length; i++) {
				if (screenSelectionSufaces[i].state == 1) {
					hintCount = 0;
					screenSelectionSufaces[i].checkHoverHit(nx, ny, targets);
					return targets;
				}
			}

			for (i = 0; i < screenSelectionSufaces.length; i++) {
				var state = screenSelectionSufaces[i].checkHoverHit(nx, ny, targets);
				if (state) return targets;
			}

			for (i = 0; i < widgets.length; i++) {
				widgets[i].checkHoverHit(nx, ny, targets)
			}

			return targets;
        };

		var buttonDownTarget;

        var setControlTargets = function(x, y){
            var targets = readInputRectsAtXY(x, y);
            currentTargets = [];
            for (var i = 0; i < targets.length; i++) {
                currentTargets.push(targets[i]);
                targets[i].beginValueManipulation();
				if (targets[i].data.axis == 2) buttonDownTarget = targets[i];
            }
            return currentTargets;
        };


        var handleStartPointerDrag = function(e) {
        //    if (!registered) return;
            dragX = 0;
            dragY = 0;
            startXy = event.eventArgs(e).xy;
	        currentTargets = setControlTargets(startXy[0], startXy[1]);
            if (currentTargets.length > 0) {
                sampleDrag = true;
            //    showStartDragPoint(startXy);
            }
        };

        var clearDragFeedback = function() {
			hintCount = 0;

			if (buttonDownTarget) {
				if (buttonDownTarget.state == 3) {
					buttonDownTarget.applyControlState(1);
					buttonDownTarget.onControlRelease();
				}
			}

            for (var index in currentTargets) {
				currentTargets[index].endValueManipulation();
            }
        };

        var handleStopPointerDrag = function(e) {
            if (sampleDrag) clearDragFeedback();
            sampleDrag = false;
        };

        var handleSetControlledEntity = function(controlledEntity) {
            pieceData = controlledEntity.pieceData;

            if (pieceData.onScreenInput) {
				loadControlTargets(controlledEntity, pieceData.onScreenInput);
            } else {
                registered = false;
            }
        };


        var handleStartCameraDrag = function() {
			hintCount = 0;
            cameraDrag = true;
            if (currentHover.length) {
            //    hover.style.display = 'none';
                currentHover = [];
            }
        };


        var handleStopCameraDrag = function() {
			hintCount = 0;
            cameraDrag = false;
        };

		var handleMouseAction = function(e) {


			if (currentHover.length) {
				if (event.eventArgs(e).xy[0] == 1) {
				//	currentHover.onInputActivate();
				} else {
				//	currentHover.onInputRelease();
					currentHover = [];
				}
			}

			pointerCursor.inputMouseAction(event.eventArgs(e).action, event.eventArgs(e).xy);
		};


		var PointerInputHandler = function(cursor) {
			pointerCursor = cursor;
			event.registerListener(event.list().MOUSE_ACTION, handleMouseAction);
			event.registerListener(event.list().MOUSE_POSITION_UPDATE, handleMouseXY);
			event.registerListener(event.list().START_POINTER_DRAG, handleStartPointerDrag);
			event.registerListener(event.list().STOP_POINTER_DRAG, handleStopPointerDrag);
			event.registerListener(event.list().START_CAMERA_DRAG, handleStartCameraDrag);
			event.registerListener(event.list().STOP_CAMERA_DRAG, handleStopCameraDrag);
		};


		PointerInputHandler.prototype.tickInput = function(time) {
			tickInput(time)
		};


		PointerInputHandler.prototype.setPlayerGamePiece = function(playerPiece) {
			handleSetControlledEntity(playerPiece);
		};

		PointerInputHandler.prototype.applyGuiWidgets = function(guiWidgetComposer) {
			loadControlTargets(guiWidgetComposer);
		};


		return PointerInputHandler;

    });