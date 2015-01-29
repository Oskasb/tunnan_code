"use strict";


define(['application/EventManager',
    '3d/EnvironmentController',
    'goo/renderer/Camera',
    'goo/entities/components/CameraComponent',
    'goo/entities/EntityUtils',
    'goo/math/Vector3',
    'goo/math/Matrix3x3',
    'goo/entities/components/ScriptComponent',
    '3d/FlightCameraScript',
    '3d/cameras/TransitMode',
    '3d/cameras/PilotMode',
    '3d/cameras/WalkMode',
    '3d/cameras/ExternalCamera'
], function(
    event,
    EnvironemntController,
    Camera,
    CameraComponent,
    EntityUtils,
    Vector3,
    Matrix3x3,
    ScriptComponent,
    FlightCameraScript,
    TransitMode,
    PilotMode,
    WalkMode,
    ExternalCamera
    ) {

	var GooCameraController = function() {

	};

	GooCameraController.prototype.updateCamera = function() {
		updateCamera()
	};

	GooCameraController.prototype.getCamera = function() {
		return camera;
	};

    GooCameraController.prototype.getCameraEntity = function() {
        return cameraEntity;
    };

    var cameraOffset = new Vector3(0, 0.82, 0);

    var cameras = {
        pilotCam:PilotMode,
        transitCam:TransitMode,
        walkCam:WalkMode,
        externalCam:ExternalCamera
    };

    var camScript;
    var cameraEntity;
    var goo;
	var camera;
    var setupGooCamera = function(e) {
        goo = event.eventArgs(e).goo;
        console.log("Setup Goo Camera");

        // Add an orbit cam (so that you can control the camera with the mouse)
        // The parameters here are fetched from the Tool. Feel free to play around.
        camera = new Camera(45, 1, 0.25, 45000);
        cameraEntity = goo.world.createEntity('ViewCameraEntity');
        var cameraComponent = new CameraComponent(camera);
        cameraEntity.setComponent(cameraComponent);
        camScript = new FlightCameraScript({
            domElement: goo.renderer.domElement,
        //    baseDistance: 50,
            spherical: new Vector3([0.55, 0, 0]),
            lookAtPoint: new Vector3(0, 50, 1300),
            worldUpVector: new Vector3([0, 1, 0]),
            zoomSpeed: 0.312407560349,
            maxZoomDistance: 1256,
            minZoomDistance:0.05
        });
        camScript.setCamera(camera);

        camScript.setCameraTarget({pos:new Vector3(0, 100, 0), rot: new Matrix3x3().fromAngles(1.5, 0, 0)}, cameraOffset, null, new cameras["transitCam"]());

    //
    //    cameraEntity.setComponent(new ScriptComponent(camScript));

        cameraEntity.addToWorld();
        EnvironemntController.setCameraEntity(cameraEntity);

    //    goo.world.getSystem('RenderSystem').enableComposers(true);



    };

    var parentGeometry;
    var setCameraParentEntity = function(geometry) {
     //   goo.world.world_root.transformComponent.attachChild(cameraEntity.transformComponent)
        parentGeometry = geometry;



        geometry.transformComponent.attachChild(cameraEntity.transformComponent);
    };

    var handleSetCameraTarget = function(e) {
        var spatial = event.eventArgs(e).spatial;
        goo.world.world_root.spatial = spatial;
        var geometry = event.eventArgs(e).geometry;

        if (!geometry) {
            if (parentGeometry) {
                if (parentGeometry.transformComponent) parentGeometry.transformComponent.detachChild(cameraEntity.transformComponent);
            }
        } else {
            setCameraParentEntity(geometry);
        }

        camScript.updateDragState(1);
        camScript.updatePointerState(1);
		var reset = function() {
			camScript.updateDragState(0);
			camScript.updatePointerState(0);
		};

		event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:reset, wait:50});

        camScript.setCameraTarget(spatial, cameraOffset, goo.world.world_root.spatial, new cameras[event.eventArgs(e).controlScript]());
		var unpause = function() {
			camScript.setPaused(false);
		};
		event.fireEvent(event.list().SEQUENCE_CALLBACK, {callback:unpause, wait:50});

	};


	var handleScenarioExit = function() {

		camScript.setPaused(true);

	//	camScript.setCameraTarget(goo.world.world_root.spatial, cameraOffset, goo.world.world_root.spatial, cameras.transitCam);
	};

    var handleMouseAction = function(e) {
        var xy = event.eventArgs(e).xy;
        camScript.updateDeltas(xy[0], xy[1])
    };

    var drag;
    var handleStartCameraDrag = function() {
        camScript.updateDragState(1);
        drag = true;
    };

    var handleCameraStopDrag = function() {
        camScript.updateDragState(0);
        drag = false;
    };

    var handleMouseWheelDelta = function(e) {
        var delta = event.eventArgs(e).delta;
        camScript.setWheelDelta(delta);
        if (!drag) camScript.applyReleaseDrift();
    };

    var handleStopPointerDrag = function() {
        camScript.updatePointerState(0);
    };

    var handleStartPointerDrag = function() {
        camScript.updatePointerState(1);
    };

	var handleSetCameraAnalogs = function(e) {

		console.log("Set camera analogs: ", event.eventArgs(e))
		camScript.move(event.eventArgs(e).rotX* -0.05, event.eventArgs(e).rotY* -0.05)
	};

	var updateCamera = function() {
		camScript.updateCam(cameraEntity)
	};

//	event.registerListener(event.list().RENDER_TICK, updateCamera);

    event.registerListener(event.list().START_POINTER_DRAG, handleStartPointerDrag);
 //   event.registerListener(event.list().STOP_POINTER_DRAG, handleStopPointerDrag);
    event.registerListener(event.list().START_CAMERA_DRAG, handleStartCameraDrag);
    event.registerListener(event.list().STOP_CAMERA_DRAG, handleCameraStopDrag);
    event.registerListener(event.list().MOUSE_POSITION_UPDATE, handleMouseAction);
    event.registerListener(event.list().MOUSE_WHEEL_UPDATE, handleMouseWheelDelta);
    event.registerListener(event.list().ENINGE_READY, setupGooCamera);
    event.registerListener(event.list().SET_CAMERA_TARGET, handleSetCameraTarget);

	event.registerListener(event.list().SET_CAMERA_ANALOGS, handleSetCameraAnalogs);
	event.registerListener(event.list().EXIT_SCENARIO, handleScenarioExit);

	return GooCameraController

});