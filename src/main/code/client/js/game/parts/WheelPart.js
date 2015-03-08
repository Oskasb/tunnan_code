"use strict";

define([
    "application/EventManager",
    "3d/GooJointAnimator",
    'game/GameUtil',
    '3d/HeightmapManager',
    'physics/PhysicalWorld',
    'game/world/PhysicalWorld',
    "goo/math/Vector3",
    "goo/math/Matrix3x3"
],
    function(event,
             GooJointAnimator,
             gameUtil,
             HeightmapManager,
             PhysicalWorld,
             WorldPhysicalWorld,
             Vector3,
             Matrix3x3
        ) {
        var groundDist;
        var calcVec = new Vector3();
        var calcVec2 = new Vector3();
        var calcMat3 = new Matrix3x3();
        function WheelPart(wheelId, wheelData) {
            this.wheelId = wheelId;
            this.controlId = wheelData.control;
            this.controlAxis = wheelData.axis || [1, 0, 0];
            this.pos = new Vector3(wheelData.pos);
            this.worldPos = new Vector3();
            this.angle = 0;
            this.forceVector = new Vector3();
            this.dragCoeff = wheelData.drag;
            this.breakMax = wheelData.breakMax;
            this.radius = wheelData.radius;
            this.suspBone = wheelData.suspension.boneId;
            this.suspRange = wheelData.suspension.range;
            this.suspStiffness = wheelData.suspension.stiffness;
            this.suspAxis = wheelData.suspension.axis;
            this.compressionLoss = 0;
            this.stage = 1;
            this.springCompression = 0;
            this.wheelSpeed = 0;
            this.wheelRot = 0;
			this.groundVelocity = new Vector3(0, 0, 0);
        }

        var updateBoneRotation = function(entity, wheelBoneId, dRot) {
            var boneId = entity.pieceData.boneMap[wheelBoneId];
			if (boneId == undefined) return;
            var bone = entity.animationChannels[boneId];
            GooJointAnimator.rotateBone(bone, dRot, 0, 0)
        };



        var addBoneRotation = function(entity, wheelBoneId, dRot) {
            var boneId = entity.pieceData.boneMap[wheelBoneId];
			if (boneId == undefined) return;
            var bone = entity.animationChannels[boneId];
            GooJointAnimator.addRotationToBone(bone, dRot, 0, 0)
        };

        var updateSuspensionBone = function(entity, suspBone, comp, axis) {
            var boneId = entity.pieceData.boneMap[suspBone];
			if (boneId == undefined) return;
            var bone = entity.animationChannels[boneId];
            GooJointAnimator.translateBone(bone, [axis[0]*-comp , axis[1]*-comp, axis[2]*-comp])
        };

		WheelPart.prototype.setGroundVelocity = function(vec3) {
			this.groundVelocity.setVector(vec3);
		};



        WheelPart.prototype.updateWheelRotation = function(entity, speed) {
            //    var springForce = calcVec.set(0, springCompression*this.suspStiffness, 0)
            //    var drag = entity.spatial.ve

            if (this.springCompression) {
                this.wheelSpeed = speed / this.radius;
             //   this.wheelSpeed = Math.random();

            } else {
                this.wheelSpeed *= 0.995+(Math.random()*0.003);
            }
            this.wheelRot += this.wheelSpeed;

            updateBoneRotation(entity, this.wheelId, this.wheelRot);
        };

        WheelPart.prototype.compressedSuspensionForce = function(entity, speed, compAmp, controlValue) {
            var controlForce = 0;

        //    calcMat3.lookAt(groundNormal, Vector3.UNIT_Z);
            var breakForce = entity.systems.breaks.currentState*this.breakMax;
        //    entity.spatial.velocity.mul([1, 0.999, 1]);
            if (entity.systems.breaks.currentState > 0.2 && speed < 0.02) {
                entity.spatial.velocity.mul(0.958);
                entity.spatial.angularVelocity.data[1]*0.98;
            }
            controlForce = -controlValue*70000;
            calcVec = entity.spatial.rot.toAngles();
            calcVec.dot(groundNormal);
        //    calcMat3.fromAngles(groundNormal.data[0], groundNormal.data[1], groundNormal.data[2]);

        //    calcMat3.add(entity.spatial.rot)


           this.forceVector.data[0] = this.forceVector.data[0]*0.5-entity.spatial.axisAttitudes.data[0]*this.breakMax*speed*10 + controlForce*entity.spatial.axisAttitudes.data[2]*speed;
           this.forceVector.data[1] = compAmp*this.suspStiffness*this.stage;
           this.forceVector.data[2] = this.forceVector.data[2]*0.95 -breakForce*entity.spatial.axisAttitudes.data[2]*speed / (speed+1.95/breakForce) -breakForce*speed;
         //   this.forceVector.set(xForce, yForce, zForce);
            this.forceVector.dot(calcVec);
       //     calcMat3.applyPost(this.forceVector);
       //     this.forceVector.set(calcVec);
       //
        //    this.forceVector.dot(groundNormal);
        };

        WheelPart.prototype.calcWheelForceVector = function(entity) {
        //    var springForce = calcVec.set(0, springCompression*this.suspStiffness, 0)
        //    var drag = entity.spatial.ve
            var drag = 0;
            var compAmp = (this.springCompression+this.compressionLoss);
            updateSuspensionBone(entity, this.suspBone, this.suspRange-compAmp, this.suspAxis);

			calcVec.set(entity.spatial.velocity);

			calcVec.subVector(this.groundVelocity)

			var speed = calcVec.length() + entity.spatial.angularVelocity.data[1]*(this.pos.data[2]-this.pos.data[0]);

        //    var speed = entity.spatial.speed + entity.spatial.angularVelocity.data[1]*(this.pos.data[2]-this.pos.data[0]);


            var controlValue = 0;
            if (this.controlId) {
                var controlValue = this.controlAxis[0]*entity.surfaces[this.controlId].currentState*0.2;
                controlValue = controlValue / Math.max(speed*2, 0.25);
                updateBoneRotation(entity, this.suspBone, controlValue*1.2);
            }

            if (compAmp) {
                this.compressedSuspensionForce(entity, speed, compAmp, -controlValue);
                entity.spatial.angularVelocity.data[0] *= 0.98;
                entity.spatial.angularVelocity.data[1] *= 0.97;
                entity.spatial.angularVelocity.data[2] *= 0.98;
                entity.forces.torque.mul(0.98);
            } else {
                this.forceVector.set(0, 0, 0);
            }
            return speed;
        };

        var fraction;
    //    var meshHit;
        var groundNormal = new Vector3();
        WheelPart.prototype.calcSpringCompression = function(entity) {


            calcVec.set(this.pos);
            this.worldPos.set(entity.spatial.pos);
            var pos = gameUtil.applyRotationToVelocity(entity.geometries[0], calcVec);
            this.worldPos.add(pos);
            calcVec.set(this.worldPos);
            calcVec.data[1] += 1;
            calcVec2.set(this.worldPos);
            calcVec2.data[1] -= this.suspRange;
            var meshHit = PhysicalWorld.physicsRayRange(calcVec.data, calcVec2.data);

            if (meshHit) {
                calcVec.sub(calcVec2);
                groundDist = ((meshHit.fraction*Math.sqrt(calcVec.lengthSquared()))-1);
                groundNormal.set(meshHit.normal.getX(), meshHit.normal.getY(), meshHit.normal.getZ());
                var worldHit = WorldPhysicalWorld.checkSpatialConflict(entity, 100);

                if (entity.cable) {
                    entity.cable.updateHookedPlane(entity);
                } else {
                    if (worldHit.entity) {
                        entity.groundEntity = worldHit.entity;
                        if (worldHit.part.partId == "cable") {
                            entity.spatial.velocity.mul(0.95);
                            console.log(worldHit.part.partId, worldHit);
                            worldHit.entity.cables[worldHit.part.cableNr].catchPlane(entity);
                        }
                        //    event.fireEvent(event.list().CARRIER_HOOK_ENTITY, {carrier:worldHit.entity, plane:entity})
                    }
                }

            } else {
                entity.groundEntity = null;
                groundDist = HeightmapManager.getHeightAboveGroundAtPos(this.worldPos.data);
                if (groundDist < 100) groundNormal.set(HeightmapManager.getGroundNormal(this.worldPos.data));
                if (!groundDist) groundDist = 100;
            }

            var frameCompress = this.suspRange - Math.min(groundDist, this.suspRange);

        //    if (this.springCompression < frameCompress) {
                this.compressionLoss = frameCompress - this.springCompression*1.2;
                this.retraction = 0;
        //    } else {
        //        this.compressionLoss = 0;
        //        this.retraction = 0.5;
        //    }
            this.springCompression = frameCompress;
        //    if (this.springCompression > 0) console.log("Suspension grounded!", this.springCompression)

            if (this.springCompression - this.suspRange > 0) this.stage = 5;
        };

        WheelPart.prototype.updateForceVector = function(entity) {
            this.calcSpringCompression(entity);
            var speed = this.calcWheelForceVector(entity);
            this.updateWheelRotation(entity, speed);
			this.groundVelocity.mulDirect(0.9999, 0.9999,0.9999);
        };


    return WheelPart;
})