"use strict";

define(["application/EventManager", "game/GameConfiguration", "application/DeviceHandler"],
    function(event, gameConfig, deviceHandler) {


	var UpdateLoop = function() {

	};

    var browser = deviceHandler.getBrowser();
    var browserVersion = deviceHandler.getVersion();
    var frame = 0;
    var isPaused = false;
    var tickTracker;
    var tickTrackerTimeout;
    var frameTime = new Date().getTime();
    var lastFrameDuration;
    var activeMillis = 0;
    var activeMinutes = 0;
    var targetFPS = gameConfig.RENDER_SETUP.targetFPS;
        var statsUpdateFrames = 10;
        var sumFrameTime = 20;
        var renderStatus = {
            slowFrameCount:0,
            worstFrameTime:0,
            cyclesOfTen:0,
            averageFrameTime:0,
            skipped:0

        };


    var getWaitTime = function(callTime, lastFrameDuration) {
        var tpf = 1000 / targetFPS;
        var adjustedTime = tpf - 1;
        if (lastFrameDuration > tpf*21) adjustedTime = tpf / 2;

        return adjustedTime;
    };


    var tickIsActive = function() {

        clearTimeout(tickTrackerTimeout)
        if (tickTracker) {
            console.log("unpause", tickTracker);
		//	goo.startGameLoop();
          //  event.fireEvent(event.list().UNPAUSE_UPDATES, {})
        }

        tickTracker = false;
        tickTrackerTimeout = setTimeout(function(){
         //   tickTracker = true;
            console.log("pause", tickTracker);
		//	goo.startGameLoop();
        //    event.fireEvent(event.list().PAUSE_UPDATES, {});
        }, 400);
    };

	var thisFrameTime = 0;

    var handleGooTick = function(e) {
        frameTime = event.eventArgs(e).tpf*1000;
    //    console.log(frameTime)
        tickIsActive();
        var updateTime = function(time) {
			thisFrameTime = time;
			renderFrame();

			event.fireEvent(event.list().RENDER_TICK, {frameTime:now, lastFrameDuration:time});
        };
        event.fireEvent(event.list().FETCH_TIME, {callback:updateTime});
    };

    var trackPerformanceStats = function() {
        var stats = {
            avgT:Math.round(renderStatus.averageFrameTime*10) / 10,
            slowFs:renderStatus.slowFrameCount,
            slowest:Math.round(renderStatus.worstFrameTime*10) / 10,
            cycles:renderStatus.cyclesOfTen,
            mins:activeMinutes,
            skipd:renderStatus.skipped
        };

    //    console.log("PERFORMANCE STATS:", stats)
        event.fireEvent(event.list().ANALYTICS_EVENT, {category:"PERFORMANCE", action:"STATS "+browser, labels:JSON.stringify(stats), value:Math.round(stats.slowest)})
    };


    var countSlowFrame = function(duration) {

        if (isPaused || duration > 200) {
            renderStatus.skipped += 1;
            return;
        }
        renderStatus.slowFrameCount += 1;
        if (duration > renderStatus.worstFrameTime) renderStatus.worstFrameTime = duration;
        renderStatus.averageFrameTime = sumFrameTime / frame;

        if (renderStatus.slowFrameCount > statsUpdateFrames) {
            trackPerformanceStats();
            renderStatus.slowFrameCount = 0;
            renderStatus.cyclesOfTen += 1;
            renderStatus.worstFrameTime = 0;
            statsUpdateFrames = statsUpdateFrames*10;
        }
    };

    var renderFrame = function() {

        frame += 1;
    //    var now = new Date().getTime();
        lastFrameDuration = frameTime;

     //   lastFrameDuration = 15;
        if (!isNaN(lastFrameDuration)) sumFrameTime += lastFrameDuration;
        renderThisFrame(thisFrameTime, lastFrameDuration);
    //    renderNext(now, lastFrameDuration);
    };

    var countMinutes = function() {
        activeMillis -= 60000;
        activeMinutes += 1;
        trackPerformanceStats();
    //    event.fireEvent(event.list().ANALYTICS_EVENT, {category:"ACTIVITY", action:"DURATION", labels:"minutes", value:activeMinutes})
    };

    var renderThisFrame = function(now, lastFrameDuration) {
        var tpf = 1000 / targetFPS;

        if (lastFrameDuration > tpf*1.5) {
            countSlowFrame(lastFrameDuration);
            lastFrameDuration = tpf*1.5
        }

        activeMillis += lastFrameDuration;
        if (activeMillis > 60000) countMinutes();

        if (!isPaused) {
        //    event.fireEvent(event.list().RENDER_TICK, {frameTime:now, lastFrameDuration:lastFrameDuration});
        }
    };

    var pause = function() {
        isPaused = true;
    };

    var unpause = function() {
        isPaused = false;
    };

//	event.registerListener(event.list().POST_UPDATE, renderFrame);
    event.registerListener(event.list().GOO_TICK, handleGooTick);
    event.registerListener(event.list().PAUSE_UPDATES, pause);
    event.registerListener(event.list().UNPAUSE_UPDATES, unpause);

	return UpdateLoop;

});