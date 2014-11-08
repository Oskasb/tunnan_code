"use strict";

define([
	'goo/entities/SystemBus',
	'application/EventManager',
	'io/GameScreen'
],
	function(
		SystemBus,
		event,
		GameScreen
		) {

		var tpfStack = [0];
		var goo;
		var gameCtrl;

		var PerfMon = function(gooController, gameController) {
			this.gooController = gooController;
			goo = this.gooController.goo;
			this.tfpGraphSize = 200;
			this.gameController = gameController;
			gameCtrl = gameController;
		};


		PerfMon.prototype.updateMonitorFrame = function(tpf) {
			tpfStack.push(tpf*1000);
			if (tpfStack.length == this.tfpGraphSize) tpfStack.shift();
		};


		PerfMon.getTpfStack = function() {
			return tpfStack;
		};

		PerfMon.getStatsCollection = function() {
			var passCount = function(composers) {
				var passes = 0;
				for (var i = 0; i < composers.length; i++) {
					passes+=composers[i].passes.length;
				}
				return passes;
			};

			var getSys = function(sys) {
				for (var i = 0; i < goo.world._systems.length; i++) {
					if (goo.world._systems[i].type == sys) {
						return goo.world._systems[i];
					}
				}
			};

			var getGui = function() {
			//	if (this.gameController.canvasGuiMain)
				return gameCtrl.canvasGuiAPI.canvasGuiMain.canvasCalls
			};

			var stats = {
				tpf: tpfStack[tpfStack.length-1],
				cachedShaders: 'NYI', // goo.renderer._shaderKeys.length,
				drawCalls: goo.renderer.info.calls,
				verts: goo.renderer.info.vertices,
				indices: goo.renderer.info.indices,
				entities: goo.world.entityManager._entityCount,
				allentities: getSys('TransformSystem')._activeEntities.length,
				lights: goo.renderSystem.lights.length,
				composers: goo.renderSystem.composers.length,
				passes: passCount(goo.renderSystem.composers),
				transforms: getSys('TransformSystem').numUpdates,
				animations: getSys('AnimationSystem')._activeEntities.length,
				guiCalls: getGui().callsToCanvas
			};
			return stats;
		};

		return PerfMon;
	});