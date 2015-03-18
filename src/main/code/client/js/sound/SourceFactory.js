define(["io/Requests", "io/Send","application/EventManager"], function(requests, send, event) {
    "use strict";

    var path = window.resourcePath+"sounds/";
    var codec;
    var audioModel;
    var context;

    var getCodec = function() {
        return codec;
    };

    var determineCodec = function() {
        if (!Audio in window) {
            alert("Browser does not support sounds.");
            return "";
        }

        var audio = new Audio();

        var canPlayOgg = !!audio.canPlayType && audio.canPlayType('audio/ogg') !== "";
        var canPlayMp3 = !!audio.canPlayType && audio.canPlayType('audio/mp3') !== "";


		if (canPlayMp3) {
			codec = "mp3";
		}

		if (canPlayOgg) {
            codec = "ogg";
        }

		if (!codec) {
            alert("Browser can not play the sounds needed for this game.");
        }
        return codec;
    };

    var determinePlayerModel = function() {
        var test = ["AudioContext", "webkitAudioContext", "Audio"];
        for (var i = 0; i < test.length; i++) {
            if (test[i] in window) {
                audioModel = test[i];
                return audioModel;
            }
        }
        return "";
    };

    var runSourceFactoryConfig = function() {
        codec = determineCodec();
        audioModel = determinePlayerModel();
        if (!audioModel) return;
        if (audioModel != "Audio") {
            context = new window[audioModel]();
			console.log("Audio Model: ", audioModel, context);
            event.fireEvent(event.list().REGISTER_AUDIO_CONTEXT, {context:context, model:audioModel});
            if (typeof(context.createGain) != "function") context.createGain = context.createGainNode;
            return context;
        } else {
            console.error("This browser does not support the Web Audio Api. Will run with limited sounds.");
        }
    };

    var contextSource = function(bufferData) {
        var buffer = bufferData;

        var pause = function(sourceNode, fadeTime) {
            if (fadeTime) {
				fadeGain(sourceNode.fadeNode, 0, fadeTime);
                sourceNode.stop(context.currentTime + fadeTime);
            } else {
                sourceNode.stop(0);
            }
        };

        var getSource = function() {
            var sourceNode = context.createBufferSource();
            sourceNode.buffer = buffer;
			sourceNode.gainNode = context.createGain();
            sourceNode.fadeNode = context.createGain();
            return sourceNode;
        };

        var wire = function(sourceNode) {
            sourceNode.buffer = buffer;
            sourceNode.connect(sourceNode.fadeNode);
            sourceNode.fadeNode.connect(sourceNode.gainNode);
            sourceNode.fadeNode.gain.linearRampToValueAtTime(0.00001, context.currentTime);
            return sourceNode.gainNode;
        };

		var fadeGain = function(fadeNode, value, fadeTime) {
			if (!fadeTime) {
				fadeTime = 0.001;
			}
            fadeNode.gain.linearRampToValueAtTime(value, context.currentTime + fadeTime);
		};

        var play = function(sourceNode, gain, looping, fadeTime) {
			sourceNode.loop = looping;
			sourceNode.start(0);
            sourceNode.gainNode.gain.linearRampToValueAtTime(gain, context.currentTime);
			fadeGain(sourceNode.fadeNode, 1, fadeTime)
        };

        return {
            getSource:getSource,
            wire:wire,
            play:play,
            pause:pause
        };
    };

    var audioSource = function(baseAudio) {

        var gain = 1;

        var pause = function(sourceNode) {
            sourceNode.pause();
        };

        var setGain = function(value) {
            gain = value;
        };

        var play = function(looping) {
            var clone = baseAudio.cloneNode(false);
            clone.volume = gain;
            clone.loop = looping;
            clone.play();

            var done = function() {
                clone = null;
            };

            clone.addEventListener("pause", done, false);
            return clone;
        };

        return {
            play:play,
            pause:pause,
            setGain:setGain
        };
    };

    var loadContextSourceData = function(sound, url, completionCallback, file) {

        var dataCallback = function(listSound, response) {
            var onError = function() {
                completionCallback(0, 0, 1, file);
                console.error("Decode Error: ", listSound, response);

            //    alert("Sound decoding Error");
            };

            context.decodeAudioData(response, function(buffer) {
                listSound.source = new contextSource(buffer);
				console.log("Sound Loaded: ", listSound, file, url, buffer)
                completionCallback(0, 1, 0, file);
            }, onError);

        };

        send.utilRequest(requests.utils.LOAD_CONTEXT_SOUND, {url:url, sound:sound, callback:dataCallback});
    };

    var createMockSource = function(sound, completionCallback, file) {

        var mockSource = {
            play:function() {},
            setGain:function() {},
            pause:function() {}
        };

        sound.source = mockSource;
        completionCallback(0, 1, 0, file);
    };


    var addSourceToSound = function(sound, completionCallback, file) {
        if (!audioModel) {
            createMockSource(sound, completionCallback, file);
            return;
        }

        var url = path+sound.folder+"/"+sound.file+"."+codec;
        if (context) {
            loadContextSourceData(sound, url, completionCallback, file);
            return;
        }

        if (audioModel == "Audio") {

            var baseAudio = new Audio([url]);
            var onCanPlay = function() {
                completionCallback(0, 1, 0, file);
            };
            baseAudio.addEventListener("canplaythrough", onCanPlay, false);
            sound.source = audioSource(baseAudio);
        }
    };

    return {
        runSourceFactoryConfig:runSourceFactoryConfig,
        addSourceToSound:addSourceToSound
    };

});