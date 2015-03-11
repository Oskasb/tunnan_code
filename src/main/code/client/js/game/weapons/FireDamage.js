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
        var fireCount = 0;
        var activeFires = [];

        var FireDamage = function(entity, part, damageData) {
            fireCount+=1;
            this.age = 0;
            this.id = "fire_"+fireCount;
            this.entity = entity;
            this.intensity = damageData.intensity;
            this.size = damageData.size;
            this.posOffset = part.posOffset;
            this.partSize = part.radius;
            activeFires.push(this);
      //      console.log(activeFires)
        };

        var getPosInSize = function(pos, size) {
            //    return pos;
            return [pos.data[0]+size*Math.random()-0.5, pos.data[1]+size*0.5*Math.random()-0.5, pos.data[2]+size*Math.random()-0.5]
        };

        FireDamage.prototype.updateFire = function(time) {
            this.age += time;
            if (Math.random() < this.intensity) {
                var tPos = this.entity.spatial.pos;
                calcVec.set(this.posOffset);
                var pos = gameUtil.applyRotationToVelocity(this.entity.geometries[0], calcVec);
                pos.addVector(tPos);
                pos.addDirect(this.partSize*(Math.random()-0.5), this.partSize*0.3+this.partSize*(Math.random()*0.2), this.partSize*(Math.random()-0.5));
           //     var pos = this.entity.spatial.pos
                if (Math.random() < this.intensity*0.5) {
                    event.fireEvent(event.list().DAMAGE_ENTITY, {entity:this.entity, damage:5});
                    event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:getPosInSize(pos, this.size), count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                    if (Math.random() < this.intensity*0.5) event.fireEvent(event.list().PUFF_BLACK_SMOKE, {pos:getPosInSize(pos, this.size), count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                }
                if (this.age < 500) event.fireEvent(event.list().FLASH_SPARKS, {pos:getPosInSize(pos, this.size), count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                if (this.age < 8500 && Math.random() < this.intensity) event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:getPosInSize(pos, this.size), count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
                if (this.age < 2500) event.fireEvent(event.list().FLASH_MUZZLE_FIRE, {pos:getPosInSize(pos, this.size), count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})
            //    if (this.age > 8500 && Math.random() < this.intensity) event.fireEvent(event.list().PUFF_WHITE_SMOKE, {pos:getPosInSize(pos, this.size), count:1, dir:[Math.random()-0.5, 1+Math.random(), Math.random()-0.5]})

            }

            if (this.age > 15000) this.remove();
        };

        FireDamage.prototype.remove = function() {
            //    console.log("Remove Bullet")

            var idIndex = activeFires.indexOf(this);
            activeFires.splice(idIndex, 1);
            delete this;
        };

        var updateFires = function(time) {
            for (var i = 0; i < activeFires.length; i++) {
                activeFires[i].updateFire(time);

            };

        };

        var handleTick = function(e) {
            var time = event.eventArgs(e).frameTime;
            updateFires(time);
        };

        event.registerListener(event.list().UPDATE_ACTIVE_ENTITIES, handleTick);

        return FireDamage;
    });