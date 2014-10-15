define(["application/EventManager"], function(event) {

    var now;
    var eventQueue = [];


	var Sequencer = function() {

	};


	Sequencer.prototype.flushQueue = function() {
		for (var i = 0; i < eventQueue.length; i++) {
			var queueEntry = eventQueue[i];
			console.log("Flush Queue Entry: ",queueEntry)
		}
		eventQueue = [];
	};

    var queueEvent = function(callback, wait) {
        eventQueue.push({wait:wait, callback:callback});
    };

    var updateQueue = function(dt) {
        for (var i = 0; i < eventQueue.length; i++) {
            var queueEntry = eventQueue[i];
            queueEntry.wait -= dt;
            if (queueEntry.wait <= 0) {
                queueEntry.callback();
                eventQueue.splice(i, 1);
            }
        }
    };

    var sequenceCallback = function(e) {
        var args = event.eventArgs(e);
        var callback = args.callback;
        var wait = args.wait;
        queueEvent(callback, wait);
    };

    event.registerListener(event.list().SEQUENCE_CALLBACK, sequenceCallback);

	Sequencer.prototype.tick = function(time) {
        now += time;
        updateQueue(time);
    };

    return Sequencer;
});
