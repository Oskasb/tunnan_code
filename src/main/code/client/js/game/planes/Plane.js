"use strict";

define(['game/GamePiece',
	'game/controls/SurfaceController',
	'game/planes/PlaneWing'],
    function(GamePiece,
			 SurfaceController,
			 PlaneWing
        ) {

        var Plane = function(id) {
            this.gamePiece = new GamePiece(id);
        };

		Plane.prototype.parseWingData = function(wingData, aerodynamics) {

			wingData.liftCurveId = wingData.liftCurve;
			wingData.liftCurve = aerodynamics.wings[wingData.liftCurve];

			for (var i = 0; i < wingData.stallLiftCoeff.length; i++) {
				if (typeof(wingData.stallLiftCoeff[i]) == 'string') {
					wingData.stallLiftCoeff[i] = aerodynamics.coefficients[wingData.stallLiftCoeff[i]]
				}
			}
			wingData.formDragCoeff = aerodynamics.coefficients[wingData.formDragCoeff]

		};


		Plane.prototype.rebuildWings = function() {
			for (var index in this.entity.wings) {
				if (this.entity.wings[index].debugGeometry) {
					this.entity.wings[index].visualize(this.entity, this.entity.wings[index]);
					this.revisualize = true;
				}
				this.entity.wings[index].destroy();
			}
		};

		Plane.prototype.addWings = function(wingConfigs, aerodynamics) {

			if (this.entity.wings) {
				this.revisualize = false;
				this.rebuildWings();
			}

			this.entity.wings = {};
			this.entity.air = {
				density:1
			};

			for (var index in wingConfigs) {
				 var wing = wingConfigs[index];
				this.parseWingData(wing, aerodynamics);
				this.entity.wings[index] = new PlaneWing(this.entity, wing, index);
				for (var key in wing.controls) {
					this.entity.wings[index].setAoAControl(key, wing.controls[key])
				}
			}

			if (this.revisualize) {
				for (index in this.entity.wings) {
					this.entity.wings[index].visualize(this.entity, this.entity.wings[index]);
				}
				this.revisualize = false;
			}

		};


        return Plane;
    });