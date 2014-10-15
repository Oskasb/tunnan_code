define(function() {
    "use strict";

    var buildStereoChannelSplitter = function(source, context) {
        var splitter = context.createChannelSplitter(2);
        source.connect(splitter);
        var gainLeft = context.createGain();
        var gainRight = context.createGain();
        splitter.connect(gainLeft, 0);
        splitter.connect(gainRight, 1);
        splitter.right = gainRight;
        splitter.left = gainLeft;

        var merger = context.createChannelMerger(2);
        merger.setPosition = function(position, time) {
            if (!time) time = 0.01;
            splitter.right.gain.linearRampToValueAtTime( 1 - position, context.currentTime+time );
            splitter.left.gain.linearRampToValueAtTime( 1 + position, context.currentTime+time );
        };
        splitter.left.connect(merger, 0, 0);
        splitter.right.connect(merger, 0, 1);
        return merger;
    };

    return {
        buildStereoChannelSplitter:buildStereoChannelSplitter
    };

});

