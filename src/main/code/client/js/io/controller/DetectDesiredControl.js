"use strict";

define([], function() {


	var DetectDesiredControl = function() {
		this.candidates = {};
		this.hottestCandidate = null;
		this.keepChecking = true;
	};

	DetectDesiredControl.prototype.updateCandidate = function(candidate) {
		var inputState = candidate.inputState;

		if (inputState.analogValue < candidate.min) {
			candidate.min = inputState.analogValue;
		}

		if (inputState.analogValue > candidate.max) {
			candidate.max = inputState.analogValue;
		}

		if (Math.abs(candidate.lastStrength) > Math.abs(inputState.analogValue) * 2) {
			candidate.abandon = true;
		}

		candidate.diff = candidate.max - candidate.min;

		if (Math.abs(candidate.lastStrength) < Math.abs(inputState.analogValue)) {
			this.keepChecking = true;
			candidate.lastStrength = inputState.analogValue;
		} else {
			this.keepChecking = false;
		}


	};

	DetectDesiredControl.prototype.inputUpdated = function(inputState) {
		if (inputState.getControlId()) {
			return;
		}

		if (!this.candidates[this.controllerId+inputState.sourceId]) {

			this.candidates[this.controllerId+inputState.sourceId] = {
				inputState: inputState,
				initValue: inputState.analogValue,
				diff:0,
				lastStrength: inputState.analogValue,
				min: 0,
				max: 0,
				abandon:false,
				booked:false
			};

			if (inputState.analogValue == 1) {
				this.candidates[this.controllerId+inputState.sourceId].isButton = true;
			}
		} else {
			this.updateCandidate(this.candidates[this.controllerId+inputState.sourceId]);
		}

	};


	var reCompareTimeout;

	DetectDesiredControl.prototype.candidateSelsected = function(candidate, selectedCallback, seekingCallback) {
		clearTimeout(reCompareTimeout);

		seekingCallback(["Candidate", candidate.diff]);
		var _this = this;



		var matchCheck = function(oldCandidate) {
			if (!_this.keepChecking) {
				candidate.booked = true;
				_this.hottestCandidate = null;
				_this.keepChecking = true;
				candidate.inputState.setFactor(candidate.lastStrength);
				selectedCallback(candidate.inputState);
				_this.candidates = {};
			}
		};

		reCompareTimeout = setTimeout(function() {
			matchCheck(candidate);
		}, 1000)
	};


	DetectDesiredControl.prototype.abandonCandidate = function(candidate, seekingCallback) {
		seekingCallback("Candidate Abandoned");
		candidate.abandon = false;
		this.hottestCandidate = null;
		candidate.lastStrength = 0;
	};


	DetectDesiredControl.prototype.buttonCandidate = function(candidate, selectedCallback) {
		clearTimeout(reCompareTimeout);
		selectedCallback(candidate.inputState);
		this.candidates = {};
	};

	DetectDesiredControl.prototype.axisCandidate = function(candidate, selectedCallback, seekingCallback) {
		if (candidate.abandon) {
			clearTimeout(reCompareTimeout);
			this.abandonCandidate(candidate, seekingCallback);
			this.candidates = {};
			return;
		}

		if (this.keepChecking) {
			clearTimeout(reCompareTimeout);
			this.hottestCandidate = null;
			seekingCallback(["Seeking", "Diff: ", candidate.diff]);
			return;
		}

		if (this.hottestCandidate != candidate) {
			this.candidateSelsected(candidate, selectedCallback, seekingCallback);
			this.hottestCandidate = candidate;
		}

	};


	DetectDesiredControl.prototype.determineCandidate = function(selectedCallback, seekingCallback) {

		var biggestDiff = 0;

		for (var index in this.candidates) {
			if (Math.abs(this.candidates[index].diff) > biggestDiff) {
				if(!this.candidates[index].booked) {
					biggestDiff = Math.abs(this.candidates[index].diff);
					var candidate = this.candidates[index];
				}
			}
		}

		if (candidate) {

			if (candidate.isButton) {
				this.buttonCandidate(candidate, selectedCallback);
				return;
			} else {
				this.axisCandidate(candidate, selectedCallback, seekingCallback);
			}

		} else {

			if (!this.hottestCandidate) {
				this.keepChecking = true;
				clearTimeout(reCompareTimeout);
				seekingCallback(["No Candidate"]);
			} else {
				seekingCallback(["Hot Candidate:", this.hottestCandidate.sourceId]);
			}

		}

	};

	return DetectDesiredControl
});