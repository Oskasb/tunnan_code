"use strict";


define([
    "load/ClientLoader",
    "io/InputSettersGetters",
    "application/EventManager",
	"application/PerfMon",
    "game/GameController",
    "game/GameConfiguration",
    "application/UpdateLoop",
    "application/DeviceHandler",
    'game/scenario/ScenarioSelector'
],
    function(
        clientLoader,
        inputSettersGetters,
        event,
		PerfMon,
        GameController,
        gameConfig,
        UpdateLoop,
        deviceHandler,
		ScenarioSelector
        ) {

		var bundleMasterUrl = 'configs/bundles/bundle_list.json';
		var guiRegUrl = 'configs/config_urls.json';
		var resourcePath = '../../../../../../';

		var Client = function() {

		};

		Client.prototype.initiateClient = function(gooController) {
			this.now = new Date().getTime();
			this.gooController = gooController;
			this.gooController.setupGooRunner();
			this.clientLoader = new clientLoader.ClientLoader();
			this.scenarioSelector = new ScenarioSelector(this.gooController.goo, this.clientLoader);
			this.gameController = new GameController();
			inputSettersGetters.setGuiApi(this.gameController.canvasGuiAPI);
			this.updateLoop = new UpdateLoop();
			this.perfMon = new PerfMon(this.gooController, this.gameController);
			this.preload();
		};

		Client.prototype.propagateGoo = function(goo) {
			this.gooController.propagateGoo();
		};

		Client.prototype.preload = function() {
			var completed = function() {
				this.preloadCompleted();
				this.propagateGoo();
			}.bind(this);

			var setupOk = function() {
				this.clientSetupCompleted();
			}.bind(this);

			event.registerListener(event.list().LOADING_COMPLETED, completed);
			event.registerListener(event.list().CLIENT_SETUP_OK, setupOk);
		//	this.clientLoader.preloadClientData(gameConfig.GAME_IDENTITY);
		};



		Client.prototype.clientSetupCompleted = function() {
			deviceHandler.handleClientSetupDone();
		//
		};

		Client.prototype.preloadCompleted = function() {
			event.removeListener(event.list().LOADING_COMPLETED);

			this.initiateView();
		};



		Client.prototype.initiateView = function() {
		//	var viewReady = function() {

			var loadingProgressDone = function() {
				console.log("loading ok")
				this.loadingCompleted();
			}.bind(this);

			this.scenarioSelector.openScenarioScreen();
			event.fireEvent(event.list().LOAD_3D, {});
				var handleGooTick = function(tpf) {
					this.tickClient(tpf)
				}.bind(this);





			this.gooController.goo.startGameLoop();

				var checkCamera = function() {
					console.log("Look for ready")

					if (this.gooController.gooCameraController.getCamera()) {
						this.gameController.setupGame();
						this.gooController.registerGooUpdateCallback(handleGooTick);
						this.gameController.addCanvasGui(this.gooController.gooCameraController.getCamera(), guiRegUrl);
						this.clientLoader.runGooPipeline(resourcePath, this.gooController.goo, bundleMasterUrl, loadingProgressDone);
					} else {
						lookForReady();
					}
				}.bind(this);

				var lookForReady = function() {
					setTimeout(function() {
						checkCamera()
					}, 100)
				};
				lookForReady();

		};

		Client.prototype.tickClient = function(tpf) {
			this.now += tpf;
			this.perfMon.updateMonitorFrame(tpf);
			this.gameController.tickGame(tpf*1000);
			event.fireEvent(event.list().RENDER_TICK, {frameTime:this.now, lastFrameDuration:tpf*1000});
		    this.gooController.updateWorld();
			this.gameController.tickGui(tpf);
		};

		Client.prototype.loadingCompleted = function() {
			 this.gameController.gameLoadingCompleted()


			event.removeListener(event.list().LOADING_COMPLETED);
			event.fireEvent(event.list().CLIENT_READY, {});

			event.fireEvent(event.list().CLIENT_SETUP_OK, {});



		};

		return Client;

});