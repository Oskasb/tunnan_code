"use strict";
define([
    'goo/math/Vector3'
],
    function (
        Vector3
        ) {

        var calcVec =  new Vector3();

        var addForceToAcc = function(force, acc) {
            acc.addVector(force);
        };

        var addForceToTorque = function(forceVector, pointOfApplication, torque) {
            calcVec.setVector(pointOfApplication)
            torque.addVector(calcVec.cross(forceVector));
        };


        return {
            addForceToAcc:addForceToAcc,
            addForceToTorque:addForceToTorque
        };
    });
