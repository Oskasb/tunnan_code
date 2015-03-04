define([
    "application/EventManager",
    'game/gameConfiguration',
    "physics/ShapePhysics",
    'goo/entities/components/ScriptComponent',
    'goo/math/Vector3',
    "game/GameUtil",
    'goo/math/Matrix3x3',
	'goo/math/MathUtils'
],
    function (
        event,
        gameConfig,
        shapePhysics,
        ScriptComponent,
        Vector3,
        GameUtil,
        Matrix3x3,
		MathUtils
        ) {
        "use strict";

        var angles;
        var trim;
        var ctrlState;
        var ctrlAngles;
        var va = new Vector3(); // Velocity composed Angles of Attack
        var calcVec = new Vector3();
        var calcVec2 = new Vector3();
        var calcVec3 = new Vector3();
        var calcMat = new Matrix3x3();
        var y;
        var pitchYawAngle;
        var aoas;
        var xCross;
        var yCross;
        var zCross;
        var xAoA;
        var yAoA;
        var eArea;
        var dragXSec;
        var dragForce;
        var rollVelocity;
		var pitchVelocity;

        function PlaneWing(entity, data, wingId) {

            this.wingId = data.id;
			this.worldPos = null;
			this.entity = entity;
            this.sourceData = data;
            this.controlIds = [];
            this.controls = {};
            for (var index in data.controls) {
                this.controls[index] = new Vector3(data.controls[index])
            }
            this.pos = new Vector3(data.pos);
            this.size = new Vector3(data.size);
            this.volume = this.size.data[0]*this.size.data[1]*this.size.data[2];
            this.approxRadius = shapePhysics.volumeToApproxRadius(this.volume);

			this.maxLoad = this.entity.pieceData.dimensions.massMax * this.volume  / 10;

            //    console.log("approx rad = ",this.approxRadius)
            this.rot = new Matrix3x3();
            this.rot.fromAngles(data.rot[0], data.rot[1], data.rot[2]);
            this.frameRot = this.rot.clone();
            this.force = new Vector3(0, 0, 0);
            this.drag = new Vector3(0, 0, 0);
            this.formDragCoeff = data.formDragCoeff;
            this.liftCurve = data.liftCurve;
            this.stallLiftCoeff = data.stallLiftCoeff;
			this.angleOfAttack = 0;
			this.angleOfAttackYaw = 0;
			this.dragAmount = 0;
            this.controlSurfaces = {};
			this.waterForce = 0;
			this.integrity = 1;
            this.destroyed = false;
			this.lastFrameForce = new Vector3();
        }



        PlaneWing.prototype.visualize = function() {
			var wing = this;
            if (wing.debugGeometry) {
                for (var i = 0; i < wing.debugGeometry.length; i++) {
                    wing.debugGeometry[i].removeFromWorld();
                }
                delete wing.debugGeometry;
                return;
            }
            var color = [0.5+Math.sin(this.pos[0]*0.5), 0.5+Math.sin(this.pos[1]*0.5), 0.5+Math.sin(this.pos[2]*0.5)];
            wing.debugGeometry = [];
            var frameRot = wing.frameRot;
            var force = wing.force;
            var wing = wing;
            var size =new Vector3()
            size.seta([1,1, 1])
            var applyWingForce = function(forceGeometry) {
                //    forceGeometry.transformComponent.transform.lookAt(force, Vector3.UNIT_Y)
                wing.debugGeometry.push(forceGeometry)
                var setupLiftIndicator = function(geom) {
                    console.log(geom)
                    wing.debugGeometry.push(geom)
                    //    geom.transformComponent.transform.scale.setv(size);
                    //    geom.transformComponent.transform.translation.seta([0, 0, 1.5]);
                    //    primitive.transformComponent.transform.rotation = rot // .toAngles());
                    //    geom.transformComponent.transform.lookAt(force, Vector3.UNIT_Y)
                    geom.setComponent(new ScriptComponent({
                        run: function (geometry) {
                            //    if (!entity.gameSpatial) return;
                            //    force.add_d(0.2, 0.2,0.2)
                            //    geometry.transformComponent.transform.rotation.rotateX(force.data[0]);
                            //    geometry.transformComponent.transform.rotation.rotateY(force.data[1]);
                            //    geometry.transformComponent.transform.rotation.rotateZ(force.data[2]);
                            //    geometry.transformComponent.transform.scale.setv(force)
                            var visForce = force.clone();
                            visForce.data[0] = 0.05+ force.data[0]*0.2// * force.data[0];
                            visForce.data[1] = 0.05 ; // * force.data[1];
                            visForce.data[2] = 0.05
                            var pos = new Vector3();
                            //    pos.data[0] = visForce.data[0] / 2;
                            //    pos.data[1] = visForce.data[1] / 2;
                            //    pos.data[2] = visForce.data[2] ;
                            geom.transformComponent.transform.scale.setv(visForce);
                            var pos = visForce.clone();

                            pos.data[0] = pos.data[0] / 2;
                            geometry.transformComponent.transform.translation.setv(pos);
                            //    geometry.transformComponent.transform.lookAt(visForce, Vector3.UNIT_Y)
                            forceGeometry.transformComponent.setUpdated();
                            geometry.transformComponent.setUpdated();
                        }
                    }));
                };

                var setupYawIndicator = function(geom) {
                    console.log(geom)
                    wing.debugGeometry.push(geom)
                    //    geom.transformComponent.transform.scale.setv(size);
                    //    geom.transformComponent.transform.translation.seta([0, 0, 1.5]);
                    //    primitive.transformComponent.transform.rotation = rot // .toAngles());
                    //    geom.transformComponent.transform.lookAt(force, Vector3.UNIT_Y)
                    geom.setComponent(new ScriptComponent({
                        run: function (geometry) {
                            //    if (!entity.gameSpatial) return;
                            //    force.add_d(0.2, 0.2,0.2)
                            //    geometry.transformComponent.transform.rotation.rotateX(force.data[0]);
                            //    geometry.transformComponent.transform.rotation.rotateY(force.data[1]);
                            //    geometry.transformComponent.transform.rotation.rotateZ(force.data[2]);
                            //    geometry.transformComponent.transform.scale.setv(force)
                            var visForce = force.clone();
                            visForce.data[0] = 0.05// * force.data[0];
                            visForce.data[1] = 0.05 + force.data[1]*0.1; // * force.data[1];
                            visForce.data[2] = 0.05
                            var pos = new Vector3();
                            //    pos.data[0] = visForce.data[0] / 2;
                            //    pos.data[1] = visForce.data[1] / 2;
                            //    pos.data[2] = visForce.data[2] ;
                            geom.transformComponent.transform.scale.setv(visForce);
                            var pos = visForce.clone();
                            pos.data[1] = pos.data[1] / 2;
                            geometry.transformComponent.transform.translation.setv(pos);
                            //    geometry.transformComponent.transform.lookAt(visForce, Vector3.UNIT_Y)
                            forceGeometry.transformComponent.setUpdated();
                            geometry.transformComponent.setUpdated();
                        }
                    }));
                };

                var setupDragIndicator = function(geom) {
                    wing.debugGeometry.push(geom)
                    geom.setComponent(new ScriptComponent({
                        run: function (geometry) {
                            //    if (!entity.gameSpatial) return;
                            //    force.add_d(0.2, 0.2,0.2)
                            //    geometry.transformComponent.transform.rotation.rotateX(force.data[0]);
                            //    geometry.transformComponent.transform.rotation.rotateY(force.data[1]);
                            //    geometry.transformComponent.transform.rotation.rotateZ(force.data[2]);
                            //    geometry.transformComponent.transform.scale.setv(force)
                            var visForce = force.clone();
                            visForce.data[0] = 0.05;
                            visForce.data[1] = 0.05;
                            visForce.data[2] = 0.05+force.data[2] * 0.5;
                            geom.transformComponent.transform.scale.setv(visForce);
                            var pos = visForce.clone();
                            pos.data[2] = pos.data[2] / 2;
                            geometry.transformComponent.transform.translation.setv(pos);
                            geometry.transformComponent.transform.lookAt(visForce, Vector3.UNIT_Y)
                            //    forceGeometry.transformComponent.transform.lookAt(force, Vector3.UNIT_Y)
                            //    geometry.transformComponent.transform.lookAt(force, Vector3.UNIT_Y)
                            //    forceGeometry.transformComponent.setUpdated();
                            geometry.transformComponent.setUpdated();
                        }
                    }));
                };



                event.fireEvent(event.list().BUILD_GOO_PRIMITIVE, {parentGooEntity:forceGeometry, shape:"Box", pos:new Vector3(0, 0, 0), rot:new Matrix3x3(), size:size, color:color, callback:setupLiftIndicator});
                event.fireEvent(event.list().BUILD_GOO_PRIMITIVE, {parentGooEntity:forceGeometry, shape:"Box", pos:new Vector3(0, 0, 0), rot:new Matrix3x3(), size:size, color:color, callback:setupYawIndicator});
                event.fireEvent(event.list().BUILD_GOO_PRIMITIVE, {parentGooEntity:forceGeometry, shape:"Box", pos:new Vector3(0, 0, 0), rot:new Matrix3x3(), size:size, color:color, callback:setupDragIndicator});

            };



            var applyVisualWing = function(wingGeometry) {
                var rot = wing.frameRot;
                wingGeometry.wing = wing;
                wing.debugGeometry.push(wingGeometry);
                wingGeometry.setComponent(new ScriptComponent({
                    //    var wing = wing;
                    run: function (geometry) {


						if (wing.destroyed) {
							geometry.transformComponent.transform.scale.set(0.5) // (controls[wing.controlId], angles[1], angles[2]); // .toAngles());
							geometry.transformComponent.setUpdated();
						}

                        if (!wing.controlIds.length) return;
                        //    force.add_d(0.2, 0.2,0.2)
                        //    var angles = rot.toAngles().data;
                        //    wing.frameRot.fromAngles(controls[wing.controlId], angles[1], angles[2])
                        geometry.transformComponent.transform.rotation = geometry.wing.frameRot // (controls[wing.controlId], angles[1], angles[2]); // .toAngles());
                        geometry.transformComponent.setUpdated();
                    }
                }));
                wingGeometry.transformComponent.setUpdated();
            };


            event.fireEvent(event.list().BUILD_GOO_PRIMITIVE, {parentGooEntity:wing.entity.geometries[0], shape:"Box", pos:this.pos, rot:this.rot, size:this.size, color:[color[0]*0.6, color[1]*0.6,color[2]*0.6], callback:applyVisualWing});
            event.fireEvent(event.list().BUILD_GOO_PRIMITIVE, {parentGooEntity:wing.entity.geometries[0], shape:"Sphere", pos:this.pos, rot:new Matrix3x3(), size:new Vector3(0.2, 0.2, 0.2), color:[color[0]*0.3, color[1]*0.3,color[2]*0.3], callback:applyWingForce});

        };

        PlaneWing.prototype.addControlSurface = function(name, surface) {
            this.controlSurfaces[name] = surface;
        };


        PlaneWing.prototype.setAoAControl = function(control) {
            this.controlIds.push(control);
        };


		PlaneWing.prototype.attitudeAffectedLift = function(coeff, AoA) {
			if (isNaN(AoA)) {
				console.log("NaN: AoA", this);
				return 0;
			}
			var force = coeff * GameUtil.fitValueInCurve(AoA, this.liftCurve);
			if (Math.abs(force) > this.maxLoad) {
				this.applyDamageToWing(0.99);
				force = 0;
			}
            return force;
//            return shapePhysics.applyStallCurve(wing.stallAngle[0], wing.stallLiftCoeff[0], AoA, wing.liftCurve)
        };

		PlaneWing.prototype.calcAxisLift = function(Axis) {

		};


        PlaneWing.prototype.updateControlledRotation = function() {
       //     return
            if (this.controlIds.length == 0) return;
            angles = this.rot.toAngles();
            ctrlAngles = [0, 0, 0];
            ctrlState = 0;
            trim = 0;
            for (var i = 0; i < this.controlIds.length; i++) {
     //           addControlStateToWingSurfaceRotation(wing.controlIds[i]);
                if (this.entity.surfaces[this.controlIds[i]].trimState) trim += this.entity.surfaces[this.controlIds[i]].trimState;
                ctrlState = trim + this.entity.surfaces[this.controlIds[i]].currentState // *Math.abs(entity.surfaces[wing.controlIds[i]].currentState));
                ctrlAngles[0] += ctrlState*this.controls[this.controlIds[i]][0];
                ctrlAngles[1] += ctrlState*this.controls[this.controlIds[i]][1];
                ctrlAngles[2] += ctrlState*this.controls[this.controlIds[i]][2];
            }

			this.frameRot.fromAngles(ctrlAngles[0] + angles.data[0],ctrlAngles[1] + angles.data[1], ctrlAngles[2] + angles.data[2]);
        };




		PlaneWing.prototype.applyDamageToWing = function(damageAmount) {
			console.log("Wing Damaged: ",this)

			event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound().MAIN_HIT_0, pos:this.worldPos.data, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
			event.fireEvent(event.list().PUFF_BLACK_SMOKE, 		{pos:this.worldPos.data, count:2, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
			event.fireEvent(event.list().FLASH_MUZZLE_FIRE, 	{pos:this.worldPos.data, count:2, dir:[0.2*(Math.random()-0.5), 0.1+Math.random(), 0.2*(Math.random()-0.5)]})
			event.fireEvent(event.list().FLASH_SPARKS, 			{pos:this.worldPos.data, count:2, dir:[Math.random()-0.5, 0.1+Math.random(), Math.random()-0.5]})

		//	this.size.mul(1-damageAmount);

			this.integrity *= damageAmount;
		//	this.formDragCoeff = this.formDragCoeff / (1-damageAmount);
		};

		PlaneWing.prototype.applyWaterInfluence = function(y, density) {
			this.entity.spatial.angularVelocity.mul(0.9);
			var displacement = shapePhysics.calcSphereDisplacement(this.approxRadius, y);


			if (Math.random() < 0.3 && this.entity.spatial.speed > 0.1 + 5.5*Math.random()) {
				if (Math.random() < 0.2) event.fireEvent(event.list().SPLASH_RINGLET, {pos:[this.worldPos.data[0], 0.5, this.worldPos.data[2]], count:1, dir:[0, 0, 0]});
				if (Math.random() < 0.15) event.fireEvent(event.list().SPLASH_FOAM, {pos:[this.worldPos.data[0], 0.5, this.worldPos.data[2]], count:1, dir:[0, 0, 0]});
				if (Math.random() < 0.5) event.fireEvent(event.list().SPLASH_WATER, {pos:[this.worldPos.data[0], 1, this.worldPos.data[2]], count:1, dir:[0, 2, 0]})

			}
			//    this.entity.forces.buoyancy.add_d(0, displacement *density, 0);
		//	this.liftForcePitch = this.liftForcePitch *0.25; // + (displacement*density / 100);
		//	this.liftForceYaw = this.liftForceYaw *0.1;
		//	dragForce = this.formDragForce // + (this.formDragForce * displacement * density) // + this.formDragForce*displacement // *density ;
			// * 0.2 // + (0.8 * displacement * density * (this.entity.spatial.speed));

			if (this.entity.spatial.velocity[1] > 0) this.waterForce *= 0.75;

			this.waterForce = MathUtils.lerp(0.1, this.waterForce, displacement * density * 0.1);

			calcVec.set(0, this.waterForce, 0);// * (1/this.entity.spatial.velocity.lengthSquared())

			//	calcVec.sub(this.entity.spatial.velocity)

			//    if(y < -this.approxRadius) {
			this.entity.spatial.velocity.mul(0.9993);
			//    }

			//	this.entity.spatial.rot.applyPost(calcVec);
			this.force.addv(calcVec);
		};

		PlaneWing.prototype.calcEffectSizeVector = function(vector) {

			vector.set((Math.random()-0.5)*this.size.data[0]*0.6, this.size.data[1]*0.5, (Math.random()-0.5)*this.size.data[2]*0.6);
			calcMat.set(this.entity.spatial.rot);
			calcMat.rotateY(this.frameRot.toAngles().data[1]);
			calcMat.applyPost(vector);
			return vector;
		};

		PlaneWing.prototype.calcEffectPointVector = function(vector) {
			vector.set(this.worldPos.data);
			calcVec3 = this.calcEffectSizeVector(calcVec3);
			vector.add(calcVec3);
			return vector;
		};

		PlaneWing.prototype.applyTurbulence = function() {
			calcVec = this.calcEffectPointVector(calcVec);
			calcVec2.set(this.entity.spatial.velocity);
			event.fireEvent(event.list().PUFF_RAPID_WHITE, {pos:calcVec.data, count:1, dir:calcVec2.data})
		};


		PlaneWing.prototype.applySoundBarrierFx = function() {
			calcVec = this.calcEffectPointVector(calcVec);
			calcVec2.set(this.entity.spatial.velocity);
			event.fireEvent(event.list().PUFF_RAPID_WHITE, {pos:calcVec.data, count:1, dir:calcVec2.data})
			//   event.fireEvent(event.list().PUFF_SMALL_WHITE, {pos:calcVec.data, count:1, dir:calcVec3.data})
		};

		PlaneWing.prototype.calcFormDrag = function() {
			dragXSec = this.size.data[1] * this.size.data[0];
			this.formDragForce = -this.airDensity * dragXSec * this.formDragCoeff * (this.airSpeed+(this.entity.spatial.angularVelocity.data[1]*this.entity.spatial.angularVelocity.data[1]*this.pos.data[0])+(this.entity.spatial.angularVelocity.data[2]*this.entity.spatial.angularVelocity.data[2]*this.pos.data[0]));

		    if (-this.formDragForce > this.maxLoad) {
				this.applyDamageToWing(0.99);
				this.formDragForce = 0;
			}
		};

		PlaneWing.prototype.calcInducedDrag = function(effAoA, force) {
			var indDrag = Math.abs(effAoA * 0.3 * force);
		    if (indDrag > this.maxLoad) {
				this.applyDamageToWing(0.99);
				indDrag = 0;
			}

			return -indDrag;
		};

		PlaneWing.prototype.calcLiftForces = function() {
			angles = this.frameRot.toAngles();

			pitchYawAngle = -this.sourceData.rot[2];

			aoas = this.entity.spatial.axisAttitudes; // Airflow Angles X / Y / Z  (Z should be close to 1)

			rollVelocity = this.entity.spatial.angularVelocity.data[2];
			pitchVelocity = this.entity.spatial.angularVelocity.data[0];

			va.set(aoas);

			xCross = Math.abs(Math.cos(va.data[2] - this.sourceData.rot[2]));
			yCross = Math.abs(Math.sin(va.data[1] - this.sourceData.rot[0]));
			zCross = Math.abs(Math.cos(va.data[0] - this.sourceData.rot[1]));

			xAoA = shapePhysics.calcSurfaceAxisAngleOfAttack(va.data[0], angles.data[0], Math.sin(pitchYawAngle));
			yAoA = shapePhysics.calcSurfaceAxisAngleOfAttack(va.data[1], angles.data[0], Math.cos(pitchYawAngle));

			this.angleOfAttack = yAoA*1.7;
			this.angleOfAttackYaw = xAoA*1.7;

			xAoA -= this.entity.spatial.angularVelocity.data[1]*this.pos.data[2];
			xAoA += pitchVelocity*this.pos.data[2];
			yAoA += rollVelocity*this.pos.data[0];
			yAoA -= this.entity.spatial.angularVelocity.data[0]*this.pos.data[2];
			yAoA += this.entity.spatial.angularVelocity.data[1]*this.pos.data[0] / (this.entity.spatial.speed+0.001);

			eArea = Math.abs(zCross) *this.size.data[2] * this.size.data[0] * this.airSpeed;

			this.liftForcePitch = this.airDensity *eArea* this.attitudeAffectedLift(this.stallLiftCoeff[0], yAoA, this);
			this.liftForceYaw  = this.airDensity * eArea * this.attitudeAffectedLift(this.stallLiftCoeff[1], xAoA, this);



			this.inducedLiftDragForce = this.calcInducedDrag(yAoA, this.liftForcePitch);
			this.inducedYawDragForce = this.calcInducedDrag(xAoA, this.liftForceYaw);
		};

		PlaneWing.prototype.calcSurfaceForces = function() {

            y = this.worldPos.data[1];
			this.force.set(0, 0, 0);


			if(y < this.approxRadius) {
				//	this.force.mul(0.072);
			}

			if (y < 0) {
				this.applyWaterInfluence(y, this.airDensity);

			//	this.force.mul(0.072);
				return
			} else {
				this.waterForce = 0;
			}

			this.airSpeed = this.entity.spatial.velocity.lengthSquared();

			this.calcLiftForces();
			this.calcFormDrag();

            dragForce = this.formDragForce + this.inducedLiftDragForce + this.inducedYawDragForce //  + inducedDragForce;


			this.force.data[0] += this.liftForceYaw// eArea * va.data[0] * Math.cos(pitchYawAngle)// liftForceYaw * -Math.sin(this.sourceData.rot[2]);   // Yaw composant
			this.force.data[0] = this.force.data[0] * (1 - (Math.max(xCross*dragForce, -1)))

			this.force.data[1] += -this.liftForcePitch // * -Math.cos(this.sourceData.rot[2]);  // Lift composant
			this.force.data[1] =  this.force.data[1] * (1 - (Math.max(yCross*dragForce, -1)))

			this.force.data[2] += dragForce //// this.attitudeAffectedLift(this.entity, va.data[0], 0, this)  // Drag composant
			this.force.data[2] = this.force.data[2]  * (1 - (Math.max(zCross*dragForce, -1)))

			this.dragAmount = dragForce;
            //    this.entity.forces.lift.add_d(this.force[0], this.force[1], 0);
            //    this.entity.forces.drag.add_d(dragForce, dragForce, dragForce);


			this.lastFrameForce.lerp(this.force, 0.7);

			this.force.set(this.lastFrameForce);



            if (this.airSpeed > 1) {
				if (this.size.data[2] * this.size.data[0] *+Math.random()*this.size.data[2] * this.size.data[0]  < -8550+this.force.lengthSquared()*Math.random()*0.1*this.airDensity*this.airDensity) {

				//	if(y < 0) {
					//	this.entity.spatial.angularVelocity.mul(0.5)
					//	this.entity.spatial.angular(0.1)
					//	this.force.mul(0.001)
				//	}

					this.applyTurbulence()
				}

				if (Math.abs((gameConfig.WORLD_PROPERTIES.speedOfSound *gameConfig.WORLD_PROPERTIES.speedOfSound) - (this.entity.spatial.audioVel.lengthSquared()-3500)) < 1000) {
					this.applySoundBarrierFx();
				}
            }

			this.checkForceOverload();


        };

		PlaneWing.prototype.checkForceOverload = function() {

			if (Math.random() > this.integrity) {
				calcVec = this.calcEffectPointVector(calcVec);
				event.fireEvent(event.list().PUFF_BLACK_SMOKE, 		{pos:calcVec.data, count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
			}

			if (Math.sqrt(this.force.lengthSquared()) > this.maxLoad) {
			//	this.applyDamageToWing(0.3);
			//	this.calcSurfaceForces();
				this.force.mul(0.5);
			}

			if (this.destroyed) {
				this.force.mul(0.9)
			}
		};

		PlaneWing.prototype.updateWingForces = function(density, wingPos, groundProximity) {
			if (this.destroyed) return;
			this.groundProximity = groundProximity;
			this.airDensity = density;
			this.worldPos = wingPos;
			this.updateControlledRotation();
			this.calcSurfaceForces();
			if (this.destroyed) {
				this.force.mul(0.9)
			}
		};

        PlaneWing.prototype.destroy = function() {
			this.destroyed = true;
        };

        return PlaneWing;
    });
