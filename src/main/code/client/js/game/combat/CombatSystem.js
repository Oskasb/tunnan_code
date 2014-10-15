"use strict";

define([
    'application/EventManager',
    'game/EntityController',
    'game/GameUtil'
],
    function(
        event,
        entityController,
        gameUtil
        ) {

        var entityDestroyed = function(entity) {
            entity.combat.destroyed(entity);
            entity.combat.isAlive = false
        };

        var entityTakesDamage = function(entity, damage) {
            entity.combat.damageTaken += damage;
            //              console.log(entity.combat.damageTaken, entity.combat.hitPoints)
            if (entity.combat.damageTaken >= entity.combat.hitPoints && entity.combat.isAlive) entityDestroyed(entity);
        };

        var handleEntityDamage = function(e) {
            entityTakesDamage(event.eventArgs(e).entity, event.eventArgs(e).damage)
        };

        event.registerListener(event.list().DAMAGE_ENTITY, handleEntityDamage);


});
