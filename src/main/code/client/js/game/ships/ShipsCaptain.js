"use strict";

define(["application/EventManager"],
    function(event) {

        var levelController;
        require(["game/world/LevelController"],
            function(levelCtrl) {
                levelController = levelCtrl;
            })


        var ShipsCaptain = function(boat) {
            this.boat = boat;
            this.target = {};
            this.navIndex = 0;
            this.updateCaptainsOrders();
        };

        ShipsCaptain.prototype.setTargetEntity = function(entity) {
            this.target = entity;
            this.boat.setHostileTarget(entity);

        };

        ShipsCaptain.prototype.orderClearTargets = function() {
            this.target = null;
            this.boat.setHostileTarget(this.target);

        };

        ShipsCaptain.prototype.orderAbandonShip = function() {
            this.boat.abandonShip();
        };

        ShipsCaptain.prototype.determineTargets = function() {

            this.updateCaptainsOrders();
            var allBoats = levelController.getBoats();
            for (var index in allBoats) {
                if (allBoats[index].entity.id != this.boat.entity.id) {
                    if (allBoats[index].entity.id == this.target.id) return;
                    if (allBoats[index].entity.combat.isAlive == false) {
                        this.orderClearTargets();
                        return;
                    }
                    this.setTargetEntity(allBoats[index].entity);
                    return;
                }
            }


        };

        var navPoints = [
            [5600, 0, 1000],
            [5200, 0, 4000],
            [7600, 0, 5000],
            [6600, 0, 100],
            [8100, 0, 1000],
            [8100, 0, 4000],
            [7100, 0, 1500],
            [7100, 0, 3000]

        ];

        ShipsCaptain.prototype.updateNavPoint = function() {
            var navIndex = Math.floor(Math.random()*navPoints.length);
            if (navIndex == this.navIndex) {
                this.updateNavPoint();
                return;
            }
            this.navIndex = navIndex;
            this.boat.helmsman.setNavPoint(navPoints[navIndex]);

        };


        ShipsCaptain.prototype.updateCaptainsOrders = function() {
            if (this.boat.entity.combat.isAlive == false) {
                this.orderAbandonShip();
                return;
            }
            this.updateNavPoint();

            var instance = this;
            setTimeout(function() {
        //        instance.updateCaptainsOrders();
                instance.updateCaptainsOrders();
            }, 28000 + Math.random()*12000);

        };

        return ShipsCaptain;
    });