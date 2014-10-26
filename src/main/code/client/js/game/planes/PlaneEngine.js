"use strict";

define(["application/EventManager",
    'game/GameUtil',
    'goo/math/Vector3',
    'goo/math/Matrix3x3',
    'game/parts/Lights',
    "3d/GooJointAnimator",
	"goo/entities/SystemBus"
    ],
    function(
        event,
        gameUtil,
        Vector3,
        Matrix3x3,
        Lights,
        GooJointAnimator,
		SystemBus
        ) {

        var calcVec = new Vector3();
        var calcVec2 = new Vector3();
        var world;

        var engineReady = function(e) {
            world = event.eventArgs(e).goo.world;
        };

        event.registerListener(event.list().ENINGE_READY, engineReady);

        var PlaneEngine = function(planeEntity, type, engineData) {
            console.log("--------------->>>>  Add Engine")
            this.planeEntity = planeEntity;
            this.engineId = planeEntity.id+JSON.stringify(engineData.posOffset);
            this.type= type;
            this.engineData = engineData;
            this.currentState=0;
            this.targetState=0;
            this.maxThrust=engineData.maxThrust;
            this.afterBurnerBoost = engineData.afterBurner;
            this.thrust=0;
            this.thrustVector = new Vector3();
            this.pos = new Vector3(engineData.posOffset);
            this.started = false;
            this.flameEffect = {};
            this.smokeEffect = {};
            this.fireSounds = {};
            this.rpm = 0;
            this.exhaustTemp = 0;
            this.engineGeometry = world.createEntity("engine_geometry_"+this.engineId);
            this.planeEntity.geometries[0].transformComponent.attachChild(this.engineGeometry.transformComponent);
            this.engineGeometry.transformComponent.transform.translation.set(this.pos);
            if (engineData.rot) {
                this.engineGeometry.transformComponent.transform.setRotationXYZ(engineData.rot[0], engineData.rot[1], engineData.rot[2]);
            } else {
                engineData.rot = [0, 0, 0];
            }
            this.flameLight = engineData.flame_light;


	        if (this.engineData.nozzle) this.updateNozzleState(this.determineNozzleState(0));
        };

        var context;

        var applyRotationToVelocity = function(entity, vel) {

        //    if (!entity.transformComponent) {
        //        console.log("SETUP ROT PARTICLE", entity.transformComponent)
        //        return vel;
        //    }
        //    console.log("SETUP ROT PARTICLE")
        //    var vel = entity.transformComponent.transform.rotation.applyPost(vel);
            return entity.transformComponent.transform.rotation.applyPost(vel);
        };

        //

        PlaneEngine.prototype.startEmission = function() {
            //    console.log("Splash: ", pos)
            clearTimeout(this.endTimeout);
            this.particleComp.enabled = true;

            for (var i = 0; i < this.particleComp.emitters.length; i++) {
                this.particleComp.emitters[i].enabled = true;
            }
        };

        var scaleAmp = 2;
        PlaneEngine.prototype.determineNozzleState = function(state) {
            var nozzleState = Math.max(state - 0.8, 0);
            return nozzleState*scaleAmp;
        };


        PlaneEngine.prototype.updateNozzleState = function(state) {
            GooJointAnimator.setEntityBoneScale(this.planeEntity, this.engineData.nozzle, 0.6 + state);
            GooJointAnimator.updateEntityBoneRotXYZ(this.planeEntity, this.engineData.nozzle, 0, state*this.engineData.rot[1], 0);
        };


        PlaneEngine.prototype.updateEffects = function(state, target, density, tpf) {

			var flameAmount = 0.4 *(1 - Math.cos(0.5 * Math.PI * state));
			var smokeAmount = 10*(target-state);





        /*
            for (var i = 0; i < this.flameEffect.emitters.length; i++) {
                this.flameEffect.emitters[i].releaseRatePerSecond = (this.flameEffect.maxReleaseRate / this.flameEffect.emitters.length) * (0.01 + flameAmount);
            }
         */
         /*
            for (var i = 0; i < this.smokeEffect.emitters.length; i++) {

                this.smokeEffect.emitters[i].releaseRatePerSecond = this.smokeEffect.maxReleaseRate * smokeAmount / this.smokeEffect.emitters.length;
            }
        */
            var time = new Date().getTime() * 0.001;
            this.fireSounds[getJetSoundId(this.engineId)].sourceNode.playbackRate.value = state*state*1.8 + state*0.3 + 0.8 + 0.05 + flameAmount * 0.13 + Math.sin(time*134)*0.01;
            this.fireSounds[getJetSoundId(this.engineId)].gainNode.gain.value = Math.sin(state*1.4);
            this.fireSounds[getTurbineSoundId(this.engineId)].sourceNode.playbackRate.value = state*state*0.5 + 0.7+state*Math.sin(Math.PI*state*0.5)*0.4 + Math.sin(state*time*40 +time*120)*0.001;
            this.fireSounds[getTurbineSoundId(this.engineId)].gainNode.gain.value = state + state*Math.sin(state*time*90 +time*120)*0.02;

            this.fireSounds[getToneSoundId(this.engineId)].gainNode.gain.value = state*state*state*Math.sin(Math.PI*state*0.8)*0.5 * (1+Math.sin(time*80)*0.01);
            this.fireSounds[getToneSoundId(this.engineId)].sourceNode.playbackRate.value = (Math.sqrt(state+0.2)*194*Math.sin(Math.PI*state*0.4)) + flameAmount*3.12 + Math.sin(time*130)*0.03;



            var planePos = this.planeEntity.spatial.pos;
            calcVec.set(this.pos);
            var pos = gameUtil.applyRotationToVelocity(this.planeEntity.geometries[0], calcVec);
            pos.addv(planePos);
            calcVec2.set(0, 0, -Math.random()*state*12 - 14.4*state -6);
            gameUtil.applyRotationToVelocity(this.planeEntity.geometries[0], calcVec2);


            if (Math.random() < (flameAmount-density)*0.02) {
                event.fireEvent(event.list().ACROBATIC_SMOKE, {pos:pos.data, count:1, dir:calcVec2.data})
            }

            if (Math.random() < (smokeAmount-density)*0.06) {
                event.fireEvent(event.list().PUFF_SMALL_WHITE, {pos:pos.data, count:1, dir:[calcVec2.data[0]*0.15+0.1*(Math.random()-0.5), calcVec2.data[1]* 0.15+0.1*(Math.random()-0.5), calcVec2.data[2]*0.15+0.1*(Math.random()-0.5)]})
            }

            if (Math.random() < (smokeAmount-density)*0.02) {
                event.fireEvent(event.list().PUFF_WHITE_SMOKE, {pos:pos.data, count:1, dir:[calcVec2.data[0]*0.5+0.3*(Math.random()-0.5), calcVec2.data[1]* 0.5+0.3*(Math.random()-0.5), calcVec2.data[2]*0.5+0.3*(Math.random()-0.5)]})
            }

			calcVec2.set(0,0,state*10);

			this.engineGeometry.transformComponent.worldTransform.rotation.applyPost(calcVec2);
			calcVec2.mul(-0.6*state*state);

			var fxGrow = 600;
			if (this.engineData.nozzle) {

				var nozzle = this.determineNozzleState(state);
				this.updateNozzleState(nozzle);
				fxGrow += nozzle*4000;
			}

			var effectData = {
				color: [state/0.6,state/0.5,state/0.5,0.1*state],
				alphaCurve: [[0, 0], [0.5,0.7], [1, 0]],
				growthCurve: [[0, 0.5], [0.4,1], [1, 2]],
				size:fxGrow+1100,
				growth:-fxGrow,
				spread:5,
				lifespan:0.045,
				count:45*state
			};

			SystemBus.emit('playEffect', {effectName:'shockwave_fire', pos:pos, vel:calcVec2, effectData:effectData});

			if (state > 0.90) {
				this.maxThrust = this.engineData.maxThrust + this.engineData.afterBurner;
				var effectData = {
					color: [1*state, 0.6*state,0.2*state,0.5*state*state],
					alphaCurve: [[0, 1], [0.1,0.8], [1, 0]],
					size:600,
					strength:2,
					growth:fxGrow*0.8,
					lifespan:0.033,
					count:45*state
				};


				SystemBus.emit('playEffect', {effectName:'shockwave_fire', pos:pos, vel:calcVec2, effectData:effectData});
				//        this.flameEffect.enabled = true
				//        for (var i = 0; i < this.flameEffect.emitters.length; i++) {
				//            this.flameEffect.emitters[i].enabled = true; // this.flameEffect.maxReleaseRate / this.flameEffect.emitters.length;
				//        }
			} else {
				this.maxThrust = this.engineData.maxThrust;

				//        for (var i = 0; i < this.flameEffect.emitters.length; i++) {
				//            this.flameEffect.emitters[i].enabled = false; // releaseRatePerSecond = 0;
				//        }
			}


            var vel = this.planeEntity.spatial.audioVel.data;
            var dir = [-vel[0], -vel[1], -vel[2]] // this.planeEntity.spatial.rot.toAngles().data;

            this.fireSounds[getJetSoundId(this.engineId)].panner.setPosition(pos[0], pos[1], pos[2]);
            this.fireSounds[getJetSoundId(this.engineId)].panner.setVelocity(vel[0], vel[1], vel[2]);
            this.fireSounds[getJetSoundId(this.engineId)].panner.setOrientation(dir[0], dir[1], dir[2]);
            this.fireSounds[getTurbineSoundId(this.engineId)].panner.setPosition(pos[0], pos[1], pos[2]);
            this.fireSounds[getTurbineSoundId(this.engineId)].panner.setVelocity(vel[0], vel[1], vel[2]);
            this.fireSounds[getTurbineSoundId(this.engineId)].panner.setOrientation(dir[0], dir[1], dir[2]);
            this.fireSounds[getToneSoundId(this.engineId)].panner.setPosition(pos[0], pos[1], pos[2]);
            this.fireSounds[getToneSoundId(this.engineId)].panner.setVelocity(vel[0], vel[1], vel[2]);
            this.fireSounds[getToneSoundId(this.engineId)].panner.setOrientation(dir[0], dir[1], dir[2]);
        };

        var getJetSoundId = function(engineId) {
            return engineId+"_engine_loop"
        };
        var getTurbineSoundId = function(engineId) {
            return engineId+"_turbine_loop"
        };
        var getToneSoundId = function(engineId) {
            return engineId+"_tone_loop"
        };

        PlaneEngine.prototype.addJetSounds = function() {

            var callback = function(sound) {
                this.fireSounds[sound.playId] = sound;
                console.log(sound)
            }.bind(this);

            event.fireEvent(event.list().LOOP_AMBIENT_SOUND, {soundData:event.sound().ENGINE_ON, playId:getJetSoundId(this.engineId), callback:callback});
            event.fireEvent(event.list().LOOP_AMBIENT_SOUND, {soundData:event.sound().ENGINE_GAS, playId:getTurbineSoundId(this.engineId), callback:callback});
            event.fireEvent(event.list().LOOP_AMBIENT_SOUND, {soundData:event.sound().ENGINE_TONE, playId:getToneSoundId(this.engineId), callback:callback});

        //    for (var i = 0; i < this.flameEffect.emitters.length; i++) {
        //        this.flameEffect.emitters[i].enabled = true;
        //    }


        };

        PlaneEngine.prototype.removeJetSounds = function() {
            console.log("Stop loop")
            event.fireEvent(event.list().STOP_SOUND_LOOP, {loopId:getJetSoundId(this.engineId)});
            event.fireEvent(event.list().STOP_SOUND_LOOP, {loopId:getTurbineSoundId(this.engineId)});
            event.fireEvent(event.list().STOP_SOUND_LOOP, {loopId:getToneSoundId(this.engineId)});

        //    for (var i = 0; i < this.flameEffect.emitters.length; i++) {
        //        this.flameEffect.emitters[i].enabled = false;
        //    }

        };

        PlaneEngine.prototype.addJetFlame = function() {
            var parentSpat = this.planeEntity.spatial;
            var engineRot = this.engineData.rot;
            var getEmissionVelocity = function(particle) {
                particle.velocity.set(6*(Math.random()-0.5-engineRot[1]*15), 6.7*(Math.random()-0.5), parentSpat.speed-175*(Math.random()-0.5));
                parentSpat.rot.applyPost(particle.velocity)
                return particle.velocity
            };

            var getEmissionPosition = function(particle) {
                //     var position = new Vector3();
          //      particle.position.set(0.5*(Math.random()-0.5), 0.5*(Math.random()-0.5), parentSpat.speed+Math.random()*Math.random()*5);
            //    parentRot.applyPost(particle.position)

                particle.position.set(engineRot[1]*5-engineRot[1]*0.9*parentSpat.speed, 0, -2 -Math.random()*5);
                particle.position.data[2] +=parentSpat.speed - parentSpat.speed*Math.random();
                particle.position.data[1] +=parentSpat.angularVelocity.data[0]*60;
            //    calcVec.set(parentSpat.velocity);
            //
            //    parentSpat.rot.applyPost(calcVec);
            //    particle.position.add(calcVec);
                return particle.position
            };

            var emitFunctions = {
                velocity:getEmissionVelocity,
                position:getEmissionPosition
            };


            var callback = function(entity) {
            //    entity.transformComponent.transform.translation.add(this.pos);
            //    entity.transformComponent.setUpdated();

                this.engineGeometry.transformComponent.attachChild(entity.transformComponent);
                this.flameEffect = entity.particleComponent;
                this.flameEffect.parentEntity = this.planeEntity.geometries[0];
                console.log(entity)
                var sumReleaseRate = 0;
                for (var i = 0; i < this.flameEffect.emitters.length; i++) {
                    sumReleaseRate += this.flameEffect.emitters[i].releaseRatePerSecond;
                }

                this.flameEffect.maxReleaseRate = sumReleaseRate;
            }.bind(this);

        //    event.fireEvent(event.list().BUILD_GOO_PARTICLES, {parentGooEntity:this.planeEntity.geometries[0], systemParams:this.engineData.jet_flame, emitFunctions:emitFunctions,  callback:callback});

        };
        PlaneEngine.prototype.addJetSmoke = function() {

            var callback = function(entity) {
                this.smokeEffect = entity.particleComponent;
                var sumReleaseRate = 0;
                for (var i = 0; i < this.smokeEffect.emitters.length; i++) {
                    sumReleaseRate += this.smokeEffect.emitters[i].releaseRatePerSecond;
                }

                this.smokeEffect.maxReleaseRate = sumReleaseRate;
            }.bind(this);

        //    event.fireEvent(event.list().BUILD_GOO_PARTICLES, {parentGooEntity:this.planeEntity.geometries[0], systemParams:this.engineData.jet_smoke, emitFunctions:emitFunctions,  callback:callback});

        };

        PlaneEngine.prototype.start = function() {

            if (!this.started) {
                event.fireEvent(event.list().ONESHOT_AMBIENT_SOUND, {soundData:event.sound().ENGINE_START, pos:this.planeEntity.spatial.pos.data, dir:[0,0,0]});
            //    this.addJetFlame();
            //    this.addJetSmoke();
                this.addJetSounds();
                this.started = true;
                console.log("Start Engine")
            }
        };

        PlaneEngine.prototype.pause = function() {

       //     if (this.started) {
                this.removeJetSounds();
                this.started = false;
                console.log("Pause Engine")
       //     }

        };


        var calculateEngineThrust = function(currentState, density, maxThrust) {
            // Current State is kindof the fuel consumption

            if (density > 2) {
                density = 0.2;
            }
            return currentState * ((Math.random()*density*0.2)+density*0.9) * maxThrust;
        };

        PlaneEngine.prototype.updateRpm = function() {
            var diff = (0.98*this.currentState+ 0.04*(Math.random())) - this.rpm ;

            this.rpm += diff*(0.01);

        };

        PlaneEngine.prototype.updateTemps = function() {
            var targetHeat = Math.sin(this.rpm * (2.6-this.rpm));
            var heatAdd = Math.max((targetHeat - this.exhaustTemp)*targetHeat * 0.004, 0);
            var coolSub = this.exhaustTemp * this.exhaustTemp * 0.001;
            if (this.flameLight) Lights.setEntityLightIntensity(this.planeEntity, this.flameLight, 2*this.exhaustTemp*(0.8*this.exhaustTemp+(Math.random()*0.2))-0.5);
            this.exhaustTemp += heatAdd-coolSub;
        };

        PlaneEngine.prototype.updateThrust = function(airDensity) {
			this.airDensity = airDensity;
            if (this.currentState == 0 && this.targetState > 0) {
                this.start();
            } else if (this.started && this.rpm <= 0.00001) {
                this.pause();
            } else if (!this.started) {
                return;
            }


            var diff = this.targetState -this.currentState;
            var sign = diff > 0 ? 1 : diff == 0 ? 0 : -1;
            this.currentState += sign * 0.003;
            this.currentState = Math.max(this.currentState, 0);
            this.currentState = Math.min(this.currentState, 1);
            this.updateRpm();
            this.updateTemps();
            this.thrust = calculateEngineThrust(this.rpm, airDensity, this.maxThrust);
            this.thrustVector.setd(0, 0, this.thrust);
        };

        var handleContext = function(e) {
            context = event.eventArgs(e).context;
        };

		PlaneEngine.prototype.updateSystemEffects = function(tpf) {
			if (this.started) {
				this.updateEffects(this.rpm, this.targetState, this.airDensity, tpf);
			}

		};

        event.registerListener(event.list().REGISTER_AUDIO_CONTEXT, handleContext);

        return PlaneEngine;
    });
