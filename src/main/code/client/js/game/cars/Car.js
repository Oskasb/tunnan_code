"use strict";

define(['game/parts/Vehicle'],
    function(Vehicle
             ) {

        var Car = function(carId, carData) {
            return new Vehicle(carId, carData)
        };


        return Car;
    });