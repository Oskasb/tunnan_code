"use strict";

define([
    "application/EventManager"
],
    function(event) {

    var VideoPlayer = function(entity, display, instrumentData) {
        this.entity = entity;
        this.display = display;
        this.data = instrumentData;
        this.txcoords = instrumentData.txcoords;
        this.sources = instrumentData.sources;

        var handleBroadcast = function(e) {
            if (event.eventArgs(e).channel == this.data.channel) {
                this.streamVideoSource(event.eventArgs(e).source)
            }
        }.bind(this);

        event.registerListener(event.list().BROADCAST_VIDEO, handleBroadcast);


        return this;
    };

    VideoPlayer.prototype.streamVideoSource = function(source) {
        if (this.active) this.stopVideo();

        var video = document.createElement('video');
        video.width = 128;
        video.height = 128;

        var videoEnded = function() {
            this.stopVideo();
        }.bind(this);

        video.addEventListener('ended', function() {
            videoEnded();
        });

        this.video = video;
        this.active = true;
        this.video.src = source;
        this.video.play();
        this.video.volume = 0.01;
    };

    VideoPlayer.prototype.stopVideo = function() {
        this.active = false;
        this.video.pause();
        this.video = null;
    };


    VideoPlayer.prototype.sampleSourceValue = function() {
        return this.entity.instruments[this.data.sourceValue].getValue();
    };

    VideoPlayer.prototype.updateInstrument = function() {
    //    console.log("Update video, ", this)
        if (this.active) {
            updateVideoPlayer(this);
        } else {
            if (Math.random() < 0.004) {
                this.streamVideoSource(this.data.video);
            }
        }
    };


    function updateVideoPlayer(instrument) {
        var txcoords = instrument.data.txcoords;

        var video = instrument.video;
        var ctx = instrument.display.materialMap.ctx;

        var x = txcoords[0];
        var y = txcoords[1];



        var sourceCoords = instrument.data.sources.video;

        var w = video.videoWidth;
        var h = video.videoHeight;
        var aspect = w/h;

        var tx = x-txcoords[2]*0.5;
        var ty = y -txcoords[3]*0.5;
        var tw = txcoords[2];
        var th = txcoords[3] / aspect;
        var diff = txcoords[3] - th;

        ty = ty + diff*0.5  ;
        ctx.drawImage(video,sourceCoords[0],sourceCoords[1],w,h,tx,ty,tw,th);
    }

    return VideoPlayer;
});