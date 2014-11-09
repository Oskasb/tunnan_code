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



            var callback = function(entity) {
                bullet.id = entity.id;
                bullet.entity = entity;
                entity.spatial = bullet.spatial;
                entity.pieceData = bullet.bulletData;
                event.fireEvent(event.list().REGISTER_ACTIVE_ENTITY, {entity:bullet.entity});            };

            event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:"bullet_"+bulletCount, callback:callback});

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

		this.particles = [];

		this.updatePosition(tpf);

		if (cannonData.bulletEffect) {
			this.attachTrailEffect(this.spatial, cannonData.bulletEffect);
		}

		this.removed = false;
	};

		Bullet.prototype.attachTrailEffect = function(spatial, bulletEffect) {



			var onParticleDead = function(particle) {
				this.particles.splice(this.particles.indexOf(particle), 1);
			}.bind(this);

			var onParticleAdded = function(particle) {
				this.particles.push(particle);
			}.bind(this);

			var particleUpdate = function(particle) {
				particle.lifeSpan = this.lifeTime - this.age*3;
				particle.position.setv(spatial.pos);
			}.bind(this);

			var callbacks = {
				particleUpdate:particleUpdate,
				onParticleAdded:onParticleAdded,
				onParticleDead:onParticleDead
			};

			var effect_data = bulletEffect.effectData;
			effect_data.size = [0.1 + this.caliber*0.003, 0.1+this.caliber*0.005];
			effect_data.lifespan = [this.age, this.age];

			SystemBus.emit('playParticles', {simulatorId:bulletEffect.simulatorId, pos:this.spatial.pos, vel:this.hitNormal, effectData:effect_data, callbacks:callbacks});

		};


        Bullet.prototype.remove = function() {
        //    console.log("Remove Bullet")

            var bulletIndex = activeBullets.indexOf(this);
            activeBullets.splice(bulletIndex, 1);
        //    console.log("active bullets: ", activeBullets);

			this.lifeTime = 0;
			this.removed = true;
			this.delete();
        };

		Bullet.prototype.delete = function() {
			for (var i = 0; i < this.particles.length; i++) {
				this.particles[i].killParticle();
			}
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


		//		SystemBus.emit('playParticles', {effectName:this.onHitEffects[i].id, pos:new Vector3(pos), vel:Vector3.UNIT_Y, effectData:this.onHitEffects[i].effectData});
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

			if (this.bulletData.trailEffects) {
				for (var i = 0; i < this.bulletData.trailEffects.length; i++){

					var effectData = {
						lifespan:0.035,
						intensity:1 - (this.age / this.lifeTime)*(this.age / this.lifeTime),
						size:30*this.caliber,
						alphacurve:[[0, 1], [1,1]],
						color:[0.4, 0.3, 0.2, 0.1]
					};

					for (var index in this.bulletData.trailEffects[i].effectData) {
						effectData[index] = this.bulletData.trailEffects[i].effectData[index];
					}
					if (effectData.count) {
						effectData.count *= (1-(this.age*(this.age*0.002+0.998) / (this.lifeTime)))
					}

			//		SystemBus.emit('playParticles', {effectName:this.bulletData.trailEffects[i].id, pos:this.spatial.pos, vel:this.hitNormal, effectData:effectData});
				}
			}

	        //    if (Math.random() < 0.07 * (1/(1+this.age/1000))) event.fireEvent(event.list().ACROBATIC_SMOKE, {pos:this.spatial.pos.data, count:1, dir:this.spatial.velocity.data})
        //    if (Math.random() < 0.01 * (1/(1+this.age/1000))) event.fireEvent(event.list().PUFF_WHITE_SMOKE, {pos:this.spatial.pos.data, count:1, dir:this.spatial.velocity.data})


            if (this.age > this.lifeTime) {
				this.disappear();
			}
        };


    var updateActiveBullets = function(time) {
        for (var i = 0; i < activeBullets.length; i++) {
            activeBullets[i].updatePosition(time);
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