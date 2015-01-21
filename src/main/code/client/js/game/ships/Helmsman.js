"use strict";

define([
    "application/EventManager",
    'game/GameUtil',
    "goo/math/Vector3",
    "goo/math/Matrix3x3"
],
    function(event,
             gameUtil,
             Vector3,
             Matrix3x3
        ) {

        var calcVec = new Vector3();
        var calcVec2 = new Vector3();


        var Helmsman = function(boat, chimneyData) {
            this.boat = boat;
            this.entity = boat.entity;
            this.navPoint = new Vector3(this.entity.spatial.pos);
            this.nextNavPoint = new Vector3(this.entity.spatial.pos);
            this.steerMat = new Matrix3x3();
            this.targetSpeed = new Vector3(0, 0, 0.1);
        };

        Helmsman.prototype.setNavPoint = function(pos) {
        //    console.log("Set NavPoint: ", pos)
            if (this.nextNavPoint.data[0] == 0 && this.nextNavPoint.data[2] == 0) {
                this.navPoint.set(pos);
            }
            this.nextNavPoint.set(pos);
        };

        Helmsman.prototype.checkNavPointSwitch = function() {
            calcVec.set(this.navPoint);
            calcVec.sub(this.entity.spatial.pos);
            if (calcVec.lengthSquared() < 100000) {
            //    console.log("switchNavPoint", this.entity.id, this.nextNavPoint.data, this.navPoint.data)
                this.navPoint.set(this.nextNavPoint);
            }
        };

        Helmsman.prototype.updateHelmsman = function() {
            this.checkNavPointSwitch();
            calcVec.setVector(this.navPoint);
            calcVec.subVector(this.entity.spatial.pos);


            this.steerMat.lookAt(calcVec, Vector3.UNIT_Y);

            calcVec2.set(this.targetSpeed);
            this.steerMat.applyPost(calcVec2);

            this.entity.spatial.velocity.lerp(calcVec2, 0.05);
			var wave = Math.sin(new Date().getTime()*0.001);
			this.entity.spatial.velocity.data[1]+= wave*2
			this.entity.spatial.rot.rotateX(3*wave)
			this.entity.spatial.rot.rotateZ(Math.cos(wave)*5);
        //    this.entity.spatial.velocity.set(calcVec2);

        };

        return Helmsman;
    });