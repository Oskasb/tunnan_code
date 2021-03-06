define([
    'goo/math/Vector3'
],
    function(Vector3
        ) {
        "use strict";

        var calcVec = new Vector3();

        function SphereMovement() {
            this.jumpPower = 1000;
            this.jumpImpulse = this.jumpPower;
            this.modRun=15;
            this.modBack=8;
            this.modStrafe=10;
            this.groundContact = true;
            this.targetVelocity = new Vector3();
            this.targetHeading = new Vector3();
            this.acceleration = new Vector3();
            this.torque = new Vector3();
            this.groundHeight = 0;
            this.groundNormal = new Vector3();
            this.controlState = {
                run:0,
                strafe:0,
                jump:0,
                yaw:0,
                roll:0,
                pitch:0
            };
        }

        /**
         * Request script to move along its forward axis. Becomes
         * backwards with negative amount.
         * @param {number} amount
         */
        SphereMovement.prototype.applyForward = function(amount) {
            this.controlState.run = amount;
        };

        /**
         * Applies strafe amount for sideways input.
         * @param {number} amount
         */
        SphereMovement.prototype.applyStrafe = function(amount) {
            this.controlState.strafe = amount;
        };

        /**
         * Applies jump input.
         * @param {number} amount
         */
        SphereMovement.prototype.applyJump = function(amount) {
            this.controlState.jump = amount;
        };

        /**
         * Applies turn input for rotation around the y-axis.
         * @param {number} amount
         */

        SphereMovement.prototype.applyTurn = function(amount) {
            this.controlState.yaw = amount;
        };




        /**
         * Called when movement state is updated if requirements for jumping are met.
         * @private
         * @param [number} up
         * @returns {*}
         */
        var reJumpTimeout;

        SphereMovement.prototype.applyJumpImpulse = function(up) {
            var enableReJump = function() {
                this.jumpImpulse = this.jumpPower;
            }.bind(this);

            if (this.groundContact) {
                if (this.controlState.jump) {
                    clearTimeout(reJumpTimeout);
                    up = this.jumpImpulse;
                    this.jumpImpulse = 0;
                    this.controlState.jump = 0;
                    this.groundContact = false;
                    reJumpTimeout = setTimeout(function() {
                       enableReJump()
                    }, 200);
                } else {
                    up = 0;
                }
            }
            return up;
        };


        /**
         * Modulates the movement state with given circumstances and input
         * @private
         * @param {number} strafe
         * @param {number} up
         * @param {number} run
         * @returns {Array} The modulated directional movement state
         */
        SphereMovement.prototype.applyDirectionalModulation = function(strafe, run) {

            strafe *= this.modStrafe;

            if (run < 0) {
                run*=this.modBack;
            } else {
                run *= this.modRun;
            }

            return [strafe, this.applyJumpImpulse(0), run];
        };

        SphereMovement.prototype.updateTargetVectors = function() {
            this.targetVelocity.set(this.applyDirectionalModulation(this.controlState.strafe, this.controlState.run));
            this.targetHeading.set(this.controlState.pitch, this.controlState.yaw, this.controlState.roll);
        };

        SphereMovement.prototype.getTargetVelocity = function() {
            return this.targetVelocity;
        };

        SphereMovement.prototype.getTargetHeading = function() {
            return this.targetHeading;
        };

        return SphereMovement;
    });


