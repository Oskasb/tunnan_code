"use strict";

define([
	    'goo/entities/SystemBus'
],
	function(
		SystemBus
		) {

		var LevelController;

		require([
			"game/world/LevelController"
		],
			function(
				lc
				) {
				LevelController = lc;
			}
		);

		var TargetSelect = function(planeEntity, controlData) {
			this.controlData = controlData;
			this.planeEntity = planeEntity;
			this.target = planeEntity;

			this.currentSelection = 0;
			this.availableTargets = [];

		};


		TargetSelect.prototype.scanLevelEntities = function() {
			this.availableTargets = [];
			this.availableTypes = [];
			var ents = LevelController.getLevelEntities();

			for (var index in ents) {

					for (var key in ents[index]) {
						this.availableTargets.push(ents[index][key]);
					}
					this.availableTypes.push(index);
			}
		};


		TargetSelect.prototype.updateTriggerState = function(value, step, total) {
			this.currentState = value;

			if (value) {
				this.scanLevelEntities();

				if (this.currentSelection >= this.availableTargets.length -1) {
					this.currentSelection = 0;
				}

				this.setTargetEntity(this.availableTargets[this.currentSelection].entity);

				this.currentSelection++;
			}

			return this.currentState;
		};


		TargetSelect.prototype.setTargetEntity = function(target) {
			SystemBus.emit('message_to_gui', {channel:'hint_channel', message:["Missile Target Selected", target.id]});
			this.target = target;
		};

		return TargetSelect;
	});
