"use strict";

define(["application/EventManager",
	"goo/entities/SystemBus",
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
			 SystemBus,
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

			this.cacheLoadStarted = 0;
			this.cacheLoadRemaining = 0;
			this.cacheLoadCompleted = 0;
			this.notYetLoadedUrls = [];

			this.setupCacheLoadListener();

			this.startedLoadCount = 0;
			this.completedLoadCount = 0;

			this.loadedEntities = {};
			this.callbackIndex = {};

			this.bundleHandled = 0;
			this.bundleTotal = 0;
			this.completeCheckTimeout = null;
			this.setupBundleLoader();

			this.preloadClientData();

		};

		ClientLoader.prototype.setupCacheLoadListener = function() {

			var cacheProgressUpdate = function(started, remaining, loaded, remainingUrls) {
				this.cacheLoadStarted = started;
				this.cacheLoadRemaining = remaining;
				this.cacheLoadCompleted = loaded;
				this.notYetLoadedUrls = remainingUrls;
				this.emitProgressState();
			}.bind(this);

			PipelineAPI.addProgressCallback(cacheProgressUpdate)

		};


		ClientLoader.prototype.emitProgressState = function() {
			SystemBus.emit('data_source_update', {
				dataSource:'loadState',
				data:{
					progress:this.bundleTotal - this.bundleHandled + this.cacheLoadRemaining,
					started:this.startedLoadCount + this.cacheLoadStarted,
					completed:this.completedLoadCount + this.cacheLoadCompleted
				}
			});

			var message =[
				'Progress: '+(this.startedLoadCount - this.completedLoadCount + this.cacheLoadRemaining),
				'CacheInit: '+this.cacheLoadStarted,
				'Cached OK: '+this.cacheLoadCompleted,
				'Progress:  '+this.cacheLoadRemaining,
				'Ent Init:  '+this.startedLoadCount,
				'Ent Done:  '+this.completedLoadCount,
				'Substep T: '+this.bundleTotal,
				'Substep H: '+this.bundleHandled,
			];


			SystemBus.emit("message_to_gui", {channel:"system:channel", message:this.notYetLoadedUrls});
			SystemBus.emit("message_to_gui", {channel:"data_validation_update_channel", message:message});
		//	console.log( this.notYetLoadedUrls, message)
		};

		ClientLoader.prototype.notifyUpdate = function(onLoadingCompleted) {

			this.emitProgressState();

			if (onLoadingCompleted && !this.onLoadCompleted) {
				this.onLoadCompleted = onLoadingCompleted;
			}

			var delayedProgressCheck = function() {
				if (this.startedLoadCount - this.completedLoadCount + this.cacheLoadRemaining == 0) {

					if (typeof(this.onLoadCompleted) == 'function') {
						this.onLoadCompleted();
						this.onLoadCompleted = null;
					}
				}
			}.bind(this);

			if (this.startedLoadCount - this.completedLoadCount == 0) {
				clearTimeout(this.completeCheckTimeout);
				this.completeCheckTimeout = setTimeout(function() {
					delayedProgressCheck();
				}, 1750);
			}


		};

		ClientLoader.prototype.setupBundleLoader = function() {

			var handleBuildPiece = function(e) {
				var callback = event.eventArgs(e).callback;
				var pieceName = event.eventArgs(e).modelPath;
				PipelineAPI.cloneLoadedGooEntity(pieceName, callback);
			};

			event.registerListener(event.list().BUILD_GOO_GAMEPIECE, handleBuildPiece);

		};

		ClientLoader.prototype.handleBundleUpdated = function(entityName) {

			this.notifyUpdate();
			// apply this check for level loading instead
			return;
			if (!this.callbackIndex[entityName]) {
				this.callbackIndex[entityName] = [];
			}

			var readyForWorld = function(entity) {
				console.log("Count ready: ", entity.name);
				this.completedLoadCount++;
				this.notifyUpdate();
			}.bind(this);

			var entityReady = function(ent) {
				readyForWorld(ent);
			};

			var buildEntity = function(eName) {
				var buildFunc = this.loadedEntities[eName].build;
				return function() {
					buildFunc(eName, entityReady);
				}
			}.bind(this);

			this.callbackIndex[entityName].push(buildEntity(entityName));

			for (var i = 0; i < this.callbackIndex[entityName].length; i++) {
				console.log("Count started: ", entityName);
				this.startedLoadCount++;
				this.notifyUpdate();
				this.callbackIndex[entityName][i]();
			}
		};

		ClientLoader.prototype.initBundleData = function(path, goo, srcUrl, downloadOk, fail) {

			var notifyLoaderProgress = function(handled, total) {
				this.bundleHandled = handled;
				this.bundleTotal = total;
				this.notifyUpdate();
			}.bind(this);

			var assetUpdated = function(entityName, data) {
				this.loadedEntities[entityName] = data;
				this.handleBundleUpdated(entityName);
				downloadOk(entityName, data);
			}.bind(this);
			PipelineAPI.initBundleDownload(path, goo, srcUrl, assetUpdated, fail, notifyLoaderProgress);
		};


		ClientLoader.prototype.runGooPipeline = function(path, goo, bundleMasterUrl, loadingProgressDone) {
			var bundlesReady = function(sourceKey, res) {

				console.log("Bundle update OK", sourceKey, res);
			}.bind(this);

			var bundleFail = function(err) {
				console.error("Bundle update FAIL:", err);
			};

			var bundles = function() {
				this.notifyUpdate(loadingProgressDone);
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