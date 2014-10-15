define(["application/EventManager"] ,function(event) {
    "use strict";

    var context;

    var setContext = function(ctx) {
        context = ctx;
    //    context.listener.disconnect(context.destination)
    };

    var connectTrack = function(trackSendNode) {
        trackSendNode.connect(context.destination);
    };

    var handleConnectListener = function(e) {
        var node = event.eventArgs(e).node;
        node.connect(context.destination);
    };

    var handleConnectMaster = function(e) {
        var node = event.eventArgs(e).node;
        node.connect(context.destination);
    };

    var handleConnectDst = function(e) {
        var node = event.eventArgs(e).node;
        node.connect(context.destination);
    };

    var handleMoveListener = function(e) {
        var pos = event.eventArgs(e).pos;
        var vel = event.eventArgs(e).vel;
        var rot = event.eventArgs(e).rot;
        context.listener.setPosition(pos[0], pos[1], pos[2]);
        context.listener.setOrientation(rot[0], rot[1], rot[2], 0, 1, 0);
        context.listener.setVelocity(vel[0], vel[1], vel[2]);
    //    console.log("Move listener",pos[0], pos[1], pos[2],rot[0], rot[1], rot[2], vel[0], vel[1], vel[2])
    };

    event.registerListener(event.list().SEND_SOUND_TO_LISTENER, handleConnectListener);
    event.registerListener(event.list().SEND_SOUND_TO_MASTER, handleConnectMaster);
    event.registerListener(event.list().SEND_SOUND_TO_DESTINATION, handleConnectDst);
    event.registerListener(event.list().MOVE_AUDIO_LISTENER, handleMoveListener);

    return {
        setContext:setContext,
        connectTrack:connectTrack
    };
});
