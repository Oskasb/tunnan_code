"use strict";

define(["application/EventManager"],
function(event) {
    var loadingsStarted = 0;
    var loadingsFinished = 0;
    var loadingErrors = 0;

	var loadIds = [];
	var doneIds = [];
	var errorIds = [];
	var remainingIds = [];
	var file_feedback;
    var bar;
    var progressLabel;
    var screen;

    var showLoadingScreen = function(pageTitles) {
        progressLabel = domUtils.getElementById("progress_label")
        bar = domUtils.getElementById("progress_bar");
		file_feedback = domUtils.getElementById("file_feedback");
        loadingsStarted = 0;
        loadingsFinished = 0;
        loadingErrors = 0;
		loadIds = [];
		doneIds = [];
		errorIds = [];
		remainingIds = [];
		bar.style.width = 0+"%";
        domUtils.setElementHtml(progressLabel, 0+"%");

        screen = domUtils.getElementById("loading_screen");
        domUtils.setElementHtml("load_title", pageTitles.title);
        domUtils.setElementHtml("load_tagline", pageTitles.tagLine);


        domUtils.quickShowElement(screen);
    };

    var removeLoadingScreen = function() {
    //    event.fireEvent(event.list().PAGE_OVERLAY, {page:pages.EXIT_PAGE_PAGE, parentId:pages.EXIT_PAGE_PAGE.parentId});
    //    event.fireEvent(event.list().PAGE_OVERLAY, {page:pages.MENU_NAVIGATION, parentId:pages.MENU_NAVIGATION.parentId});

        var remove = function() {
    //        domUtils.quickHideElement(screen);
        };
     //   alert("LOADING_ENDED")
        event.fireEvent(event.list().LOADING_ENDED, {});
     //   remove();
        event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:remove, wait:event.anim().LOAD_HIDE.time * 800});

    };

    var getPercent = function(started, finished) {
        return 100 * (finished / started)
    };

    var showProgress = function(started, finished, errors, id) {
		return
        var percent = getPercent(loadingsStarted, loadingsFinished);
        bar.style.width = percent+"%";
        domUtils.setElementHtml(progressLabel , Math.floor(percent)+"%");

		var color = '#2d5';
		var text = '';

		for (var i = 0; i < remainingIds.length; i++) {
			text+=remainingIds[i]+'<br>';
		}

		domUtils.setElementHtml(file_feedback, text);
		file_feedback.style.color = color;

		domUtils.setElementHtml(bar, id);
		bar.style.color = color;
    };

    var loadingCompleted = function() {
    //    screen = domUtils.getElementById("loading_screen");
        console.log("Track Progress - Loading Completed");
        event.fireEvent(event.list().LOADING_COMPLETED, {started:loadingsStarted, completed:loadingsFinished, errors:loadingErrors});
    };

    var loadingProgress = function(start, complete, error, id) {
        loadingsStarted += start;
        loadingsFinished += complete;
        loadingErrors += error;

		if (id) {
			if (start) {
				loadIds.push(id);
				remainingIds.push(id)
			}
			if (complete) {
				doneIds.push(id);
				remainingIds.splice(remainingIds.indexOf(id), 1);
			}
			if (error) errorIds.push(id);
		}

  //      console.log("Loading State: ", loadingsStarted, loadingsFinished, loadingErrors)
        showProgress(loadingsStarted, loadingsFinished, loadingErrors, id);

		var loadTimeout;
		function completeLoading() {
			clearTimeout(loadTimeout);
			loadTimeout = setTimeout(function() {
				loadingCompleted()
			}, 100);
		}

        if (loadingsStarted == loadingsFinished+loadingErrors) {
			completeLoading();
		}
    };

    var getLoadedCount = function() {
        return {started:loadingsStarted, finished:loadingsFinished, errors:loadingErrors, remaining:remainingIds, load:loadIds, done:doneIds, error:errorIds};
    };

    var handleLoadEvent = function(e) {
        var args = event.eventArgs(e);
        loadingProgress(args.started, args.completed, args.errors, args.id)
    };

    event.registerListener(event.list().LOAD_PROGRESS, handleLoadEvent);

    return {
        showLoadingScreen:showLoadingScreen,
        removeLoadingScreen:removeLoadingScreen,
        loadingProgress:loadingProgress,
        getLoadedCount:getLoadedCount
    }

});