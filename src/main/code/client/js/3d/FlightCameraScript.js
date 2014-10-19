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

        var _defaults = {
            domElement: document,

            turnSpeedHorizontal: 0.01,
            turnSpeedVertical: 0.01,
            zoomSpeed: 0.40,

            dragOnly: true,
            dragButton: 1,

            worldUpVector: new Vector3(0,1,0),

            baseDistance: 25,
            minZoomDistance: 0.01,
            maxZoomDistance: 10000,

            minAscent: -89.95 * MathUtils.DEG_TO_RAD,
            maxAscent: 89.95 * MathUtils.DEG_TO_RAD,
            clampAzimuth: false,
            minAzimuth: 90 * MathUtils.DEG_TO_RAD,
            maxAzimuth: 270 * MathUtils.DEG_TO_RAD,

            releaseVelocity: true,
            invertedX: false,
            invertedY: false,
            invertedWheel: true,

            drag: 5.0,

            maxSampleTimeMS: 200,

            lookAtPoint: new Vector3(0,0,0),
            spherical: new Vector3(15,0,0),
            interpolationSpeed: 6,
            onRun: null
        };

        /**
         * @class Enables camera to orbit around a point in 3D space using the mouse.
         * @param {Object} [properties]
         * @param {Element} [properties.domElement=document] Element to add mouse listeners to
         * @param {number} [properties.turnSpeedHorizontal=0.005]
         * @param {number} [properties.turnSpeedVertical=0.005]
         * @param {number} [properties.zoomSpeed=0.2]
         * @param {boolean} [properties.dragOnly=true] Only move the camera when dragging
         * @param {number} [properties.dragButton=-1] Only drag with button with this code (-1 to enable all)
         * @param {Vector3} [properties.worldUpVector=Vector3(0,1,0)]
         * @param {number} [properties.minZoomDistance=1]
         * @param {number} [properties.maxZoomDistance=1000]
         * @param {number} [properties.minAscent=-89.95 * MathUtils.DEG_TO_RAD] Maximum arc (in radians) the camera can reach below the target point
         * @param {number} [properties.maxAscent=89.95 * MathUtils.DEG_TO_RAD] Maximum arc (in radians) the camera can reach above the target point
         * @param {boolean} [properties.invertedX=false]
         * @param {boolean} [properties.invertedY=false]
         * @param {boolean} [properties.invertedWheel=true]
         * @param {Vector3} [properties.lookAtPoint=Vector3(0,0,0)] The point to orbit around.
         * @param {Vector3} [properties.spherical=Vector3(15,0,0)] The initial position of the camera given in spherical coordinates (r, theta, phi).
         * Theta is the angle from the x-axis towards the z-axis, and phi is the angle from the xz-plane towards the y-axis. Some examples:
         * <ul>
         * <li>View from right: <code>new Vector3(15,0,0); // y is up and z is left</code> </li>
         * <li>View from front: <code>new Vector3(15, Math.PI/2, 0) // y is up and x is right </code> </li>
         * <li>View from top: <code>new Vector3(15,Math.PI/2,Math.PI/2) // z is down and x is right</code> </li>
         * <li>View from top-right corner: <code>new Vector3(15, Math.PI/3, Math.PI/8)</code> </li>
         * </ul>
         */

        function FlightCameraScript (properties) {
            properties = properties || {};
            for(var key in _defaults) {
                if(typeof(_defaults[key]) === 'boolean') {
                    this[key] = properties[key] !== undefined ? properties[key] === true : _defaults[key];
                }
                else if (!isNaN(_defaults[key])) {
                    this[key] = !isNaN(properties[key]) ? properties[key] : _defaults[key];
                }
                else if(_defaults[key] instanceof Vector3) {
                    this[key] = properties[key] || new Vector3().copy(_defaults[key]);
                }
                else {
                    this[key] = properties[key] || _defaults[key];
                }
            }

            this.name = 'FlightCameraScript';

            this.timeSamples = [0, 0, 0, 0, 0];
            this.xSamples = [0, 0, 0, 0, 0];
            this.ySamples = [0, 0, 0, 0, 0];
            this.sample = 0;
            this.velocity = new Vector2();
            this.targetSpherical = new Vector3(this.spherical);
            this.cartesian = new Vector3();
            this.dirty = true;


            this.mouseState = {
                buttonDown : false,
                lastX : NaN,
                lastY : NaN
            };

            this.domElement.oncontextmenu = function() { return false; };
        }

        FlightCameraScript.prototype.setCamera = function (cam) {
            this.camera = cam;
        };


        FlightCameraScript.prototype.updateDragState = function (state) {
            this.mouseState.buttonDown = state;
                if (state) {
                    this.mouseState.lastX = NaN;
                    this.mouseState.lastY = NaN;
                    this.velocity.set(0, 0);
                    this.spherical.y = MathUtils.moduloPositive(this.spherical.y, MathUtils.TWO_PI);
                    this.targetSpherical.copy(this.spherical);
                } else {
                    this.applyReleaseDrift();
                }

        };

        FlightCameraScript.prototype.updatePointerState = function (down) {
            this.controlScript.pointerAction(this.targetSpherical, down);
        };

        FlightCameraScript.prototype.updateDeltas = function (mouseX, mouseY) {
            var dx = 0, dy = 0;
            if (isNaN(this.mouseState.lastX) || isNaN(this.mouseState.lastY)) {
                this.mouseState.lastX = mouseX;
                this.mouseState.lastY = mouseY;
            } else {
                dx = -(mouseX - this.mouseState.lastX);
                dy = mouseY - this.mouseState.lastY;
                this.mouseState.lastX = mouseX;
                this.mouseState.lastY = mouseY;
            }

            if (this.dragOnly && !this.mouseState.buttonDown || dx === 0 && dy === 0) {
                return;
            }

            this.timeSamples[this.sample] = Date.now();
            this.xSamples[this.sample] = dx;
            this.ySamples[this.sample] = dy;
            this.sample++;
            if (this.sample > this.timeSamples.length - 1) {
                this.sample = 0;
            }

            this.velocity.set(0, 0);
            this.move(this.turnSpeedHorizontal * dx, this.turnSpeedVertical * dy);
        };

        // Should be moved to mathUtils?
        function _radialClamp(value, min, max) {
            // Rotating coordinates to be mirrored
            var zero = (min + max)/2 + ((max > min) ? Math.PI : 0);
            var _value = MathUtils.moduloPositive(value - zero, MathUtils.TWO_PI);
            var _min = MathUtils.moduloPositive(min - zero, MathUtils.TWO_PI);
            var _max = MathUtils.moduloPositive(max - zero, MathUtils.TWO_PI);

            // Putting min, max and value on the same circle
            if (value < 0 && min > 0) { min -= MathUtils.TWO_PI; }
            else if (value > 0 && min < 0) { min += MathUtils.TWO_PI; }
            if (value > MathUtils.TWO_PI && max < MathUtils.TWO_PI) { max += MathUtils.TWO_PI; }

            return _value < _min ? min : _value > _max ? max : value;
        }


        FlightCameraScript.prototype.move = function (x, y) {
            var azimuthAccel = this.invertedX ? -x : x;
            var thetaAccel = this.invertedY ? -y : y;

            // update our master spherical coords, using x and y movement
            if (this.clampAzimuth) {
                this.targetSpherical.y = _radialClamp(this.targetSpherical.y - azimuthAccel,
                    this.minAzimuth, this.maxAzimuth);
            } else {
                this.targetSpherical.y = this.targetSpherical.y - azimuthAccel;
            }
            this.targetSpherical.z = (MathUtils.clamp(this.targetSpherical.z + thetaAccel, this.minAscent, this.maxAscent));
            this.dirty = true;
        };

        FlightCameraScript.prototype.applyWheel = function (delta) {
            //    console.log("apply zoom", delta)
            var delta = (this.invertedWheel ? -1 : 1) * delta * this.targetSpherical.x * 0.3; //  * Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            this.zoom(this.zoomSpeed * delta);
        };

        FlightCameraScript.prototype.zoom = function (percent) {
            var amount = percent * this.baseDistance;

            this.controlScript.setCamDistance(MathUtils.clamp(this.targetSpherical.x + amount, this.minZoomDistance, this.maxZoomDistance));
            this.controlScript.adjustFov(percent);

            //    this.camera.setFrustumPerspective(null, null, Math.min(0.4+this.targetSpherical.x*0.15, 3), Math.min(4000+this.targetSpherical.x*5, 6000));
            this.dirty = true;
        };

        FlightCameraScript.prototype.applyReleaseDrift = function () {
            this.controlScript.releaseDrift(this.targetSpherical);
            return;
            this.targetSpherical.y = MathUtils.TWO_PI-Math.PI / 2;
            this.targetSpherical.z = -0.01 +0.02*Math.sqrt(this.targetSpherical.x);
        };

        FlightCameraScript.prototype.updateVelocity = function (time) {
            if (this.velocity.lengthSquared() > 0.000001) {
                this.move(this.velocity.x, this.velocity.y);
                this.velocity.mul(MathUtils.clamp(MathUtils.lerp(time, 1.0, 1.0 - this.drag), 0.0, 1.0));
                this.dirty = true;
            } else {
                this.velocity.set(0, 0, 0);
            }
        };

        FlightCameraScript.prototype.setControlScript = function (script) {
            this.controlScript = script;
            this.controlScript.setCamera(this.camera);
        };

        FlightCameraScript.prototype.setCameraTarget = function (spatial, offset, parentSpatial, controlScript) {
            console.log("Set camera target spatial: ", spatial);
            this.setControlScript(controlScript);
            this.controlScript.setTargetSpatial(spatial);
        //    this.controlScript.setTargetOffset(offset);
            this.spherical.x = this.controlScript.getCamDistance();
            this.spherical.y = this.targetSpherical.y;
            this.spherical.z = this.targetSpherical.z;
        };

        FlightCameraScript.prototype.calcFrameCartesian = function (entity) {

            this.targetSpherical.x = this.controlScript.getCamDistance();

            if (this.releaseVelocity) {
                this.updateVelocity(entity._world.tpf);
            }

            var delta = this.interpolationSpeed * entity._world.tpf;

            if (this.clampAzimuth) {
                this.spherical.y = MathUtils.lerp(delta, this.spherical.y, this.targetSpherical.y);
            } else {
                this.spherical.y = MathUtils.lerp(delta, this.spherical.y, this.targetSpherical.y);
            }

            this.spherical.x = MathUtils.lerp(delta, this.spherical.x, this.targetSpherical.x);
            this.spherical.z = MathUtils.lerp(delta, this.spherical.z, this.targetSpherical.z);

			if (this.controlScript.fov != this.controlScript.targetFov) {
				this.camera.setFrustumPerspective(MathUtils.lerp(0.05, this.controlScript.targetFov, this.controlScript.fov), null, null, null);
			}


            MathUtils.sphericalToCartesian(this.spherical.x, this.spherical.y, this.spherical.z, this.cartesian);
        };

		FlightCameraScript.prototype.setWheelDelta = function (delta) {
			this.wheelDelta = delta;
		};

        FlightCameraScript.prototype.frameUpdate = function (entity) {

			if (this.wheelDelta) {
			    this.applyWheel(this.wheelDelta);
				this.wheelDelta = 0;
			}

            this.calcFrameCartesian(entity);




            this.controlScript.calcCamPos(this.cartesian);
            this.controlScript.calcCamRot(entity, this.targetSpherical);

            if (this.spherical.distanceSquared(this.targetSpherical) < 0.000001) {
                this.dirty = false;
                this.spherical.y = MathUtils.moduloPositive(this.spherical.y, MathUtils.TWO_PI);
                this.targetSpherical.copy(this.spherical);
            }

			entity.transformComponent.setUpdated();
			for (var i = 0; i < entity.transformComponent.children.length; i++) {
				entity.transformComponent.children[i].transform.update();
			}

        };


        FlightCameraScript.prototype.updateCam = function (entity, ctx) {
			if (this.paused) {
				console.log("camera paused")
				return;
			}
            this.frameUpdate(entity);
        };

		FlightCameraScript.prototype.update = function (tpf, ctx) {
		//	this.updateCam(ctx.entity);

		};

		FlightCameraScript.prototype.setPaused = function(bool) {
			this.paused = bool;
		};

        return FlightCameraScript;
    });
