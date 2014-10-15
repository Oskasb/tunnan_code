"use strict";

define(["game/cars/Car"],
    function(Car) {

        var buildCar = function(carId, carData) {
            var car = new Car(carId, carData);
            console.log("BUILD CAR:", car);
            return car;
        };

        return {
            buildCar:buildCar
        }
    });