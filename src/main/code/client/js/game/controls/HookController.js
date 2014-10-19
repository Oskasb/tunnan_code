"use strict";

define(["application/EventManager", "3d/GooJointAnimator"], function(event, boneAnimator) {

	var buildSystem = function(entity, data, landed) {
		var state = 0;
		if (landed) state = 1;
		var seat = {
			data:data,
			targetState:state,
			currentState:state,
			hook:data.controls.hook,
			speed:data.speed,
			locked:true
		};
		return seat;
	};

	var processControlState = function(entity, time) {
		return
		entity.pieceInput.setAppliedState("hook", null);
	};

	return {
		processControlState:processControlState,
		buildSystem:buildSystem
	}
});