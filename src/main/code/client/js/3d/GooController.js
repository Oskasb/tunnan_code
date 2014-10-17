"use strict"

require.config({
    paths: {
    //    goo: "../../../../../../goojs/src/goo",
        goo: "../../../../../../goojs/src/goo",
        'goo/lib': '../lib',
	    data_pipeline:'submodules/data_pipeline/src',
	    gui:'submodules/canvas_gui_3d/src'
    }
});

define(['application/EventManager',
	'goo/animationpack/systems/AnimationSystem',
	'3d/GooCameraController',
    '3d/GooEntityFactory',
    '3d/GooEffectController',
    'goo/entities/components/ScriptComponent',
    'goo/entities/GooRunner',
    'goo/math/Vector3',
	'goo/animationpack/handlers/SkeletonHandler',
	'goo/animationpack/handlers/AnimationComponentHandler',
	'goo/animationpack/handlers/AnimationStateHandler',
	'goo/animationpack/handlers/AnimationLayersHandler',
	'goo/animationpack/handlers/AnimationClipHandler',
	'goo/passpack/PosteffectsHandler'

], function(
    event,
	AnimationSystem,
	GooCameraController,
    GooEntityFactory,
    GooEffectController,
    ScriptComponent,
    GooRunner,
    Vector3
    ) {

	var GooController = function() {
		this.gooCameraController = new GooCameraController();

	};

	GooController.prototype.setupGooRunner = function() {
		var goo = new GooRunner({
			showStats:false,
			debug:false,
			manuallyStartGameLoop:true,
			tpfSmoothingCount:1,
			useTryCatch:false
		});
		this.goo = goo;
		goo.renderer.setClearColor(0, 0.1, 0.2, 1.0);
		goo.world.world_root = goo.world.createEntity("world_root");
		goo.world.add(new AnimationSystem());

		goo.world.world_root.addToWorld();
		goo.world.world_root.spatial = {
			pos:new Vector3()
		};

		var setupGooScene = function() {
			console.log("Setup Goo Scene");

			document.getElementById('game_window').appendChild(goo.renderer.domElement);

			setTimeout(function() {
				event.fireEvent(event.list().ENINGE_READY, {goo:goo});
			},30)
		};

		var removeGooScene = function() {
			//	goo.renderer.domElement.style.opacity = 0.4;
		};

		event.registerListener(event.list().LOAD_3D, setupGooScene);
		event.registerListener(event.list().UN_LOAD_3D, removeGooScene);
	};

	GooController.prototype.updateWorld = function(tpf) {
		this.gooCameraController.updateCamera()
	};

	GooController.prototype.registerGooUpdateCallback = function(callback) {
		this.goo.callbacksPreRender.push(callback);
	//	this.updateCallbacks.push(callback);
	};

	GooController.prototype.propagateGoo = function() {
		GooEntityFactory.setGoo(this.goo);
		GooEffectController.setGoo(this.goo);
	};

	return GooController;

});