"use strict";

define([
    "game/instruments/HudLadder",
    "game/instruments/VdiLadder",
    "game/instruments/CompassTape",
    "game/instruments/HsiRotation",
    "game/instruments/ScreenDigits",
    "game/instruments/RulerGauge",
    "game/instruments/VideoPlayer"
],     function(HudLadder,
                VdiLadder,
                CompassTape,
                HsiRotation,
                ScreenDigits,
                RulerGauge,
                VideoPlayer
    ) {

    var CreateHudLadder = function(entity, display, instrumentData) {
        return new HudLadder(entity, display, instrumentData);
    };

    var CreateVdiLadder = function(entity, display, instrumentData) {
        return new VdiLadder(entity, display, instrumentData);
    };

    var CreateCompassTape = function(entity, display, instrumentData) {
        return new CompassTape(entity, display, instrumentData);
    };

    var CreateHsiRotation = function(entity, display, instrumentData) {
        return new HsiRotation(entity, display, instrumentData);
    };

    var CreateScreenDigits = function(entity, display, instrumentData) {
        return new ScreenDigits(entity, display, instrumentData);
    };

    var CreateRulerGauge = function(entity, display, instrumentData) {
        return new RulerGauge(entity, display, instrumentData);
    };

    var CreateVideoPlayer = function(entity, display, instrumentData) {
        return new VideoPlayer(entity, display, instrumentData);
    };

    return {
        HudLadder:CreateHudLadder,
        VdiLadder:CreateVdiLadder,
        CompassTape:CreateCompassTape,
        HsiRotation:CreateHsiRotation,
        ScreenDigits:CreateScreenDigits,
        RulerGauge:CreateRulerGauge,
        VideoPlayer:CreateVideoPlayer
    }
});