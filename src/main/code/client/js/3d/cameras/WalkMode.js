define([
	'physics/PhysicalWorld',
	'goo/math/Vector2',
	'goo/math/Vector3',
	'goo/math/Matrix3x3',
	'goo/math/MathUtils'],
	function (
		PhysicalWorld,
		Vector2,
		Vector3,
		Matrix3x3,
		MathUtils) {
		"use strict";

		var WalkMode = function() {
			this.calcVec = new Vector3();
			this.calcVec2 = new Vector3();
			this.calcVec3 = new Vector3();
			this.calcMat = new Matrix3x3();
			this.targetOffset = new Vector3(0, 1.75, 0);
			this.targetSpatial = null;
			this.lookAtPoint = new Vector3();
			this.camPos = new Vector3();
			this.camDistance = 6;
			this.azimuth = 0.4;
			this.baseFov = 45;
			this.fov = this.baseFov;
			this.targetFov = this.baseFov;
			this.worldUpVector = new Vector3(0,1,0);
			this.camera = null;
		}



		WalkMode.prototype.setTargetSpatial = function(spat) {
			this.targetSpatial = spat;
		}

		WalkMode.prototype.setTargetOffset = function(offset) {
			this.targetOffset = offset;
		}

		WalkMode.prototype.setCamDistance = function(distance) {
			this.camDistance = distance;
		}

		WalkMode.prototype.getCamDistance = function() {
			return this.camDistance;
		}

		WalkMode.prototype.getRollInfluence = function() {
			return 0.8  // - Math.max(1.2 * this.targetSpherical.x*0.05, 0);
		}

		WalkMode.prototype.adjustPhysical = function(camPoint) {
			this.calcVec.set(camPoint);

			this.targetSpatial.rot.applyPost(this.calcVec);

			this.calcVec.add(this.targetSpatial.pos);
			this.calcVec3.set(this.targetSpatial.pos);
			this.calcVec3.add(this.lookAtPoint);

			var hit = PhysicalWorld.physicsRayRange(this.calcVec3.data, this.calcVec.data);

			if (hit) {
				camPoint.mul(hit.fraction);
			}
			camPoint.mul(0.5);
			return camPoint;
		}

		WalkMode.prototype.calcCamPos = function(cartesian) {
			this.lookAtPoint.set(this.targetOffset);
			this.calcVec2.set(cartesian);
			this.calcVec2.add(this.targetOffset);
			this.calcVec.set(this.adjustPhysical(this.calcVec2));
			this.calcVec.add(this.targetOffset);
			this.camPos.set(this.calcVec);
		}

		WalkMode.prototype.calcCamRot = function(entity, targetSpherical) {
			var transformComponent = entity.transformComponent;
			var transform = transformComponent.transform;
			transform.translation.set(this.camPos);
			this.calcVec.set(this.camPos)
			this.calcVec.sub(this.lookAtPoint);
			this.calcVec.mul(-1);
			transform.rotation.lookAt(this.calcVec3, this.calcVec);
			transform.rotation.lookAt(this.calcVec, this.worldUpVector);
			targetSpherical.y = MathUtils.lerp(0.1, targetSpherical.y, Math.PI * 1.5)
		}



		WalkMode.prototype.releaseDrift = function(targetSpherical) {
			//    targetSpherical.y = Math.PI * 1.5 // / 2;
			//    targetSpherical.z = -0.01 +0.02*Math.sqrt(targetSpherical.x);

		}

		WalkMode.prototype.pointerAction = function(targetSpherical) {
			targetSpherical.y = Math.PI * 1.5;
		}

		WalkMode.prototype.setCamera = function(cam) {
			this.camera = cam;
		}

		WalkMode.prototype.adjustFov = function(fv) {
			this.targetFov = fv;
		}

		return WalkMode

	});
