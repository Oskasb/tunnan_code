define([
	'application/EventManager',
	'physics/PhysicalWorld',
	'goo/math/Vector2',
	'goo/math/Vector3',
	'goo/math/Matrix3x3',
	'goo/math/MathUtils'
],
	function (
		event,
		PhysicalWorld,
		Vector2,
		Vector3,
		Matrix3x3,
		MathUtils) {
		"use strict";

		var playerController;
		require(['game/player/PlayerController'], function(pc) {
			playerController = pc;
		});

		var ExternalCamera = function() {

			this.vehicle = null;
			this.calcVec = new Vector3();
			this.calcVec2 = new Vector3();
			this.calcVec3 = new Vector3();
			this.lastZoom = new Vector3();
			this.calcMat = new Matrix3x3();
			this.lastRot = new Matrix3x3();
			this.targetOffset = new Vector3(0, -0.52, -6);
			this.targetSpatial = null;
			this.lookAtPoint = new Vector3();
			this.camPos = new Vector3();
			this.camDistance = 0.15;
			this.worldUpVector = new Vector3(0,1,0);
			this.camera = null;
			this.baseFov = 45;
			this.targetFov = this.baseFov;
			this.fov = this.baseFov;
			this.baseZoomIndex = 1;
			this.zoomIndex = 1;
			this.vehicleLength = 10;
			this.zoomStages = [
				{fov:this.baseFov-12,  distance:this.vehicleLength*0.5},
				{fov:this.baseFov-8,   distance:this.vehicleLength*1.1},
				{fov:this.baseFov,     distance:this.vehicleLength*3},
				{fov:this.baseFov+7,   distance:this.vehicleLength*7},
				{fov:this.baseFov+15,  distance:this.vehicleLength*12}
			];

		}

		ExternalCamera.prototype.setTargetSpatial = function(spat) {
			this.targetSpatial = spat;
		}



		ExternalCamera.prototype.setTargetOffset = function(offset) {
			this.targetOffset.set(offset);
		}

		ExternalCamera.prototype.setFov = function(fv) {
			this.targetFov = fv;

		}

		ExternalCamera.prototype.updateZoomLevel = function() {
			this.setFov(this.zoomStages[this.zoomIndex].fov);
			this.camDistance = this.zoomStages[this.zoomIndex].distance
		}

		ExternalCamera.prototype.changeZoomLevel = function(delta) {
			if (delta < 0) {
				delta = -1;
			} else {
				delta = 1;
			}

			this.zoomIndex += delta;
			if (this.zoomIndex <= 0) {
				this.zoomIndex = 0;
				event.fireEvent(event.list().SET_CAMERA_TARGET, {spatial:this.targetSpatial, geometry:this.vehicle.pilot.geometries[0], controlScript:"pilotCam"});
				return;
			}
			if (this.zoomIndex >= this.zoomStages.length) {
				this.zoomIndex = this.zoomStages.length -1;
			}
			this.updateZoomLevel()
		}

		ExternalCamera.prototype.setZoomIndex = function(index) {
			this.zoomIndex = index;
			this.updateZoomLevel();
		}

		ExternalCamera.prototype.adjustFov = function(delta) {
			this.changeZoomLevel(delta);
		}

		ExternalCamera.prototype.setCamDistance = function(distance) {
			//    adjustFov(1-(0.5-distance));
			//    camDistance = distance;
		}

		ExternalCamera.prototype.getCamDistance = function() {
			return this.camDistance;
		}

		ExternalCamera.prototype.getRollInfluence = function() {
			return 0.8  // - Math.max(1.2 * this.targetSpherical.x*0.05, 0);
		}

		ExternalCamera.prototype.getRotInfluence = function() {
			return 0.5  // - Math.max(1.2 * this.targetSpherical.x*0.05, 0);
		}


		ExternalCamera.prototype.adjustPhysical = function(camPoint) {
			this.calcVec.set(camPoint);

			this.targetSpatial.rot.applyPost(this.calcVec);

			this.calcVec.add(this.targetSpatial.pos);

			this.calcVec3.add(this.lookAtPoint);


			camPoint.mul(0.5);
			return camPoint;
		};

		var pullFraction = 1;

		ExternalCamera.prototype.calcCamPos = function(cartesian) {

			this.calcVec.set(this.targetOffset);

			this.camPos.set(this.targetSpatial.pos);

			this.targetSpatial.rot.applyPost(this.calcVec);
			cartesian.add(0, this.camDistance*this.camDistance*0.5, 0);
			//    if (pointerDown) targetSpatial.rot.applyPost(cartesian);
			this.calcVec.add(cartesian);

			this.calcVec3.set(this.targetSpatial.pos);
			//	calcVec3.sub(vehicle.spatial.velocity)
			this.calcVec3.add(this.calcVec);
			var hit = PhysicalWorld.physicsRayRange(this.targetSpatial.pos, this.calcVec3);

			if (hit) {
				pullFraction = hit.fraction;
			}

		//	this.calcVec.mul(hit.fraction);

			this.calcVec.mul(0.9 * pullFraction)

			this.camPos.add(this.calcVec);

			pullFraction = MathUtils.lerp(0.07, pullFraction, 1);

			return this.camPos;
		}

		ExternalCamera.prototype.calcCamRot = function(entity) {
			var transformComponent = entity.transformComponent;
			var transform = transformComponent.transform;

			transform.translation.set(this.camPos);
			this.calcMat.set(this.targetSpatial.rot);
			this.calcMat.invert();
			this.calcVec.set(this.worldUpVector);
			this.calcMat.applyPost(this.calcVec);
			this.calcVec.lerp(this.worldUpVector, this.getRollInfluence());
			this.calcVec.add(this.vehicle.spatial.angularVelocity);
			this.calcVec3.set(this.camPos);
			this.calcVec3.sub(this.targetSpatial.pos);
			this.calcVec2.set(0, 0, this.camDistance*0.002);
			this.lastZoom.lerp(this.calcVec2, 0.15);
			this.calcVec3.mul(-1);
			transform.rotation.lookAt(this.calcVec3, this.calcVec);

			transform.rotation.rotateX(-this.vehicle.spatial.angularVelocity.data[0]*3+this.lastZoom.data[2]);
			transform.rotation.rotateY(-this.vehicle.spatial.angularVelocity.data[1]*5+this.lastZoom.data[0]);
			transform.rotation.rotateZ(-this.vehicle.spatial.angularVelocity.data[2]*12+this.lastZoom.data[1]);

			return transform;
		}

		ExternalCamera.prototype.releaseDrift = function(targetSpherical) {
			//    targetSpherical.y = Math.PI * 1.5 // / 2;
			//    targetSpherical.z = -0.01 +0.02*Math.sqrt(targetSpherical.x);

		}

		var pointerDown;
		ExternalCamera.prototype.pointerAction = function(targetSpherical, state) {
			return;
			//   fov = baseFov;
			//   setZoomIndex(baseZoomIndex);
			pointerDown = state;
			if (state) {
				targetSpherical.y = Math.PI * 1.5; // / 2;
				targetSpherical.z = -0.01 +0.02*Math.sqrt(targetSpherical.x);
			}


		}

		ExternalCamera.prototype.setCamera = function(cam) {
			this.camera = cam;
			this.setZoomIndex(this.baseZoomIndex);
			this.vehicle = playerController.getPlayerEntity();
			this.vehicleLength = this.vehicle.pieceData.dimensions.length;
		}

		return ExternalCamera

	});
