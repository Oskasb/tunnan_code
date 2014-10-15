"use strict";

define([
    "application/EventManager",
    'game/GameConfiguration',

],
    function(event,
             gameConfig) {

        var sources = gameConfig.VIDEOS.sources;
        var channels = gameConfig.VIDEOS.channels;

        function broadcastVideo(videoSource, channel) {
            event.fireEvent(event.list().BROADCAST_VIDEO, {source:videoSource, channel:channel});
        };

        function retrigger() {
            setTimeout(function() {
            //    playRandom()
            }, 24300 + Math.random()*12400);
        }

        function playRandom() {
            var source = sources.cats.funnyCat;
            var channel = 'hud';
            for (var index in sources) {
                if (Math.random() < 0.2) {
                    channel = index;
                    for (var keys in sources[channel]) {
                        if (Math.random() < 0.5) source = sources[channel][keys];
                    };
                }
            };

            broadcastVideo(source, channel);
            retrigger();

        };

        return {
            broadcastVideo:broadcastVideo,
            playRandom:playRandom
        }

    });