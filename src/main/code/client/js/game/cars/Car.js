"use strict";

define(['game/GamePiece'],
    function(GamePiece
             ) {

        var Car = function(carId, carData) {
            return new GamePiece(carId, carData)
        };


        return Car;
    });