define([
	'application/EventManager',
	'physics/PhysicalWorld',
	'goo/math/Vector2',
	'goo/math/Vector3',
	'goo/math/Matrix3x3',
	'goo/math/MathUtils',

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


		var PilotMode = function() {
			this.vehicle = null;
			this.calcVec = new Vector3();
			this.calcVec2 = new Vector3();
			this.calcVec3 = new Vector3();
			this.calcMat = new Matrix3x3();
			this.lastRot = new Matrix3x3();
			this.targetOffset = new Vector3(0, 0.82, 0);
			this.targetSpatial = null;

			this.lookAtPoint = new Vector3();
			this.camPos = new Vector3();
			this.camDistance = 0.15;
			this.worldUpVector = new Vector3(0,1,0);
			this.camera = null;
			this.baseFov = 45;
			this.fov = 45;
			this.targetFov = this.baseFov;
			this.baseZoomIndex = 2;
			this.zoomIndex = 1;
			this.zoomStages = [
				{fov:this.baseFov-27, distance:0.21},
			//	{fov:this.baseFov-11, distance:0.22},
				{fov:this.baseFov+3,  distance:0.24},
			//	{fov:this.baseFov+18, distance:0.26},
				{fov:this.baseFov+28, distance:0.28}
			];
		}






		PilotMode.prototype.setTargetSpatial = function(spat) {
			this.targetSpatial = spat;
		}



		PilotMode.prototype.setTargetOffset = function(offset) {
			this.targetOffset = offset;
		}

		PilotMode.prototype.setFov = function(fv) {
			this.targetFov = fv;

		}

		PilotMode.prototype.updateZoomLevel = function() {
			this.setFov(this.zoomStages[this.zoomIndex].fov);
			this.camDistance = this.zoomStages[this.zoomIndex].distance
		}

		PilotMode.prototype.changeZoomLevel = function(delta) {
			if (delta < 0) {
				delta = -1;
			} else {
				delta = 1;
			}

			this.zoomIndex += delta;
			if (this.zoomIndex < 0) this.zoomIndex = 0;
			if (this.zoomIndex >= this.zoomStages.length) {
				this.zoomIndex = this.baseZoomIndex;
				event.fireEvent(event.list().SET_CAMERA_TARGET, {spatial:this.targetSpatial, controlScript:"externalCam"});
				return;
			}
			this.updateZoomLevel()
		}

		PilotMode.prototype.setZoomIndex = function(index) {
			this.zoomIndex = index;
			this.updateZoomLevel();
		}

		PilotMode.prototype.adjustFov = function(delta) {
			this.changeZoomLevel(delta);
		}

		PilotMode.prototype.setCamDistance = function(distance) {
			//    adjustFov(1-(0.5-distance));
			//    camDistance = distance;
		}

		PilotMode.prototype.getCamDistance = function() {
			return this.camDistance;
		}

		PilotMode.prototype.getRollInfluence = function() {
			return 0.8  // - Math.max(1.2 * this.targetSpherical.x*0.05, 0);
		}

		PilotMode.prototype.getRotInfluence = function() {
			return 0.5  // - Math.max(1.2 * this.targetSpherical.x*0.05, 0);
		}


		PilotMode.prototype.adjustPhysical = function(camPoint) {
			this.calcVec.set(camPoint);

			this.targetSpatial.rot.applyPost(this.calcVec);

			this.calcVec.add(this.targetSpatial.pos);
			this.calcVec3.set(this.targetSpatial.pos);
			this.calcVec3.add(this.lookAtPoint);

			var hit = PhysicalWorld.physicsRayRange(this.calcVec3, this.calcVec);

			if (hit) {
				camPoint.mul(hit.fraction);
			}
			camPoint.mul(0.5);
			return camPoint;
		}

		PilotMode.prototype.calcCamPos = function(cartesian) {
			//    setCamDistance(targetSpherical.x);
			this.lookAtPoint.set(this.targetOffset);
			this.camPos.set(this.targetOffset);

			this.calcVec.set(this.targetOffset);
			this.calcVec.add(this.targetSpatial.pos);

			cartesian.add(0, this.camDistance*this.camDistance*0.5, 0);

			this.calcVec.add(cartesian);

			this.calcVec2.set(this.targetSpatial.pos);
			this.calcVec2.add(this.camPos);


			this.camPos.add(cartesian);
			return this.camPos;
		}

		PilotMode.prototype.calcCamRot = function(entity) {
			var transformComponent = entity.transformComponent;
			var transform = transformComponent.transform;

			transform.translation.set(this.camPos);
			this.calcMat.set(this.targetSpatial.rot);
			this.calcMat.invert();
			this.calcVec.set(this.worldUpVector);
			this.calcMat.applyPost(this.calcVec);
			this.calcVec.lerp(this.worldUpVector, this.getRollInfluence());

			this.calcVec.add(this.vehicle.spatial.angularVelocity);

			this.calcVec3.set(this.camPos)
			this.calcVec3.sub(this.lookAtPoint);

			this.calcVec3.mul(-1);
			transform.rotation.lookAt(this.calcVec3, this.calcVec);
			var vel = Math.sqrt(this.vehicle.spatial.velocity.lengthSquared());
			transform.rotation.rotateX(-this.vehicle.spatial.angularVelocity.data[0]*5*vel);
			transform.rotation.rotateY(-this.vehicle.spatial.angularVelocity.data[1]*5*vel);
			transform.rotation.rotateZ(-this.vehicle.spatial.angularVelocity.data[2]*5*vel);

			return transform;
		}

		PilotMode.prototype.releaseDrift = function(targetSpherical) {
			targetSpherical.y = Math.PI * 1.5 // / 2;
			targetSpherical.z = -0.01 +0.02*Math.sqrt(targetSpherical.x);

		}

		PilotMode.prototype.pointerAction = function(targetSpherical) {
			//    setZoomIndex(baseZoomIndex);
			targetSpherical.y = Math.PI * 1.5 // / 2;
			//    targetSpherical.z = -0.01 +0.02*Math.sqrt(targetSpherical.x);

		}

		PilotMode.prototype.setCamera = function(cam) {
			this.camera = cam;
			this.setZoomIndex(this.baseZoomIndex);
			this.vehicle = playerController.getPlayerEntity();
		}

		return PilotMode;

	});
