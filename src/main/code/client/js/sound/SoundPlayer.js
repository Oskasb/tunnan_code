define(["application/EventManager",
    'application/DeviceHandler',
    'sound/ChannelMixer'], function(
    event,
    deviceHandler,
    channelMixer) {
    "use strict";

    var loopingSounds = {};
    var ambientLoops = {};
    var startedOneshots = {};
    var listenerPos = [0, 0, 0];
    var context;

    var pannerPool = [];
    var pannerPoolSize = 90;
    var lastPanner = 0;

    var powerSound = deviceHandler.hasPowerSound();

    var panningModel = "HRTF";
//    if (!powerSound) panningModel = "equalpower";

    var createPannerNode = function(refDist, rolloff) {
        var panner = context.createPanner();
    //    console.log(panner)
        panner.rolloffFactor = rolloff;

        panner.panningModel = panningModel;

        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 360;
        panner.refDistance = refDist;
        return panner;
    };

    var createPannerPool = function() {
        for (var i = 0; i < pannerPoolSize; i++) {
            pannerPool[i] = createPannerNode(10, 0.5);
        }
        console.log("PANNER POOL:", pannerPool)
    };

    var playSound = function(sound, playId, callback, loop) {
        sound.source.setGain(sound.gain);

        var sourceNode = sound.source.getSource();
        var gainNode = sound.source.wire(sourceNode);

        var soundData = {playId:playId, source:sound.source, sourceNode:sourceNode, gainNode:gainNode};


        if (loop) {
            loopingSounds[playId] = soundData;
        } else {
            if (playId) startedOneshots[playId] = soundData;
        }

        channelMixer.addSoundToChannel(sound, soundData);
        sound.source.play(sourceNode, loop);

        if (typeof(callback) == "function") callback(soundData);
    };

    var fetchSound = function(sound, callback) {
        if (typeof(sound.source.getSource) == "function") {
            var sourceNode = sound.source.getSource();
        } else {
            //    alert("Source Not Available: "+sound.file);
            return;
        }
        var soundData = {source:sound.source, sourceNode:sourceNode, data:sound};
        //    console.log("soundData: ", soundData)
        callback(soundData);
    };

    var fetchBuffer = function(sound, callback) {
        if (typeof(sound.source.getSource) == "function") {
            var buffer = sound.source.getSource().buffer;
        } else {
            //    alert("Buffer Not Available: "+sound.file);
            return;
        }
        callback(buffer);
    };

    var stopLoop = function(loopId) {
        var source = loopingSounds[loopId].source;
        source.pause(loopingSounds[loopId].sourceNode);
        delete loopingSounds[loopId];
    };

    var stopOneshot = function(playId) {
        var source = startedOneshots[playId].source;
        source.pause(startedOneshots[playId].sourceNode);
        delete startedOneshots[playId];
    };

    var handleOneshotEvent = function(e) {
 //       console.log("Play Sound", e)
        var soundData = event.eventArgs(e).soundData;
        var playId = event.eventArgs(e).playId;
        var callback = event.eventArgs(e).callback;

        playSound(soundData, playId, callback, false);
    };

    var handleStartLoop = function(e) {
        var soundData = event.eventArgs(e).soundData;
        var loopId = event.eventArgs(e).loopId;
        var callback = event.eventArgs(e).callback;
        playSound(soundData, loopId, callback, true);
    };

    var handleStopLoop = function(e) {
        var loopId = event.eventArgs(e).loopId;
        stopLoop(loopId);
    };

    var handleStopEvent = function(e) {
        var playId = event.eventArgs(e).playId;
        stopOneshot(playId);
    };

    var handleFetchSoundEvent = function(e) {
        var soundData = event.eventArgs(e).soundData;
        var callback = event.eventArgs(e).callback;
        fetchSound(soundData, callback);
    };

    var handleContext = function(e) {
        context = event.eventArgs(e).context;
        if (!powerSound) createPannerPool();
        channelMixer.setupMixChannels(context)
    };

    var handleFetchBufferEvent = function(e) {
        var soundData = event.eventArgs(e).soundData;
        var callback = event.eventArgs(e).callback;
        fetchBuffer(soundData, callback);
    };


    var getDistanceFromListener = function(pos) {
        var approxdist = Math.abs(Math.abs(pos[0])-Math.abs(listenerPos[0])) + Math.abs(Math.abs(pos[1])-Math.abs(listenerPos[1])) + Math.abs(Math.abs(pos[2])-Math.abs(listenerPos[2]));
        return approxdist;
    };



    var getAvailablePannerNode = function(refDist, rolloff) {
        if (powerSound) return createPannerNode(refDist, rolloff);
        var pannerNr = lastPanner+1;
        if (pannerNr >= pannerPoolSize) pannerNr = 0;
        var panner = pannerPool[pannerNr];
        panner.disconnect();
        return panner;
    };

    var handleAmbientOneshot = function(e) {
        var soundData = event.eventArgs(e).soundData;
        var pos = event.eventArgs(e).pos;
        var vel = event.eventArgs(e).vel;
        var dir = event.eventArgs(e).dir;

        var distance = getDistanceFromListener(pos);
        if (distance > 10000) return;
        var panner = getAvailablePannerNode(soundData.options.refDist, soundData.options.rolloff);
        var gainNode = context.createGain();
        panner.setPosition(pos[0], pos[1], pos[2]);
        if (!vel) vel = [0, 0, 0];
        panner.setVelocity(vel[0], vel[1], vel[2]);
        panner.setOrientation(dir[0], dir[1], dir[2]);
        var callback = function(sound) {
            gainNode.gain.value = 1;
            sound.sourceNode.connect(gainNode);
            gainNode.connect(panner);
            channelMixer.connectNodeToChannel(panner, channelMixer.getTracks().game.id);
            sound.sourceNode.start(0);
        };

        fetchSound(soundData, callback);
    };

    var handleAmbientLoop = function(e) {
        var soundData = event.eventArgs(e).soundData;
        var playId = event.eventArgs(e).playId;
        var callback = event.eventArgs(e).callback;

        var panner = createPannerNode(soundData.options.refDist, soundData.options.rolloff);
        var gainNode = context.createGain();

        var soundCB = function(sound) {
            gainNode.gain.value = 1;
            sound.sourceNode.connect(gainNode);
            sound.sourceNode.loop = true;
            gainNode.connect(panner);
         //   panner.connect(context.destination);
            channelMixer.connectNodeToChannel(panner, channelMixer.getTracks().game.id);
        //    event.fireEvent(event.list().SEND_SOUND_TO_REVERB, {node:panner});
            sound.panner = panner;
            sound.gainNode = gainNode;
            sound.playId = playId;
            callback(sound);
            sound.sourceNode.start(0);
            loopingSounds[playId] = sound;
        };

        fetchSound(soundData, soundCB);
    };

    var handleListenerMoved = function(e) {
        var pos = event.eventArgs(e).pos;
        var vel = event.eventArgs(e).vel;
        listenerPos = pos;
    };

    event.registerListener(event.list().REGISTER_AUDIO_CONTEXT, handleContext);
    event.registerListener(event.list().FETCH_SOUND, handleFetchSoundEvent);
    event.registerListener(event.list().FETCH_BUFFER, handleFetchBufferEvent);
    event.registerListener(event.list().STOP_SOUND, handleStopEvent);
    event.registerListener(event.list().ONESHOT_SOUND, handleOneshotEvent);

    event.registerListener(event.list().ONESHOT_AMBIENT_SOUND, handleAmbientOneshot);
    event.registerListener(event.list().LOOP_AMBIENT_SOUND, handleAmbientLoop);
    event.registerListener(event.list().START_SOUND_LOOP, handleStartLoop);
    event.registerListener(event.list().STOP_SOUND_LOOP, handleStopLoop);
    event.registerListener(event.list().MOVE_AUDIO_LISTENER, handleListenerMoved);
});