

define([
    "physics/ShapePhysics"
],
    function (
        shapePhysics
        ) {

        describe("Volume to approx Radius", function() {
            it("calculates radius of volume 1 for sphere", function() {
                expect(shapePhysics.volumeToApproxRadius(1)).toEqual(0.6203504908994001);
            });
            it("calculates radius of volume 4.1887902047863905 for sphere", function() {

                expect(shapePhysics.volumeToApproxRadius(4.1887902047863905)).toEqual(1);
            });

            it("calculates sphere volume at radius", function() {
                var rad = shapePhysics.volumeToApproxRadius(1);
                var calcVol = shapePhysics.calcRadiusToVolume(rad);
                expect(Math.round(calcVol*100000)/100000).toEqual(1);
            });
        });

        describe("Displacement at depth", function() {

            it("calculates displacement of half sunk sphere", function() {
                var rad = shapePhysics.volumeToApproxRadius(1);
                var disp = Math.round(shapePhysics.calcSphereDisplacement(rad, rad)*1000)/1000;
                expect(disp).toEqual(0.5);
            });

            it("calculates displacement of fully sunk sphere", function() {
                var rad = shapePhysics.volumeToApproxRadius(1);
                var disp = Math.round(shapePhysics.calcSphereDisplacement(rad, rad*2)*1000)/1000;
                expect(disp).toEqual(1);
            });


            it("calculates displacement of deeply sunk sphere", function() {
                var rad = shapePhysics.volumeToApproxRadius(1);
                var disp = Math.round(shapePhysics.calcSphereDisplacement(rad, rad*10)*1000)/1000;
                expect(disp).toEqual(1);
            });
        })

        describe("Surface calculations", function() {

            it("calculates rotated surface exposure at angleOfAttack", function() {
                expect(shapePhysics.calcPlaneFaceExposureAtAngle(0, 0)).toEqual(1);
                expect(Math.round(shapePhysics.calcPlaneFaceExposureAtAngle(Math.PI, 0)*1000)/1000).toEqual(-1);
                expect(Math.round(shapePhysics.calcPlaneFaceExposureAtAngle(0, 0)*1000)/1000).toEqual(1);
                expect(Math.round(shapePhysics.calcPlaneFaceExposureAtAngle(Math.PI / 2, 0)*1000)/1000).toEqual(0);
                expect(Math.round(shapePhysics.calcPlaneFaceExposureAtAngle(Math.PI / 2, Math.PI / 2)*1000)/1000).toEqual(1);
            });


            it("calculates rotated surface angleOfAttack against axis", function() {
                expect(shapePhysics.calcSurfaceAxisAngleOfAttack(0, 0, 0)).toEqual(0);
                expect(shapePhysics.calcSurfaceAxisAngleOfAttack(1, 0, 0)).toEqual(0);
                expect(shapePhysics.calcSurfaceAxisAngleOfAttack(Math.PI / 2 ,0, Math.PI / 2)).toEqual(1);
                expect(shapePhysics.calcSurfaceAxisAngleOfAttack(Math.PI / 2 ,0, 0)).toEqual(0);
                expect(shapePhysics.calcSurfaceAxisAngleOfAttack(0 ,Math.PI / 2, Math.PI / 2)).toEqual(1);
            });


            it("calculates lift coefficient from angles and maxLift", function() {
                expect(shapePhysics.applyStallCurve(1, 0, 0)).toEqual(0);
                expect(shapePhysics.applyStallCurve(1, 1, 0)).toEqual(0);
                expect(shapePhysics.applyStallCurve(1, 1, 1)).toEqual(1);
                expect(shapePhysics.applyStallCurve(0.5, 1, 1)).toEqual(0.5);
            });

        })

    });





