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
				var entityClone = this.loadedEntities[pieceName].build();

				this.callbackIndex[pieceName].push(callback);

				callback(entityClone);
			}.bind(this);



			event.registerListener(event.list().BUILD_GOO_GAMEPIECE, handleBuildPiece);
			this.preloadClientData();
		};

		ClientLoader.prototype.handleBundleUpdated = function(srcKey) {

			if (!this.callbackIndex[srcKey]) {
				this.callbackIndex[srcKey] = [];
			}
			for (var i = 0; i < this.callbackIndex[srcKey].length; i++) {
				console.log("BundleData updated", srcKey);
				this.callbackIndex[srcKey][i](this.loadedEntities[srcKey].build())
			}

		};

		ClientLoader.prototype.initBundleData = function(path, goo, srcUrl, downloadOk, fail) {

			var assetUpdated = function(srcKey, data) {
				this.loadedEntities[srcKey] = data;
				this.handleBundleUpdated(srcKey);
				downloadOk(srcKey, data);
			}.bind(this);
			PipelineAPI.initBundleDownload(path, goo, srcUrl, assetUpdated, fail);
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