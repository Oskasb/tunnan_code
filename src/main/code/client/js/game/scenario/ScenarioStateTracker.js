"use strict";

define(["load/ClientLoader",
	"3d/EnvironmentController",
	"application/EventManager",
	"load/TrackProgress",
	'game/world/LevelController',
	'game/GameConfiguration'
],
	function(clientLoader,
			 environmentController,
			 event,
			 TrackProgress,
			 levelController,
			 GameConfiguration
		)
	{

		var ScenarioStateTracker = function(scenario) {
			this.scenario = scenario;
			this.initOk = false;
			this.gamePieceOk = false;
			this.addPlayerOk = false;
		};

		ScenarioStateTracker.prototype.initLoading = function(callback) {
			this.initLoadingCallback = callback;
		};

		ScenarioStateTracker.prototype.initOk = function() {
			this.initOk = true;
			this.initLoadingCallback();
		};

		ScenarioStateTracker.prototype.setupGamePieces = function(callback) {
			this.setupGamePiecesCallback = callback;
		};

		ScenarioStateTracker.prototype.gamePiecesOk = function() {
			this.gamePieceOk = true;
			this.setupGamePiecesCallback();
		};

		ScenarioStateTracker.prototype.addPlayer = function(callback) {
			this.addPlayerCallback = callback;
		};

		ScenarioStateTracker.prototype.addPlayerOk = function() {
			this.addPlayerOk = true;
			this.addPlayerCallback();
		};

		return ScenarioStateTracker;

	});