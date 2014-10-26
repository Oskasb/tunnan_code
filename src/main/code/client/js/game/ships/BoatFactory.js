"use strict";

define(["application/EventManager",
    "game/ships/Boat",
    "game/ships/Helmsman",
    "game/ships/ShipsCaptain",
    "game/weapons/Turret",
    "game/ships/Chimney",
    "game/ships/Radar",
    'game/ships/CarrierCable',
    "game/ships/Flag"],
    function(event,
             Boat,
             Helmsman,
             ShipsCaptain,
             Turret,
             Chimney,
             Radar,
             CarrierCable,
             Flag) {

        var addTurretsToBoat = function(boat, boatData) {
            boat.turrets = [];
            for (var i = 0; i < boatData.turrets.length; i++) {
                boat.turrets.push(new Turret(boat, boatData.turrets[i]))
            }
        };

        var addChimneysToBoat = function(boat, boatData) {
            boat.chimneys = [];
            for (var i = 0; i < boatData.chimneys.length; i++) {
                boat.chimneys.push(new Chimney(boat, boatData.chimneys[i]))
            }
        };

        var addRadarsToBoat = function(boat, boatData) {
            boat.radars = [];
            for (var i = 0; i < boatData.radars.length; i++) {
                boat.radars.push(new Radar(boat, boatData.radars[i]))
            }
        };

        var addFlagsToBoat = function(boat, boatData) {
            boat.flags = [];
            for (var i = 0; i < boatData.flags.length; i++) {
                boat.flags.push(new Flag(boat, boatData.flags[i]))
            }
        };

        var addHelmsmanToBoat = function(boat, boatData) {
            boat.helmsman = new Helmsman(boat);
        };

        var buildCables = function(boat, boatData) {
            var cables = {};
            for (var i = 0; i < boatData.physicalShapes.length; i++) {
                if (boatData.physicalShapes[i].partId == "cable") {
                    cables[boatData.physicalShapes[i].cableNr]= new CarrierCable(boat, boatData.physicalShapes[i].cableNr);
                }
            }
            boat.entity.cables = cables;
        };


        var buildShip = function(shipId, boatData, boatReady) {


			var boatBuilt = function(boat) {
				addTurretsToBoat(boat.entity, boatData);
				addChimneysToBoat(boat.entity, boatData);
				addRadarsToBoat(boat.entity, boatData);
				addFlagsToBoat(boat.entity, boatData);
				addHelmsmanToBoat(boat, boatData);
				buildCables(boat, boatData);
				new ShipsCaptain(boat);
				boatReady(boat)

			};

			new Boat(shipId, boatData, boatBuilt);
        };

        return {
            buildShip:buildShip
        }

    })