define(["application/EventManager",
    'application/DeviceHandler'],
    function(event,
             deviceHandler) {
    "use strict";

    var context;
    var auxGain;
    var reverb;
    var powerSound =  deviceHandler.hasPowerSound();

    var setContext = function(ctx) {
        context = ctx;
        auxGain = context.createGain();
        if (powerSound) {
            reverb = context.createConvolver();
            auxGain.connect(reverb);
        } else {
            auxGain.connect(context.destination)
        }

        auxGain.gain.value = 0.5;
    };

    var createReverbTrack = function(buffer) {
        reverb.buffer = buffer;
        reverb.connect(context.destination);
    };

    var setupReverb = function() {
        var setupBuffer = function(buffer) {
            createReverbTrack(buffer);
        };
        event.fireEvent(event.list().FETCH_BUFFER, {soundData:event.sound().FX_VERB, callback:setupBuffer});
    };

    var connectTrackToFx = function(node) {
        node.connect(auxGain);
    };

    var handleConnectReverb = function(e) {
        var node = event.eventArgs(e).node;
        node.connect(auxGain);
    };

    var setupFxTrack = function() {
        if (powerSound) setupReverb();
    };

    if (powerSound) event.registerListener(event.list().SEND_SOUND_TO_REVERB, handleConnectReverb);
//    event.registerListener(event.list().LOADING_COMPLETED, handleLoadOk);

    return {
        setContext:setContext,
        setupFxTrack:setupFxTrack,
        connectTrackToFx:connectTrackToFx
    };
});
