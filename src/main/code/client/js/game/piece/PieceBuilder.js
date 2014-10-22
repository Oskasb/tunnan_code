"use strict";

define([
    'application/EventManager',
	"game/piece/PieceConfigurator",
    "game/piece/PieceInput",
	"game/planes/Plane",
	'game/parts/Lights',
	'game/parts/Screens',
    "game/ControlsController",
	'game/controls/ControlStateCallbacks',
    '3d/GooLayerAnimator'
],
    function(
        event,
		PieceConfigurator,
        PieceInput,
		Plane,
		lights,
		screens,
        controlsController,
		ControlStateCallbacks,
        GooLayerAnimator
        ) {

		var addPieceInputSystems = function(gamePiece) {
			gamePiece.pieceInput = new PieceInput(gamePiece);

		//	for (var index in gamePiece.controls) {
		//		gamePiece.pieceInput.addPieceControl(index);
		//		gamePiece.pieceInput.registerOnChangeCallback(index, ControlStateCallbacks.getControlUpdateCallback(index));
		//	}
		};

		var buildHuman = function(gamePiece) {
			addPieceInputSystems(gamePiece);

			GooLayerAnimator.printEntityLayerMap(gamePiece);
		};

		function addSystemControls(gamePiece, systemData, ControlStateCallbacks) {
			for (var key in systemData.controls) {
	//			console.log("Add Control; ", key, systemData.controls[key])
				gamePiece.pieceInput.addPieceControl(key, systemData.controls[key], ControlStateCallbacks.getControlUpdateCallback(key))

			}
		}

		var buildPiece = function(gamePiece, data, landedState) {

		//	controlsController.buildPieceControls(gamePiece, data, landedState);

				if (data.lights) {
				//	lights.registerEntityLights(gamePiece, data.lights);
				}
				if (data.screens) {
				//	screens.registerEntityScreens(gamePiece, data.screens, ControlStateCallbacks);
				}

			gamePiece.forces.weight.setd(0, data.dimensions.massEmpty, 0);
		};

		var buildBoatPiece = function(gamePiece, data) {
		//	controlsController.buildPieceControls(gamePiece, data);
			addPieceInputSystems(gamePiece);
		};


		var buildPlane = function(id, data, state, planeReady) {

			var planeLoaded = function(plane) {
				addPieceInputSystems(plane.entity);


				var configReady = function() {
					buildPiece(plane.entity, data, state);
					console.log("BUILD PLANE:", plane);
					if (state == 1) {
						if (plane.entity.pieceInput.controls['flaps']) plane.entity.pieceInput.setInputState('flaps', 0.6);
						if (plane.entity.pieceInput.controls['breaks']) plane.entity.pieceInput.setInputState('breaks', 0.5);
					}
					planeReady(plane);
				};

				if (data.lights) {
			//		lights.registerEntityLights(plane.entity, data.lights);
				}

				console.log("request config piece: ", plane.entity.id);
				PieceConfigurator.configurePiece(plane, state, configReady);
			};

			new Plane(id, data, planeLoaded);

		};

		return {
			buildHuman:buildHuman,
			buildBoatPiece:buildBoatPiece,
			buildPiece:buildPiece,
			buildPlane:buildPlane
		}
	});
