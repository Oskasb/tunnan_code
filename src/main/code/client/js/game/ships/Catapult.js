"use strict";

define([
	'goo/entities/SystemBus',
	"application/EventManager",
	'game/GameUtil',
	"goo/math/Vector3",
	"goo/math/Matrix3x3"
],
	function(
		SystemBus,
		event,
		gameUtil,
		Vector3,
		Matrix3x3
		) {

		var calcVec = new Vector3();
		var calcVec2 = new Vector3();


		var Catapult = function(shipEntity, catapultData) {
			this.id = catapultData.id;
			this.boat = shipEntity;
			this.puffIntensity = 0.3;
			this.posOffset = catapultData.posOffset;
			this.catapultData = catapultData;

			this.rotOffset = new Matrix3x3();
			this.rotOffset.fromAngles(catapultData.rot[0], catapultData.rot[1], catapultData.rot[2]);

			this.shortest = 1;
			this.longest = 4;

			this.effectData = {
				"color":[1,1, 1, 1],
				"count":1,
				"opacity":[0.05, 0.1],
				"alpha":"zeroOneZero",
				"growthFactor":[1.1, 8],
				"growth":"zeroToOne",
				"stretch":0.4,
				"strength":5,
				"spread":0.5,
				"acceleration":0.98,
				"gravity":0,
				"rotation":[0,7],
				"spin":"oneToZero",
				"size":[0.1,2.3],
				"lifespan":[this.shortest, this.longest],
				"spinspeed":[-0.1, 0.1],
				"sprite":"smokey",
				"loopcount":1,
				"trailsprite":"projectile_1",
				"trailwidth":1
			}
		};

		Catapult.prototype.calcLifespan = function() {
			this.effectData.lifespan[1] = this.longest*Math.random()*Math.random()*Math.random()*Math.random();
		};


		Catapult.prototype.catapultCharged = function() {
			this.puffCount = 1;
			this.puffIntensity = 0.07;
		};

		Catapult.prototype.catapultTrigger = function() {
			this.puffCount = 2;
			this.puffIntensity = 1;
		};

		Catapult.prototype.catapultPassive = function() {
			this.puffCount = 1;
			this.puffIntensity = 0.04;
		};



		Catapult.prototype.setCatapultIntensity = function(intensity) {
			this.puffIntensity = intensity;
		};

		Catapult.prototype.updateCatapult = function() {

			for (var i = 0; i < this.puffCount; i++) {
				if (Math.random() < this.puffIntensity) {
					this.calcLifespan();
					calcVec.set(this.posOffset);
					calcVec2.set( this.boat.entity.spatial.pos);
					gameUtil.applyRotationToVelocity(this.boat.entity.geometries[0], calcVec);
					calcVec2.addVector(calcVec);



					calcVec.set(0, 0, this.catapultData.length * Math.random());

					var angles = this.boat.entity.spatial.rot.toAngles();
					angles.add(this.catapultData.rot);

					this.rotOffset.fromAngles(angles.x, angles.y, angles.z);
					this.rotOffset.applyPost(calcVec);

					calcVec2.add(calcVec);

					calcVec.set(0, 1, 0);
					SystemBus.emit("playVaporEffect", {pos:calcVec2, vel:calcVec, effectData:this.effectData});
				}
			}
		};

		return Catapult;
	});