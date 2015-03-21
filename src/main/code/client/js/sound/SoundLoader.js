"use strict";

define(["sound/SoundList",
    "sound/SourceFactory",
    "load/TrackProgress"],
    function(soundList,
             sourceFactory,
             trackProgress) {

        var context;
		var preloadQueue = [];
		var lazyQueue = [];

        var completionCallback = function(started, finiehd, error, file) {
            trackProgress.loadingProgress(0, 1, 0, file);
        };

        var initSoundSystem = function() {
            context = sourceFactory.runSourceFactoryConfig();
        };

		var loadSoundItem = function(listSound, callback) {
			sourceFactory.addSourceToSound(listSound, callback, listSound.file);
		};

		var loadSoundQueue = function(soundQueue, progressCallback, queueCallback) {

			var loadNext = function(queue) {
				if (queue.length == 0) {
					queueCallback();
					return;
				}

				var onSoundLoaded = function(started, finished, error, file) {
					progressCallback(started, finished, error, file);
					   setTimeout(function() {
						   loadNext(queue);
					   }, 100)

				};

				var soundItem = queue.pop();
				loadSoundItem(soundItem, onSoundLoaded)
			};

			loadNext(soundQueue);
		};


        var loadSoundList = function() {
            console.log("Load Sound List: ", soundList)

            for (var keys in soundList) {
                if (soundList[keys].options.preload) {
					trackProgress.loadingProgress(1, 0, 0, soundList[keys].file);
					preloadQueue.push(soundList[keys]);
                } else {
					lazyQueue.push(soundList[keys]);
				}

            }

			var progressCallback = function(started, finished, error, file) {
				completionCallback(started, finished, error, file)
				if (error) console.log("Sound Loading Error", file);
			};


			var queueCallback = function() {
				return
				var lazyEntryCB = function(started, finished, error, file) {
					console.log("Lazy sound loaded: ", started, finished, error, file)
				};

				var lazyQueueCB = function() {
					console.log("Lazy Queue Loading Done")
				};

				loadSoundQueue(lazyQueue, lazyEntryCB, lazyQueueCB)
			};

			loadSoundQueue(preloadQueue, progressCallback, queueCallback);


        };

        var getPlayerContext = function() {
            return context;
        };

        return {
			loadSoundItem:loadSoundItem,
            initSoundSystem:initSoundSystem,
            loadSoundList:loadSoundList,
            getPlayerContext:getPlayerContext
        }

    });