"use strict";

define([
    "application/EventManager",
    'game/GameUtil',
    "goo/math/Vector3",
        "goo/math/Quaternion",
    "goo/math/Matrix3x3"
],
    function(event,
             gameUtil,
             Vector3,
             Quaternion,
             Matrix3x3
        ) {

        var calcVec = new Vector3();
        var calcVec2 = new Vector3();
        var calcQuat = new Quaternion();

        var Helmsman = function(boat, chimneyData) {
            this.boat = boat;
            this.entity = boat.entity;
            this.navPoint = new Vector3(this.entity.spatial.pos);
            this.nextNavPoint = new Vector3(this.entity.spatial.pos);
            this.steerMat = new Matrix3x3();
            this.targetSpeed = new Vector3(0, 0, -20);
        };

        Helmsman.prototype.setNavPoint = function(pos) {
        //    console.log("Set NavPoint: ", pos)
            if (this.nextNavPoint.data[0] == 0 && this.nextNavPoint.data[2] == 0) {
                this.navPoint.setArray(pos);
            }
            this.nextNavPoint.setArray(pos);
        };

        Helmsman.prototype.checkNavPointSwitch = function() {
            calcVec.set(this.navPoint);
            calcVec.sub(this.entity.spatial.pos);
            if (calcVec.lengthSquared() < 100000) {
            //    console.log("switchNavPoint", this.entity.id, this.nextNavPoint.data, this.navPoint.data)
                this.navPoint.lerp(this.nextNavPoint, 0.0011);
            }
        };

        Helmsman.prototype.updateHelmsman = function() {

            this.checkNavPointSwitch();

        //    calcVec.setVector(this.navPoint);


        //    calcVec.subVector(this.entity.spatial.pos);

            calcVec.setDirect(0, 0, 1);

            this.steerMat.lookAt(calcVec, Vector3.UNIT_Y);

            this.targetSpeed.setDirect(0, 0, -15);

            calcVec2.setVector(this.targetSpeed);
        //    this.steerMat.applyPost(calcVec2);


            calcQuat.fromRotationMatrix(this.steerMat);
            if (this.entity.spatial.rigidBodyComponent) {
            //
                this.entity.spatial.rigidBodyComponent.getQuaternion(calcQuat);
                calcQuat.toRotationMatrix(this.entity.spatial.rot);
                this.entity.spatial.rot.applyPost(calcVec2);
                this.entity.spatial.rigidBodyComponent.setVelocity(calcVec2);
                this.entity.spatial.rigidBodyComponent.getPosition(this.entity.spatial.pos);
                this.entity.spatial.rigidBodyComponent.getVelocity(calcVec2);
                calcVec2.mul(-0.01);
                this.entity.spatial.velocity.setVector(calcVec2);

            }




		//	var wave = Math.sin(new Date().getTime()*0.001);
		//	this.entity.spatial.velocity.data[1]+= wave*2
		//	this.entity.spatial.rot.rotateX(3*wave)
		//	this.entity.spatial.rot.rotateZ(Math.cos(wave)*5);
        //    this.entity.spatial.velocity.set(calcVec2);

        };

        return Helmsman;
    });