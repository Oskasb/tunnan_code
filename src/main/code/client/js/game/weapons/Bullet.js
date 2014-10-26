"use strict";

define([
    "game/weapons/WeaponData",
    "game/weapons/FireDamage",
    'game/GameConfiguration',
    "game/ModelDefinitions",
    "application/EventManager",
    'goo/math/Matrix3x3',
    'goo/math/Vector3',
	'goo/entities/SystemBus',
    'game/world/PhysicalWorld',
    '3d/GooEffectController'
],
    function(
        weaponData,
        FireDamage,
        gameConfig,
        modelDefinitions,
        event,
        Matrix3x3,
        Vector3,
		SystemBus,
        physicalWorld,
        GooEffectController
        ) {

    var activeBullets = [];
    var bulletCount = 0;

    var registerBullet = function(bullet, caliber, visible) {
        bulletCount += 1;

        if (visible) {
            var visibleCallback = function(gooEntity) {
                //        console.log(bullet.entity)
                gooEntity.transformComponent.transform.scale.data[0] = caliber*0.1;
                gooEntity.transformComponent.transform.scale.data[1] = caliber*0.1;
                bullet.entity.geometries[0] = gooEntity;
                event.fireEvent(event.list().REGISTER_ACTIVE_ENTITY, {entity:bullet.entity});
                event.fireEvent(event.list().ACTIVATE_GOO_ENTITY, {gooEntity:gooEntity, gameEntity:bullet});

            };

            var callback = function(entity) {
                bullet.id = entity.id;
                bullet.entity = entity;
                entity.spatial = bullet.spatial;
                entity.pieceData = bullet.bulletData;
                //    visibleCallback(entity)
                event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:gameConfig.GOO_PROJECTS.bullet_20.projectPath, modelPath:entity.pieceData.modelPath, callback:visibleCallback});
            };

            event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:"bullet_"+bulletCount, callback:callback});

        } else {



            var callback = function(entity) {
                bullet.id = entity.id;
                bullet.entity = entity;
                entity.spatial = bullet.spatial;
                entity.pieceData = bullet.bulletData;
                event.fireEvent(event.list().REGISTER_ACTIVE_ENTITY, {entity:bullet.entity});            };

            event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:"bullet_"+bulletCount, callback:callback});
        }

        activeBullets.push(bullet);
    };

    var Bullet = function(pos, vel, bulletData, cannonData, callback, originatorId, tpf) {
        var rot = new Matrix3x3();

		this.hitVec = new Vector3();
		this.hitNormal = new Vector3();
        this.originatorId = originatorId;
        this.onHitEffects = bulletData.onHitEffects;
        this.bulletData = bulletData;
        this.spatial = {
            visualPos:new Vector3(0, 0, 0),
            pos: pos,
            rot: rot,
            velocity: new Vector3(vel),
            audioVel:new Vector3([0, 0.000001, 0])
        };
        this.caliber = cannonData.caliber;
        this.lifetime = cannonData.lifetime;
        this.age = 0;
        this.lifeTime = bulletData.lifeTime;
        this.hitCallback = callback;
        registerBullet(this, this.caliber, this.visible);
		this.updatePosition(tpf);
    };

        Bullet.prototype.remove = function() {
        //    console.log("Remove Bullet")

            var bulletIndex = activeBullets.indexOf(this);
            activeBullets.splice(bulletIndex, 1);
        //    console.log("active bullets: ", activeBullets);
            event.fireEvent(event.list().REMOVE_GAME_ENTITY, {entityId:this.id});
            delete this;
        };

        Bullet.prototype.disappear = function() {
            this.hitCallback(this.spatial, "nothing");
            this.remove();
        };

        var applyHitDamage = function(hit, damageData) {
            for (var index in damageData) {
                if (index == "fire") new FireDamage(hit.entity, hit.part, damageData[index]);
                if (index == "kinetic") event.fireEvent(event.list().DAMAGE_ENTITY, {entity:hit.entity, damage:damageData[index].points});
            }
        };


        Bullet.prototype.playHitSound = function(hit) {
            var selection =  Math.floor(Math.random()*this.bulletData.onHitSounds.length);
            event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound()[this.bulletData.onHitSounds[selection]], pos:hit.pos, dir:[Math.random()-0.5, Math.random()-0.5,Math.random()-0.5]});
        };

        Bullet.prototype.waterSplash = function(pos) {
			var count = Math.ceil(Math.random()*this.caliber*0.25);
			var fxPos = [pos[0], 0, pos[2]]
			this.hitVec.set(pos);
			this.hitNormal.set(0, count, 0);

            event.fireEvent(event.list().SPLASH_WATER, {pos:fxPos, count:4+count, dir:[0, count, 0]});
			if (Math.random() < 0.2*count) event.fireEvent(event.list().SPLASH_RINGLET, {pos:fxPos, count:1, dir:[0, 0, 0]});
			if (Math.random() < 0.05*count) event.fireEvent(event.list().SPLASH_FOAM, {pos:fxPos, count:1, dir:[0, 0, 0]});

		};

        Bullet.prototype.hit = function(hit) {
            this.hitCallback(this.spatial, hit);
            var pos = hit.pos;

            if (hit.part=="water") {
                this.waterSplash(pos);
                return;
            }

        //    console.log("HIT!", hit)
            var vel = this.spatial.velocity.data;
            for (var i = 0; i < this.onHitEffects.length; i++) {


				SystemBus.emit('playParticles', {effectName:this.onHitEffects[i].id, pos:new Vector3(pos), vel:Vector3.UNIT_Y, effectData:this.onHitEffects[i].effectData});
			}

            if (hit.entity) {
                for (var i = 0; i < this.bulletData.damageEffects.length; i++) {
                    applyHitDamage(hit, this.bulletData.damageEffects[i]);
                }
            } else {
                physicalWorld.renderGroundHitEffect(pos)
            }


            this.playHitSound(hit);
        };

        Bullet.prototype.updatePosition = function(time) {
            this.age+=time;

            var checkHit = physicalWorld.checkSpatialConflict(this, time);

            if (checkHit) {
                this.hit(checkHit);
                this.remove();
                return;
            }

            if (this.spatial.pos.data[1] <= 0) {
                this.hitCallback(this.spatial, "water");
                this.remove();
                return;
            }
			this.hitNormal.set(this.spatial.velocity)
			this.hitNormal.mul(2)

			var effectData = {
				lifespan:0.035,
				intensity:1 - (this.age / this.lifeTime)*(this.age / this.lifeTime),
				count:120*(1-(this.age*(this.age*0.002+0.998) / (this.lifeTime))),
				size:30*this.caliber,
				alphacurve:[[0, 1], [1,1]],
				color:[0.4, 0.3, 0.2, 0.1]
			};

			SystemBus.emit('playParticles', {effectName:'explosion_fire', pos:this.spatial.pos, vel:this.hitNormal, effectData:effectData});

			//		SystemBus.emit('playParticles', {effectName:'shockwave_fire', pos:this.spatial.pos, vel:this.hitNormal, effectData:effectData});
			if (Math.random() < 0.15 * (1/(1+this.age/1000))) event.fireEvent(event.list().PUFF_SMALL_WHITE, {pos:this.spatial.pos.data, count:1, dir:this.spatial.velocity.data})


	        //    if (Math.random() < 0.07 * (1/(1+this.age/1000))) event.fireEvent(event.list().ACROBATIC_SMOKE, {pos:this.spatial.pos.data, count:1, dir:this.spatial.velocity.data})
        //    if (Math.random() < 0.01 * (1/(1+this.age/1000))) event.fireEvent(event.list().PUFF_WHITE_SMOKE, {pos:this.spatial.pos.data, count:1, dir:this.spatial.velocity.data})


            if (this.age > this.lifeTime) this.disappear();

        };

		Bullet.prototype.updateBulletEffects = function(tpf) {
 /*
			var effectData = {
				intensity:1 - (this.age / this.lifeTime)
			};

			SystemBus.emit('playParticles', {effectName:'explosion_fire', pos:this.spatial.pos, vel:this.spatial.velocity, effectData:effectData});
			//		SystemBus.emit('playParticles', {effectName:'shockwave_fire', pos:this.spatial.pos, vel:this.hitNormal, effectData:effectData});
			if (Math.random() < 0.15 * (1/(1+this.age/1000))) event.fireEvent(event.list().PUFF_SMALL_WHITE, {pos:this.spatial.pos.data, count:1, dir:this.spatial.velocity.data})
*/
		};

    var updateActiveBullets = function(time) {
        for (var i = 0; i < activeBullets.length; i++) {
            activeBullets[i].updatePosition(time);
        }
    };

	var handleUpdateEffects = function(e) {
		for (var i = 0; i < activeBullets.length; i++) {
			activeBullets[i].updateBulletEffects(event.eventArgs(e).tpf);
		}
	};

    var handleTick = function(e) {
        var time = event.eventArgs(e).frameTime;
        updateActiveBullets(time);
    };

    event.registerListener(event.list().UPDATE_ACTIVE_ENTITIES, handleTick);
//		event.registerListener(event.list().UPDATE_GAMEPIECE_EFFECTS, handleUpdateEffects);
    return Bullet;

});