"use strict";

define(["application/EventManager",
    "sound/SoundManager",
    "load/TrackProgress",
    "game/GameConfiguration",
    "game/ships/BoatData",
    "game/cars/CarData",
    "game/piece/TargetData",
    "game/planes/PlaneData",
    "game/characters/CharacterData",
    'game/world/ZoneData',
	'data_pipeline/PipelineAPI'
],
    function(event,
             soundManager,
             trackProgress,
             gameConfig,
             boatData,
             carData,
             targetData,
             planeData,
             characterData,
             zoneData,
			 PipelineAPI) {


		var ClientLoader = function() {

			this.loadedEntities = {};
			this.callbackIndex = {};

			var handleBuildPiece = function(e) {
				var callback = event.eventArgs(e).callback;
				var pieceName = event.eventArgs(e).modelPath;


				var buildEntity = function(eName) {
					var buildFunc = this.loadedEntities[eName].build;
					return function() {
						buildFunc(eName, callback);
					}
				}.bind(this);

				if (!this.callbackIndex[pieceName]) {
					this.callbackIndex[pieceName] = [];
				}

				this.callbackIndex[pieceName].push(buildEntity(pieceName));
				buildEntity(pieceName)();
			}.bind(this);

			event.registerListener(event.list().BUILD_GOO_GAMEPIECE, handleBuildPiece);
			this.preloadClientData();
		};

		ClientLoader.prototype.handleBundleUpdated = function(entityName) {

			if (!this.callbackIndex[entityName]) {
				this.callbackIndex[entityName] = [];
			}
			for (var i = 0; i < this.callbackIndex[entityName].length; i++) {
				console.log("BundleData updated", entityName);
				this.callbackIndex[entityName][i](entityName)
			}

		};

		ClientLoader.prototype.initBundleData = function(path, goo, srcUrl, downloadOk, fail) {

			var notifyLoaderProgress = function(handled, started) {
				console.log("DL Progress update: ", handled, started)
			};

			var assetUpdated = function(entityName, data) {
				this.loadedEntities[entityName] = data;
				this.handleBundleUpdated(entityName);
				downloadOk(entityName, data);
			}.bind(this);
			PipelineAPI.initBundleDownload(path, goo, srcUrl, assetUpdated, fail, notifyLoaderProgress);
		};


		ClientLoader.prototype.runGooPipeline = function(path, goo, bundleMasterUrl) {
			var bundlesReady = function(sourceKey, res) {
				console.log("Bundle update OK", sourceKey, res);
			};

			var bundleFail = function(err) {
				console.error("Bundle update FAIL:", err);
			};

			var bundles = function() {
				this.initBundleData(path, goo, bundleMasterUrl, bundlesReady, bundleFail);
			}.bind(this);

			setTimeout(function(){
				bundles()
			}, 100)

		};

		ClientLoader.prototype.preloadClientData	= function() {
			soundManager.initSounds();
			soundManager.loadSounds();
		};

		ClientLoader.prototype.clientLoaded			= function() {
			soundManager.initFx();
		};

        return {
			ClientLoader:ClientLoader
        };

    });