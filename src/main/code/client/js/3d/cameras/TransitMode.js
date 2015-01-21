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

		var TransitMode = function() {
			this.vehicle = null;
			this.calcVec = new Vector3();
			this.calcVec2 = new Vector3();
			this.calcVec3 = new Vector3();
			this.lastZoom = new Vector3();
			this.calcMat = new Matrix3x3();
			this.lastRot = new Matrix3x3();
			this.targetOffset = new Vector3(0, 1.52, 3);
			this.targetSpatial = null;
			this.lookAtPoint = new Vector3();
			this.camPos = new Vector3();
			this.camDistance = 0.15;
			this.worldUpVector = new Vector3(0,1,0);
			this.camera = null;
			this.baseFov = 45;
			this.targetFov = this.baseFov;
				this.fov = this.baseFov;
			this.baseZoomIndex = 0;
			this.zoomIndex = null;


			this.zoomStages = [
				{fov:this.baseFov-6,  distance:7},
				{fov:this.baseFov-8,  distance:5},
				{fov:this.baseFov+7,  distance:75}
			];
		};



		TransitMode.prototype.setTargetSpatial = function(spat) {
			this.targetSpatial = spat;
		}



		TransitMode.prototype.setTargetOffset = function(offset) {
			this.targetOffset = offset;
		}

		TransitMode.prototype.setFov = function(fv) {
			this.targetFov = fv;
		}

		TransitMode.prototype.updateZoomLevel = function() {
			this.setFov(this.zoomStages[this.zoomIndex].fov);
			this.camDistance = this.zoomStages[this.zoomIndex].distance
		}

		TransitMode.prototype.changeZoomLevel = function(delta) {
			this.updateZoomLevel()
		}

		TransitMode.prototype.setZoomIndex = function(index) {
			this.zoomIndex = index;
			this.updateZoomLevel();
		}

		TransitMode.prototype.adjustFov = function(delta) {
			this.changeZoomLevel(delta);
		}

		TransitMode.prototype.setCamDistance = function(distance) {
			//    adjustFov(1-(0.5-distance));
			//    camDistance = distance;
		}

		TransitMode.prototype.getCamDistance = function() {
			return this.camDistance;
		}

		TransitMode.prototype.getRollInfluence = function() {
			return 0.8  // - Math.max(1.2 * this.targetSpherical.x*0.05, 0);
		}

		TransitMode.prototype.getRotInfluence = function() {
			return 0.5  // - Math.max(1.2 * this.targetSpherical.x*0.05, 0);
		}


		TransitMode.prototype.adjustPhysical = function(camPoint) {
			this.calcVec.set(camPoint);
			this.targetSpatial.rot.applyPost(this.calcVec);
			this.calcVec.add(this.targetSpatial.pos);
			this.calcVec3.set(this.targetSpatial.pos);
			this.calcVec3.add(this.lookAtPoint);

			/*
			 var hit = PhysicalWorld.physicsRayRange(calcVec3.data, calcVec.data);

			 if (hit) {
			 calcVec.mul(hit.fraction*0.7);
			 }
			 */

			camPoint.add(this.calcVec);
			return camPoint;
		}

		TransitMode.prototype.calcCamPos = function(cartesian) {

			this.calcVec.set(this.targetOffset);



			this.targetSpatial.rot.applyPost(this.calcVec);
			//    targetSpatial.rot.applyPost(cartesian);
			this.calcVec.add(cartesian);

			this.camPos.set(this.targetSpatial.pos);
			this.camPos.add(this.calcVec);
			return this.camPos;
		}

		TransitMode.prototype.calcCamRot = function(entity) {
			var transformComponent = entity.transformComponent;
			var transform = transformComponent.transform;
			this.calcVec.set(2, 2, -2);
			this.targetSpatial.rot.applyPost(this.calcVec)
			this.camPos.add(this.calcVec);
			transform.translation.set(this.camPos);
			this.calcMat.set(this.targetSpatial.rot);
			this.calcMat.invert();
			this.calcVec.set(this.worldUpVector);
			//   calcMat.applyPost(calcVec);
			//  calcVec.lerp(worldUpVector, getRollInfluence());


			this.calcVec3.set(this.camPos);
			this.calcVec3.sub(this.targetSpatial.pos);

			//   calcVec2.set(0, 0, camDistance*0.002);

			//    lastZoom.lerp(calcVec2, 0.15);

			this.calcVec3.mul(-1);
			transform.rotation.lookAt(this.calcVec3, this.calcVec);

			return transform;
		}

		TransitMode.prototype.releaseDrift = function(targetSpherical) {
			//    targetSpherical.y = Math.PI * 1.5 // / 2;
			//    targetSpherical.z = -0.01 +0.02*Math.sqrt(targetSpherical.x);

		}

		var pointerDown;
		TransitMode.prototype.pointerAction = function(targetSpherical, state) {
			//   if (state) {
			//       targetSpherical.y = Math.PI * 1.5; // / 2;
			//       targetSpherical.z = -0.01 +0.02*Math.sqrt(targetSpherical.x);
			//   }
		}

		TransitMode.prototype.setCamera = function(cam) {
			this.camera = cam;
			this.setZoomIndex(this.baseZoomIndex);
		}

		return TransitMode

	});
