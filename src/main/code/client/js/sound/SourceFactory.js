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
        if (canPlayOgg) {
            codec = "ogg";
            //    codec = "mp3"
        } else if (canPlayMp3) {
            codec = "mp3";
        } else {
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
            event.fireEvent(event.list().REGISTER_AUDIO_CONTEXT, {context:context, model:audioModel});
            if (typeof(context.createGain) != "function") context.createGain = context.createGainNode;
            return context;
        } else {
            alert("This browser does not support the Web Audio Api. Will run with limited sounds.");
        }
    };

    var contextSource = function(bufferData) {
        var buffer = bufferData;
        var gain = 1;
        var updateGainNode = function(value) {
            gain = value;
        };

        var pause = function(sourceNode) {
            if (typeof(sourceNode.stop) == "function") {
                sourceNode.stop(0);
            } else {
                sourceNode.noteOff(0);
            }
        };

        var setGain = function(value) {
            updateGainNode(value);
        };

        var getSource = function() {
            var sourceNode = context.createBufferSource();
            sourceNode.buffer = buffer;
            // sourceNode.gain.value = 1;
            return sourceNode;
        };

        var wire = function(sourceNode) {
            var gainNode = context.createGain();
            sourceNode.buffer = buffer;
            sourceNode.connect(gainNode);
            gainNode.gain.value = gain;
            updateGainNode = function(value) {
//                console.log("Gain value: ", value);
                gainNode.gain.value = value;
            };
            return gainNode;
        };

        var play = function(sourceNode, looping) {
            sourceNode.loop = looping;
            if (typeof(sourceNode.start) == "function") {
                sourceNode.start(0);
            } else {
                sourceNode.noteOn(0);
            }
        };

        return {
            getSource:getSource,
            wire:wire,
            play:play,
            pause:pause,
            setGain:setGain
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
                console.log("Decode Error: ", listSound, response);
                alert("Sound decoding Error");
            };

            context.decodeAudioData(response, function(buffer) {
                listSound.source = new contextSource(buffer);
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