"use strict";

define(["sound/SoundLoader",
	"sound/SoundPlayer",
    "application/EventManager",
    'sound/EffectTrack']
    ,function(soundLoader,
			  SoundPlayer,
              event,
              EffectTrack) {

    var soundDisabledSettingId = "soundDisable";
    var soundsLoaded;

    var loadSounds = function() {
    //    if (settingsController.readSetting(soundDisabledSettingId)) return;
        console.log("Load Sounds");
        if (!soundsLoaded) {
            requestSoundLoad();
            soundsLoaded = true;
        }
    };

    var initFx = function() {
        EffectTrack.setupFxTrack();
    };

    var initSounds = function() {
		console.log("Init sound system", window.AudioContext);
        soundLoader.initSoundSystem();
    };

    var requestSoundLoad = function() {
        soundLoader.loadSoundList();
    };

    var handleSettingChanged = function(e) {
        var args = event.eventArgs(e);
        var settingId = args.settingId;
        if (settingId == soundDisabledSettingId) {
            loadSounds();
        }
    //    var value = args.value;
    };


    if (!window.performance) window.performance = {};
    performance.now = (function() {
        return performance.now       ||
            performance.mozNow    ||
            performance.msNow     ||
            performance.oNow      ||
            performance.webkitNow ||
            function() {
                //Doh! Crap browser!
                return new Date().getTime();
            };
    })();

    var handleFetchTime = function(e) {
        var callback = event.eventArgs(e).callback;
        callback(performance.now())
    };

    event.registerListener(event.list().FETCH_TIME, handleFetchTime);

    event.registerListener(event.list().SET_SETTING_INDEX, handleSettingChanged);

    return {
        loadSounds:loadSounds,
        initSounds:initSounds,
        initFx:initFx
    }

});
