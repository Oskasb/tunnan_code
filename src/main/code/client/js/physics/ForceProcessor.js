"use strict";
define([
    'goo/math/Vector3'
],
    function (
        Vector3
        ) {

        var calcVec =  new Vector3();

        var addForceToAcc = function(force, acc) {
            acc.addv(force);
        };

        var addForceToTorque = function(forceVector, pointOfApplication, torque) {
            calcVec.setv(pointOfApplication)
            torque.addv(calcVec.cross(forceVector));
        };


        return {
            addForceToAcc:addForceToAcc,
            addForceToTorque:addForceToTorque
        };
    });
