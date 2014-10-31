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
			var goo = this.goo;

		//	goo.world.processEntityChanges();
			var initLevelCallback = function() {


				goo.renderer.preloadBuffers(goo.renderSystem._activeEntities);
				goo.renderer.preloadMaterials(goo.renderSystem._activeEntities);
				goo.renderer.precompileShaders(goo.renderSystem._activeEntities, goo.renderSystem.lights);

				levelController.addPlayerToLevel(resetCallback);



				setTimeout(function() {
					goo.startGameLoop();
				}, 100)

			};

			event.fireEvent(event.list().SCENARIO_LOADED, {callback:initLevelCallback});
		};

		ScenarioSelector.prototype.loadScenario = function(scen) {
			this.goo.stopGameLoop();
			scenario = scen;

			console.log("Init scenario Load: ", scenario);

			var almostThere = false;

			event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'data_loaded'});
			event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'load_env'});
		//	event.fireEvent(event.list().LOAD_PROGRESS, {started:1, completed:0, errors:0, id:'terrain_loaded'});
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

								event.fireEvent(event.list().LOAD_PROGRESS, {started:0, completed:1, errors:0, id:'game_loop'});

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
			this.loadScenario(event.eventArgs(e).scenario)
		};

		ScenarioSelector.prototype.openScenarioScreen = function() {

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
