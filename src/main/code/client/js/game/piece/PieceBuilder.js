"use strict";

define([
    'application/EventManager',
	"game/ships/BoatFactory",
	"game/piece/PieceConfigurator",
    "game/piece/PieceInput",
	"game/planes/Plane",
	'game/parts/Lights',
	'game/parts/Screens',
    "game/ControlsController",
	'game/controls/ControlStateCallbacks',
    '3d/GooLayerAnimator',
	'data_pipeline/PipelineAPI'
],
    function(
        event,
		BoatFactory,
		PieceConfigurator,
        PieceInput,
		Plane,
		lights,
		screens,
        controlsController,
		ControlStateCallbacks,
        GooLayerAnimator,
		PipelineAPI
        ) {

		var pieceData = {
			vehicles:{},
			characters:{}
		};

		var pieceDataUpdated = function(srcKey, data) {
			if (!pieceData[srcKey]) {
				pieceData[srcKey] = {};
			}
			for (var i = 0; i < data.length; i++) {
				pieceData[srcKey][data[i].id] = data[i];
			}
		};

		PipelineAPI.subscribeToCategoryKey('game_pieces', 'vehicles', pieceDataUpdated);
		PipelineAPI.subscribeToCategoryKey('game_pieces', 'characters', pieceDataUpdated);

		var addPieceInputSystems = function(gamePiece) {
			gamePiece.pieceInput = new PieceInput(gamePiece);
		};

		var buildHuman = function(gamePiece) {


			var configReady = function() {
				addPieceInputSystems(gamePiece.entity);
				GooLayerAnimator.printEntityLayerMap(gamePiece.entity);
				console.log("HUMAN BUILT:", gamePiece);
			};

		//	PieceConfigurator.configurePiece(gamePiece, 0, configReady);
			configReady();
		};

		function addSystemControls(gamePiece, systemData, ControlStateCallbacks) {
			for (var key in systemData.controls) {
	//			console.log("Add Control; ", key, systemData.controls[key])
				gamePiece.pieceInput.addPieceControl(key, systemData.controls[key], ControlStateCallbacks.getControlUpdateCallback(key))

			}
		}

		var buildPiece = function(gamePiece, data, landedState) {

			gamePiece.forces.weight.setDirect(0, data.dimensions.massEmpty, 0);
		};

		var buildBoatPiece = function(name, dataKey, boatSpawned) {

			var boatBuilt = function(boat) {
				addPieceInputSystems(boat.entity);
				boatSpawned(boat);
			};

			var pieceDataUpdated = function(srcKey, data) {
				BoatFactory.buildShip(name, data, boatBuilt);
			};

			var baseDataKey = pieceData.vehicles[dataKey].base_data_key;
			PipelineAPI.subscribeToCategoryKey('piece_data', baseDataKey, pieceDataUpdated)
		};


		var buildPlane = function(id, planeId, state, planeReady) {

			var planeLoaded = function(entity) {
				plane.entity = entity;
				addPieceInputSystems(plane.entity);


				var configReady = function() {
					buildPiece(plane.entity, plane.entity.pieceData, state);
					console.log("BUILD PLANE:", plane);
					if (state == 1) {
						if (plane.entity.pieceInput.controls['flaps']) plane.entity.pieceInput.setInputState('flaps', 0.6);
						if (plane.entity.pieceInput.controls['breaks']) plane.entity.pieceInput.setInputState('breaks', 0.5);
					}
					planeReady(plane);
				};

				console.log("request config piece: ", plane.entity.id);
				PieceConfigurator.configurePiece(plane, state, configReady);
			};

			var plane = new Plane(id);
			var pieceDataUpdated = function(srcKey, data) {
				plane.gamePiece.applyPieceData(data, planeLoaded);
			};

			var baseDataKey = pieceData.vehicles[planeId].base_data_key;
			PipelineAPI.subscribeToCategoryKey('piece_data', baseDataKey, pieceDataUpdated)
		};

		return {
			buildHuman:buildHuman,
			buildBoatPiece:buildBoatPiece,
			buildPiece:buildPiece,
			buildPlane:buildPlane
		}
	});
