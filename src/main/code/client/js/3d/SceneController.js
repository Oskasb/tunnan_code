"use strict";

define(["application/EventManager", 'physics/PhysicalWorld'],
    function(event, PhysicalWorld) {


		var SceneController = function() {
			this.ticking = false;
		/*
			var scenarioLoaded = function() {
				this.handleScenarioLoaded();
			}.bind(this)
        */
		//	event.registerListener(event.list().SCENARIO_LOADED, scenarioLoaded);
		};

		SceneController.prototype.viewTick = function(time) {
			PhysicalWorld.stepAmmoSimulation();
            event.fireEvent(event.list().UPDATE_ACTIVE_ENTITIES, {frameTime:time});
        };
	/*
		SceneController.prototype.tickScene = function(e) {
            var time = event.eventArgs(e).lastFrameDuration;
            this.viewTick(time);
        };

		SceneController.prototype.handleScenarioLoaded = function() {
			if (this.ticking) return;

			var sceneTick = function(e) {
				this.tickScene(e)
			}.bind(this);

            setTimeout(function() {
                event.registerListener(event.list().RENDER_TICK, sceneTick);
            }, 100)
			this.ticking = true;
        };
         */
		return SceneController;
});
