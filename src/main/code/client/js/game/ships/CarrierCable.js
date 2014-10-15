"use strict";

define([
    "application/EventManager",
    'game/GameUtil',
    "goo/math/Vector3"
],
    function(event,
             gameUtil,
             Vector3
        ) {

        var calcVec = new Vector3();

        var CarrierCable = function(boat, cableNr) {
            this.boat = boat;
            this.cableNr = cableNr;
            this.entity = boat.entity;
        };


        CarrierCable.prototype.catchPlane = function(planeEntity) {
            console.log("CATCH PLANE: ", this.cableNr, planeEntity);
            planeEntity.spatial.velocity.data[1] *= 0.4;
            planeEntity.spatial.velocity.mul(0.9);
            planeEntity.cable = this;
        };

        CarrierCable.prototype.updateHookedPlane = function(planeEntity) {
        //    console.log("Update Hooked plane", planeEntity);
            planeEntity.spatial.velocity.mul(0.998)
            planeEntity.spatial.velocity.data[1] *= 0.95;
        if (Math.abs(planeEntity.spatial.velocity.lengthSquared() - this.entity.spatial.velocity.lengthSquared()) < 0.01 ) {
            event.fireEvent(event.list().ANALYTICS_EVENT, {category:"GAME_EVENT", action:"CARRIER_LANDING", labels:planeEntity.id+" on: "+this.entity.id+" cableNr:"+this.cableNr, value:1});
            console.log("HOOKED PLANE MATCH", planeEntity)
            this.boat.attachPassenger(planeEntity, this.entity.pieceData.parkingLots.service);
            planeEntity.cable = null;
        }
        //    planeEntity.spatial.pos.add(this.entity.spatial.velocity)
        };


        return CarrierCable;
    });