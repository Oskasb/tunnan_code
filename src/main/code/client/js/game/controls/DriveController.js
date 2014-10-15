"use strict";

define(["application/EventManager", "3d/GooJointAnimator", 'game/parts/WheelPart'], function(event, GooJointAnimator, WheelPart) {

    var addWheels = function(wheelData) {
        var wheels = [];
        for (var index in wheelData) {
            wheels.push(new WheelPart(index, wheelData[index]))
        }
        return wheels;
    };

    var buildSystem = function(entity, data, state) {
        var drive = {
            wheels:addWheels(data.wheels)
        };
        return drive;
    };

    var processControlState = function(entity, groundProximity) {

    };

    return {
        processControlState:processControlState,
        buildSystem:buildSystem
    }
});