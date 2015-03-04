"use strict";

define(["sound/SoundList",
    "sound/SourceFactory",
    "load/TrackProgress"],
    function(soundList,
             sourceFactory,
             trackProgress) {

        var context;

        var completionCallback = function(started, finiehd, error, file) {
            trackProgress.loadingProgress(0, 1, 0, file);
        };

        var initSoundSystem = function() {
            context = sourceFactory.runSourceFactoryConfig();
        };

        var loadSoundList = function() {
            console.log("Load Sound List: ", soundList)
            for (var keys in soundList) {
                var callback = function(started, finished, error) {
                    if (error) console.log("Sound Loading Error");
                };
                if (soundList[keys].options.preload) {
                    trackProgress.loadingProgress(1, 0, 0, soundList[keys].file);
                    callback = completionCallback;
                } else {
					console.log("Not preloading: ", soundList[keys].file)
				}
                sourceFactory.addSourceToSound(soundList[keys], callback, soundList[keys].file);

            }
        };

        var getPlayerContext = function() {
            return context;
        };

        return {
            initSoundSystem:initSoundSystem,
            loadSoundList:loadSoundList,
            getPlayerContext:getPlayerContext
        }

    });