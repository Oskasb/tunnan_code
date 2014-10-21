"use strict";

define([
	'data_pipeline/PipelineAPI',
	'gui/layout/GuiConstants',
	'game/ControlsController',
	'game/controls/ControlStateCallbacks',
	'game/parts/Screens',
	'game/parts/Lights',
	'game/player/PlayerInstruments'
],
	function(
		PipelineAPI,
		GuiConstants,
		ControlsController,
		ControlStateCallbacks,
		Screens,
		Lights,
		PlayerInstruments
		) {

		var PieceConfigurator = function() {

		};


		var countdown = 7;


		PieceConfigurator.applyModelRelatedConfigs = function(gamePiece, config) {
			var display_settings = gamePiece.entity.pieceData.configs.display_settings;



		};



		PieceConfigurator.applyConfigData = function(gamePiece, config, state, pieceInitiated) {
			var controlSystemKey = gamePiece.entity.pieceData.configs.control_settings;
			var controlSurfaceKey = gamePiece.entity.pieceData.configs.control_surfaces;
			var wingsKey = gamePiece.entity.pieceData.configs.wing_shapes;
			var systemsKey = gamePiece.entity.pieceData.configs.piece_systems;
			var display_settings = gamePiece.entity.pieceData.configs.display_settings;
			var light_systems = gamePiece.entity.pieceData.configs.light_systems;
			var instruments = gamePiece.entity.pieceData.configs.instruments;

			console.log("Apply config to piece: ", config, gamePiece);


			var ready = false;
			var configsApplied = function(key) {
				console.log("Applied ", key);
				countdown--;
				if (countdown == 0) {
					gamePiece.entity.pieceInput.applySystemConfigs(gamePiece.configs[controlSystemKey]);
					pieceInitiated();
				}

			};

			if (config[instruments]) {
				gamePiece.configs[instruments] = config[instruments];
				PlayerInstruments.initInstruments(gamePiece.entity, config[instruments], config['instrument_curves']);
				configsApplied(instruments);
			}


			if (config[light_systems]) {
				gamePiece.configs[light_systems] = config[light_systems];
				Lights.registerEntityLights(gamePiece.entity, config[light_systems], config['meshData'], config['patterns']);
				configsApplied(light_systems);
			}

			if (config[display_settings]) {
				gamePiece.configs[display_settings] = config[display_settings];

				Screens.registerEntityScreens(gamePiece.entity, config[display_settings], config['meshData']);

				configsApplied(controlSystemKey);
			}

			if (config[controlSystemKey]) {
				gamePiece.configs[controlSystemKey] = config[controlSystemKey];
				configsApplied(controlSystemKey);
			}

			if (config[controlSurfaceKey]) {
				gamePiece.configs[controlSurfaceKey] = config[controlSurfaceKey];
				ControlsController.addSurfacesToEntity(gamePiece.entity, config[controlSurfaceKey]);
				configsApplied(controlSurfaceKey);
			}

			if (config[systemsKey]) {
				gamePiece.configs[systemsKey] = config[systemsKey];
				ControlsController.addSystemsToEntity(gamePiece.entity, config[systemsKey], state);
				configsApplied(systemsKey);
			}

			if (config[wingsKey]) {

			//	gamePiece.entity.pieceInput.applySystemConfigs(config[wing_controlKey]);
				gamePiece.configs[wingsKey] = config[wingsKey];
				var applyAerodynamics = function(srcKey, aerodynamics) {
					var wingData = GuiConstants.clone(config[wingsKey]);
					var aeroData = GuiConstants.clone(aerodynamics);
					gamePiece.addWings(wingData, aeroData);
					configsApplied(wingsKey);
				};

				PipelineAPI.subscribeToCategoryKey('game_data', 'aerodynamic_curves', applyAerodynamics);
			}





		};


		PieceConfigurator.configurePiece = function(gamePiece, state, configReady) {
			gamePiece.configs = {};
			var pieceInitiated = function() {
				configReady()
			};

			var applyConfig = function(srcKey, data) {
				console.log("Apply :: ", srcKey, data);
				PieceConfigurator.applyConfigData(gamePiece, data, state, pieceInitiated);
			};

			for (var i = 0; i <  gamePiece.entity.pieceData.configs.dataKeys.length; i++) {
				console.log("PieceSubscribe to: ", gamePiece.entity.pieceData.configs.dataKeys[i]);
				PipelineAPI.subscribeToCategoryKey('piece_data', gamePiece.entity.pieceData.configs.dataKeys[i], applyConfig);
			}

		};

		return PieceConfigurator;

	});