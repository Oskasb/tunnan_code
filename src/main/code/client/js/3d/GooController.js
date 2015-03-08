"use strict"


define([
	'application/Settings',
	'application/EventManager',
	'goo/animationpack/systems/AnimationSystem',
	'3d/GooCameraController',
    '3d/GooEntityFactory',
    '3d/GooEffectController',
    'goo/entities/components/ScriptComponent',
    'goo/entities/GooRunner',
	'goo/renderer/Renderer',
    'goo/math/Vector3',
	'goo/animationpack/handlers/SkeletonHandler',
	'goo/animationpack/handlers/AnimationComponentHandler',
	'goo/animationpack/handlers/AnimationStateHandler',
	'goo/animationpack/handlers/AnimationLayersHandler',
	'goo/animationpack/handlers/AnimationClipHandler',
	'goo/passpack/PosteffectsHandler',
	'goo/renderer/Texture',
	'goo/math/Vector'

], function(
	Settings,
    event,
	AnimationSystem,
	GooCameraController,
    GooEntityFactory,
    GooEffectController,
    ScriptComponent,
    GooRunner,
	Renderer,
    Vector3,
	Texture,
	Vector
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


		var adjustPxScale = function(value) {
			console.log("Adjust Px Scale: ", value)
			goo.renderer.downScale = value;
		};

		Settings.getSetting('display_pixel_scale').addOnChangeCallback(adjustPxScale);

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

	var monkeypatchCustomEngine = function() {

		var prot = Vector.prototype;

		Vector = function(size) {
			this.data = new Float64Array(size);
		};


		var width = 0;
		var height = 0;



		var width = window.innerWidth;
		var height = window.innerHeight;

		var handleResize = function() {
			width = window.innerWidth;
			height = window.innerHeight;
		};

		window.addEventListener('resize', handleResize);

		Renderer.prototype.checkResize = function (camera) {
			var devicePixelRatio = this.devicePixelRatio = this._useDevicePixelRatio && window.devicePixelRatio ? window.devicePixelRatio / this.svg.currentScale : 1;

			var adjustWidth = width * devicePixelRatio / this.downScale;
			var adjustHeight = height * devicePixelRatio / this.downScale;

			var fullWidth = adjustWidth;
			var fullHeight = adjustHeight;

			if (camera && camera.lockedRatio === true && camera.aspect) {
				adjustWidth = adjustHeight * camera.aspect;
			}

			var aspect = adjustWidth / adjustHeight;
			this.setSize(adjustWidth, adjustHeight, fullWidth, fullHeight);

			if (camera && camera.lockedRatio === false && camera.aspect !== aspect) {
				camera.aspect = aspect;
				if (camera.projectionMode === 0) {
					camera.setFrustumPerspective();
				} else {
					camera.setFrustum();
				}
				camera.onFrameChange();
			}
		};

	};

	monkeypatchCustomEngine();

	return GooController;

});