"use strict";

define(["application/EventManager",
    'goo/math/Vector3',
    'goo/math/Matrix3x3',
    'game/GameConfiguration'],
    function(event,
             Vector3,
             Matrix3x3,
             gameConfig) {

        var calcVec = new Vector3();
        var levelController;
        var physTime = gameConfig.RENDER_SETUP.physicsFPS;

        require(["game/world/LevelController"],
            function(levelCtrl) {
                levelController = levelCtrl;
            });


        var AiPilot = function(plane) {
            this.plane = plane;
            this.target = {};
            this.navpoint = new Vector3();
            this.targetOrientation = new Matrix3x3();
            this.virtualInstruments = {
                horizon:new Vector3(),
                rollAngle:0,
                climbRate:0,
                speed:0
            };
            this.inputValues = {
                headTowards:0,
                elevate:0,
                speed:0
            };

            this.updatePilot();
            this.determineNavPoint();
        };

        AiPilot.prototype.setTargetEntity = function(entity) {
            this.target = entity;

        };

        AiPilot.prototype.requestEject = function() {
            this.plane.pieceInput.setInputState("throttle", 0);
            this.plane.pieceInput.setInputState("elevator", 2*(Math.random()-0.5));
            this.plane.pieceInput.setInputState("aeilrons", 2*(Math.random()-0.5));
            this.plane.pieceInput.setInputState("rudder", 	2*(Math.random()-0.5));
        };


        AiPilot.prototype.updateVirtualInstruments = function() {
            calcVec.setDirect(0, 1, 0);
            this.plane.spatial.rot.applyPre(calcVec);
            this.virtualInstruments.rollAng = Math.atan2(calcVec.data[0], calcVec.data[1]);
            this.virtualInstruments.horizon.set(calcVec);
            this.virtualInstruments.altitude = this.plane.spatial.pos.data[1];
            this.virtualInstruments.climbRate = this.plane.spatial.velocity.data[1] * physTime;
            this.virtualInstruments.speed = Math.sqrt(this.plane.spatial.velocity.lengthSquared());
        };


        AiPilot.prototype.determineNavPoint = function() {
        //    this.navpoint.set([10000 * (Math.random()-0.5), 4000+Math.random()*3000, 10000 * (Math.random()-0.5)]);

            this.navpoint.set([-2000, 3000, 600]);

        };

        AiPilot.prototype.climb = function(diff) {
            this.inputValues.speed = 1;
            this.inputValues.elevate = diff/1000;
        };

        AiPilot.prototype.dive = function(diff) {
            this.inputValues.speed = 0;
            this.inputValues.elevate = diff/10000;
        };

        AiPilot.prototype.determineSteering = function() {
            calcVec.set(this.navpoint);
            calcVec.sub(this.plane.spatial.pos);
            calcVec.mul(-1)
            this.targetOrientation.lookAt(calcVec, Vector3.UNIT_Y);

            calcVec.set(this.targetOrientation.toAngles());
            calcVec.sub(this.plane.spatial.rot.toAngles());

            this.inputValues.headTowards = Math.atan2(calcVec.data[0], calcVec.data[2]);

            if (this.virtualInstruments.altitude < this.navpoint.data[1]) {
               this.climb(this.virtualInstruments.altitude - this.navpoint.data[1]);
            } else {
                this.dive(this.virtualInstruments.altitude - this.navpoint.data[1]);
            }

        };

        AiPilot.prototype.determineAction = function() {

            this.updateVirtualInstruments();
            this.determineSteering();

            this.plane.pieceInput.setInputState("throttle", this.inputValues.speed);
            this.plane.pieceInput.setInputState("elevator", this.inputValues.elevate);
            this.plane.pieceInput.setInputState("aeilrons", this.inputValues.headTowards*0.1);
            this.updatePilot();
        };

        AiPilot.prototype.updatePilot = function() {

            if (this.plane.combat.isAlive == false) {
                this.requestEject();
                return;
            }

            var instance = this;
            setTimeout(function() {
                instance.determineAction();
            }, 150 + Math.random()*250);

        };

        return AiPilot;
    });