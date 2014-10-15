"use strict";

define(["load/ClientLoader",
    "3d/EnvironmentController",
    "application/EventManager",
	"load/TrackProgress",
    'game/world/LevelController',
	'game/GameConfiguration',
	'game/scenario/ScenarioStateTracker',
	"game/scenario/ScenarioDefinitions"
],
    function(clientLoader,
             environmentController,
             event,
			 TrackProgress,
             levelController,
			 GameConfiguration,
			 ScenarioStateTracker,
			 ScenarioDefinitions
		)
    {

        var scenario;

		var ScenarioSelector = function(goo, clientLoader) {
			this.goo = goo;
			this.clientLoader = clientLoader;

			var selected = function(e) {
				this.handleScenarioSelected(e)
			}.bind(this);
			event.registerListener(event.list().SCENARIO_SELECTED, selected);

		};

		ScenarioSelector.prototype.resetScenario = function(resetCallback) {

			var initLevelCallback = function() {
				levelController.addPlayerToLevel(resetCallback);
			};

			event.fireEvent(event.list().SCENARIO_LOADED, {callback:initLevelCallback});
		};

		ScenarioSelector.prototype.loadScenario = function(scen) {

			scenario = scen;

			console.log("Init scenario Load: ", scenario);

			var almostThere = false;

			event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'scenario_init'});
			event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'data_loaded'});
			event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'load_env'});
			event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'terrain_loaded'});
			var goo = this.goo;
			var _this = this;
			function dataLoaded() {

				if (almostThere) return;
				console.log("Track Progress says ", TrackProgress.getLoadedCount());
				if (TrackProgress.getLoadedCount().started - TrackProgress.getLoadedCount().finished <= 1) {
					almostThere = true;
					clearInterval(statusCheck);
					console.log("Track Progress says almostThere!");


						var resetCallback = function() {

							var callback = function() {
								event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'game_loop'});
							};

							clientLoader.loadBaseProject(GameConfiguration.GOO_PROJECTS.environment, callback);
						};
						_this.resetScenario(resetCallback);

				}

				//	event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0});
				//	goo.world.process();
				//	event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0});
			}

			var statusCheck = setInterval(function() {
				dataLoaded()
			}, 50)

			//	event.registerListener(event.list().LOAD_PROGRESS, dataLoaded);

			function envCallback() {
				event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'load_env'});
				event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'load_scenario_data'});
			}

			function scenarioCallback() {
				console.log("Terrains image loaded callback")
				event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'data_loaded'});

				environmentController.loadEnvironment(envCallback);
				event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'game_loop'});
			}

			levelController.registerScenario(scenario);


			event.registerListener(event.list().LOADING_ENDED, handleScenarioDataReady);
			var addScenario = function() {
				console.log("Terrains added callback")
				//
				event.removeListener(event.list().SCENARIO_SELECTED);
				event.fireEvent(event.list().ANALYTICS_EVENT, {category:"SCENARIO SELECT", action:scenario.IDENTITY.title, labels:scenario.IDENTITY.tagLine, value:1})

			};

			environmentController.loadScenarioEnvironment(this.goo, scenario, addScenario, scenarioCallback);

		};

		ScenarioSelector.prototype.handleScenarioSelected = function(e) {
			var loaded = function(result) {
				console.log("Load result: ", result)
				this.loadScenario(event.eventArgs(e).scenario)
			}.bind(this);

			this.clientLoader.loadScenarioData(event.eventArgs(e).scenario, loaded);
		};

		ScenarioSelector.prototype.openScenarioScreen = function() {

			/*
			var selected = function(e) {
				this.handleScenarioSelected(e)
			}.bind(this);

			event.fireEvent(event.list().LOAD_UI_TEMPLATE, {templateId:"UI_SCENARIOS"});
			event.registerListener(event.list().SCENARIO_SELECTED, selected);

			var resetScen = function(resetOk) {
				this.goo.world.process();
				this.resetScenario(resetOk);
			}.bind(this);

			var unloadScenario = function() {


				var resetOk = function() {
					console.log("Scenario reset OK")
				};

				var cb = function() {
					setTimeout(function() {
						resetScen(resetOk)
					}, 225)
				};

				//    var exitCb = function() {
				setTimeout(function() {
					event.fireEvent(event.list().UN_LOAD_3D, {callback:cb});
				}, 60)

				//	};

			//	event.fireEvent(event.list().EXIT_CONTROLLED_ENTITY, {callback:exitCb});
			}

			event.registerListener(event.list().EXIT_SCENARIO, unloadScenario);
                                           */
			this.clientLoader.clientLoaded();
		};

		var handleScenarioSelect = function(e) {
		//	console.log("Scen: ", event.eventArgs(e).scenarioId)

			event.fireEvent(event.list().SCENARIO_SELECTED, {scenario:ScenarioDefinitions.SCENARIOS[event.eventArgs(e).scenarioId]});
		};

		event.registerListener(event.list().START_SCENARIO_ID, handleScenarioSelect);

        function handleScenarioDataReady() {
            event.removeListener(event.list().LOADING_ENDED);
        }

        return ScenarioSelector
    });
