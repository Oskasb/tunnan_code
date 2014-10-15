"use strict";

define([
	'data_pipeline/PipelineAPI',
	'gui/layout/GuiConstants'
],
	function(
		PipelineAPI,
		GuiConstants
		) {

		var PieceConfigurator = function() {

		};



		PieceConfigurator.applyConfigData = function(gamePiece, config) {
			var systemKey = gamePiece.entity.pieceData.configs.systems;
			var wingsKey = gamePiece.entity.pieceData.configs.wings;
			console.log("Apply config to piece: ", config, systemKey, wingsKey, gamePiece);

			if (config[systemKey]) {
				gamePiece.entity.pieceInput.applySystemConfigs(config[systemKey]);
			}


			if (config[wingsKey]) {

				var applyAerodynamics = function(aerodynamics) {
					var wingData = GuiConstants.clone(config[wingsKey]);
					var aeroData = GuiConstants.clone(aerodynamics);
					gamePiece.addWings(wingData, aeroData);
				};

				PipelineAPI.subscribeToCategoryKey('game_data', 'aerodynamic_curves', applyAerodynamics);
			}


		};


		PieceConfigurator.configurePiece = function(gamePiece) {
			var applyConfig = function(data) {
				PieceConfigurator.applyConfigData(gamePiece, data);
			};

			for (var i = 0; i <  gamePiece.entity.pieceData.configs.dataKeys.length; i++) {
				PipelineAPI.subscribeToCategoryKey('piece_data', gamePiece.entity.pieceData.configs.dataKeys[i], applyConfig);
			}

		};

		return PieceConfigurator;

	});