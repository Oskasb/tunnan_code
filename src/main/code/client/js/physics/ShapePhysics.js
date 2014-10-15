define([

],
        function (

        ) {
        "use strict";


            var attitudeAffectedLift = function(entity, AoA, wing) {
                //    var coeff = Math.cos(Math.PI * (entity.spatial.axisAttitudes.data[2]))
            //    console.log(wing)
                var stallA = wing.stallAngle[0]
                var maxLift = wing.stallLiftCoeff[0]
                var liftPerRad = maxLift / stallA;
                //    console.log(entity.spatial.axisAttitudes.data[2])
                var coeff = Math.PI * AoA * liftPerRad;
                if (AoA > stallA) coeff =  maxLift / 2;
                if (AoA < -stallA) coeff =  -maxLift / 2;
                return coeff * 0.5;// (baseLift + coeff);
            };

            var updateControlledRotation = function(entity, wing) {
            //    var baseAngles = wing.rot.toAngles();
            //    wing.frameRot.fromAngles(baseAngles);

                if (!wing.controlId) return;

                var angles = wing.rot.toAngles();
                var trim = 0;
                if (entity[wing.controlId].trimState) trim = entity[wing.controlId].trimState;
                var ctrlState = (entity[wing.controlId].currentState*Math.abs(entity[wing.controlId].currentState)) + trim;
            //    console.log(wing.controls)
                var ctrlAngles = wing.controls[wing.controlId];
            //    angles.addv(ctrlAngles);
                wing.frameRot.fromAngles(ctrlState*ctrlAngles[0] + angles.data[0],ctrlState*ctrlAngles[1] + angles.data[1], ctrlState*ctrlAngles[2] + angles.data[2])
           //     var rotClone = new Matrix3x3();
           //     rotClone.copy(wing.rot)
           //     rotClone.combine(wing.frameRot) // .combine(wing.rot)
           //     wing.frameRot.copy(rotClone);
            };


            var calcEffectiveArea = function(wing, effAoA) {
                var area = wing.sourceData.size[0] * wing.sourceData.size[2];
                //   area = Math.abs(area*Math.cos((va.data[1])+angles.data[0]))
                return area * Math.abs(effAoA);
            };

            var calcInducedDrag = function(effAoA, force) {;
                var dragForce = -Math.abs(effAoA * 0.05 * force);
                return dragForce * 0.01;

            };

            var calcSphereDisplacement = function(radius, depth) {
                if (depth > radius*2) depth = radius*2;
                return  1/3 * Math.PI * depth*depth * (3*radius-depth)
            };

            var calcPlaneFaceExposureAtAngle = function(yRot, angle) {
                return Math.cos(yRot - angle);
            };

            var calcSurfaceAxisAngleOfAttack = function(axisAttitude, axisAngle, orthRot) {
                return Math.sin(axisAttitude + axisAngle) * Math.sin(orthRot);
            };

            var calcWingAttitudes = function(wingRot, airflowAngles) {

            };

            var calcSurfaceLiftVectors = function(coeff, velocityVec3, airflowAttitudes) {

            };

            var applyStallCurve = function(stallAngle, liftAtStallAngle, AoA, liftCurve) {
             //   var coeff =  AoA * (liftAtStallAngle / stallAngle)

                AoA *= 1/stallAngle;

                if (AoA > stallAngle*1.3) AoA = stallAngle*1.3;
                if (AoA < -stallAngle*0.6) AoA = -stallAngle*0.6;


                var coeff = ((0.0077 + 14.7*AoA) + (8.6*AoA*AoA) + (-20.35*AoA*AoA*AoA)) / 8;
                coeff *= liftAtStallAngle;

            //    if (coeff > liftAtStallAngle) coeff =  liftAtStallAngle;
            //    if (coeff < -liftAtStallAngle) coeff = -liftAtStallAngle;
            //    if (AoA < -stallAngle) coeff =  -liftAtStallAngle / 2;

                //   if (AoA > stallAngle) coeff =  liftAtStallAngle / 2;
             //   if (AoA < -stallAngle) coeff =  -liftAtStallAngle / 2;
                return  coeff;
            };

            var attitudeAffectedLift = function(entity, AoA, wing) {
                return applyStallCurve(wing.stallAngle[0], wing.stallLiftCoeff[0], AoA)
            };


            var calcRadiusToVolume = function(rad) {
                return (4/3) * Math.PI * rad*rad*rad
            };

            var volumeToApproxRadius = function(volume) {
                return Math.pow((volume * (3/4)) / Math.PI, (1/3));
            };



        return {
            calcSurfaceAxisAngleOfAttack:calcSurfaceAxisAngleOfAttack,
            volumeToApproxRadius:volumeToApproxRadius,
            calcSphereDisplacement:calcSphereDisplacement,
            calcPlaneFaceExposureAtAngle:calcPlaneFaceExposureAtAngle,
            calcRadiusToVolume:calcRadiusToVolume,
            applyStallCurve:applyStallCurve
        };
});
