define(
	[
		'application/Settings',
		'goo/math/Vector3',
		'goo/entities/SystemBus',
		'3d/effects/EffectConfigs',
		'3d/effects/MusicPlayer',
		'3d/effects/SoundHandler',
		'3d/effects/SimpleParticles',
		'data_pipeline/PipelineAPI',
		'goo/renderer/Texture'
	],
	function(
		Settings,
		Vector3,
		SystemBus,
		EffectConfigs,
		MusicPlayer,
		SoundHandler,
		SimpleParticles,
		PipelineAPI,
		Texture
		) {

		var goo;
		var simpleParticles;
		var effectSounds = {};
		var updateCallbacks = [];
		var musicPlayer;
		var terrain;
		var particleTextures = {};
		var subscribed = false;

		var path = window.resourcePath;

		var EffectPlayer = function(g00, gooTerrain) {
			goo = g00;
			terrain = gooTerrain;
			musicPlayer = new MusicPlayer();
			console.log("Add effect player ", goo, EffectConfigs);
			SoundHandler.init(goo);


			simpleParticles = new SimpleParticles(goo);

			registerUpdateHandlers();
		};

		EffectPlayer.prototype.initEffectPlayer = function() {


			var init = function() {
				if (simpleParticles.particlesAPI.enabled || !simpleParticles.particlesAPI.useWorker) {
					initEffectPlayer();
				} else {
					setTimeout(function() {
						init();
					}, 100)
				}
			};

			init();

		};

		function processEffectData(systemsData, particlesConfig, audioConfig, particlesReady) {

			simpleParticles.createSystems();

			for (var index in systemsData) {
				var name = systemsData[index].id;
				var group = systemsData[index].particles;
				effectSounds[name] = systemsData[index].sounds
			}

			SoundHandler.registerAudioConfigs(audioConfig);
			particlesReady();
		}



		function initEffectPlayer() {




			 console.log("init effects: ", goo, effectsConfig, particlesConfig, audioConfig);


			var effectsConfig = EffectConfigs.effects;
			var particlesConfig = EffectConfigs.particles;
			var audioConfig = EffectConfigs.audio;

			var particlesReady = function() {
				if (subscribed) return;
				subscribed = true;

				SystemBus.addListener('playParticles', handlePlayParticles);
				SystemBus.addListener('playEffect', handlePlayEffect);
				//	SystemBus.addListener('updateEffect', handleUpdateEffect);
				SystemBus.addListener('stopEffect', handleStopEffect);
				SystemBus.addListener('stopAllSounds', handleStopAllSounds);
				SystemBus.addListener('playMusic',  handlePlayMusic);
				SystemBus.addListener('stopMusic',  handleStopMusic);
				SystemBus.addListener('groundEffect',  handleGroundEffect);
				SystemBus.addListener('terrainEffect',  handleTerrainEffect);



				var updateParticles = function(tpf) {
					simpleParticles.update(tpf);
				};
				updateCallbacks.push(updateParticles);
				var updateSoundPlayer = function(tpf, camera) {
					SoundHandler.update(tpf, camera)
				};
				updateCallbacks.push(updateSoundPlayer);
			};

			processEffectData(effectsConfig, particlesConfig, audioConfig, particlesReady);


		}


		function updateFrame(tpf, activeCamEntity) {
			for (var i = 0; i < updateCallbacks.length; i++) {
				updateCallbacks[i](tpf, activeCamEntity);
			}
		}

		var registerUpdateHandlers = function() {
			goo.callbacksPreRender.push(function (tpf) {
				updateFrame(tpf, goo.renderSystem.camera)
			});
		};

		function randomFromArray(alternatives) {
			console.log("Play random from list: ", alternatives);
			return alternatives[Math.floor(Math.random()*alternatives.length)]
		}

		function playEffectSounds(effectName, pos, vel) {
		//	console.log("Play sound",effectName, "from ", effectSounds);
			if (effectSounds[effectName] === undefined) {
				// has no fx
				return;
			}

			for (var i = 0; i < effectSounds[effectName].length; i++) {
				if (typeof(effectSounds[effectName][i]) != "string") {
					SoundHandler.play(randomFromArray(effectSounds[effectName][i]), pos, vel);
				} else {
					SoundHandler.play(effectSounds[effectName][i], pos, vel);
				}
			}
		}

		function stopEffectSounds(effectName) {
			console.log("Stop Effect: ", effectName);
			if (effectSounds[effectName] === undefined) {
				// has no fx
				return;
			}

			for (var i = 0; i < effectSounds[effectName].length; i++) {
				if (typeof(effectSounds[effectName][i]) != "string") {
					for (var j=0; j < effectSounds[effectName][i].length; j++) {
						SoundHandler.stop(effectSounds[effectName][j]);
					}
				} else {
					SoundHandler.stop(effectSounds[effectName][i]);
				}
			}
		}

		function updateEffectSounds(effectName, pos, vel, effectData) {
			if (effectSounds[effectName] === undefined) {
				// has no fx
				return;
			}

			for (var i = 0; i < effectSounds[effectName].length; i++) {
				if (typeof(effectSounds[effectName][i]) != "string") {
					for (var j=0; j < effectSounds[effectName][i].length; j++) {
						SoundHandler.updateSound(effectSounds[effectName][j], pos, vel, effectData);
					}
				} else {
					SoundHandler.updateSound(effectSounds[effectName][i], pos, vel, effectData);
				}
			}
		}

		var particleDensity = 1;
			var setParticleDensity = function(value) {
				particleDensity = value;
			};
			Settings.addOnChangeCallback('environment_particle_density', setParticleDensity);

		function playEffectParticles(simulatorId, pos, vel, data, callbacks) {
			data.count = Math.ceil(data.count * particleDensity);
			simpleParticles.spawn(simulatorId, pos, vel, data, callbacks);
		}

		function getGroundEffectType(pos) {
			var terrainQuery = terrain.terrainHandler.terrainQuery;

			var norm = terrainQuery.getNormalAt(pos);
			if (norm === null) {
				norm = Vector3.UNIT_Y;
			}
			var slope = norm.dot(Vector3.UNIT_Y);
			return terrainQuery.getType(pos[0], pos[2], slope, Math.random());
		}

		var txToFxMap = {
			'grass.jpg':'grass_puff',
			'road.jpg':'dirt_puff',
			'vertical_stone.jpg':'stone_puff',
			'rock.jpg':'gravel_puff'
		};

		function handleGroundEffect(args) {
			var type = getGroundEffectType(args.pos);
		//	console.log("Ground Type: ", type, txToFxMap[type.texture])
			handlePlayEffect({ effectName:txToFxMap[type.texture], pos:args.pos, vel:args.vel, effectData:args.effectData});


		}

		function handleStopAllSounds() {
			SoundHandler.stopAllLoops()
		}



		function handlePlayParticles(args) {
			playEffectParticles(args.simulatorId, args.pos, args.vel, args.effectData, args.callbacks);
		}

		function handlePlayEffect(args) {
			playEffectParticles(args.simulatorId, args.pos, args.vel, args.effectData, args.callbacks);
		//	playEffectSounds(args.effectName, args.pos, args.vel);
		}

		function handleUpdateEffect(args) {
			updateEffectSounds(args.effectName, args.pos, args.vel, args.effectData)
		};

		var calcVec = new Vector3();
		var calcVec2 = new Vector3();
		function handleTerrainEffect(args) {

			var type = getGroundEffectType(args.pos);
			calcVec.set(args.pos);
			calcVec2.set(0, -3, 0);

			console.log("Terrain FX: ", args);
//			calcVec.add(0, 1, 0);

			if (args.effectData.type == 'sub') {

				calcVec2.data[1] = 5;
			} else {

			}

			var playIt = function(spread) {
				var dist = Math.random()*(Math.random()-0.5)*args.effectData.size*spread;
				var dir = Math.random()*3.15;

				calcVec.data[0] += Math.sin(dir)*dist;
				calcVec.data[1] += spread*(0.5 - Math.random());
				calcVec.data[2] += Math.cos(dir)*dist;
				handlePlayEffect({ effectName:'terrain_up', pos:calcVec, vel:calcVec2, effectData:null});
				// handlePlayEffect({ effectName:'implosion', pos:calcVec, vel:calcVec2, effectData:null});
				// handlePlayEffect({ effectName:txToFxMap[type.texture], pos:calcVec, vel:calcVec2, effectData:null});
				// handlePlayEffect({ effectName:'metal_sparks', pos:calcVec, vel:calcVec2, effectData:null});

			};

			playIt(0.5);
			playIt(0.3);





		}

		function handlePlayMusic(args) {
			musicPlayer.playMusic(args.soundName);
		}

		function handleStopMusic(args) {
			musicPlayer.stopMusic(args.soundName);
		}

		function handleStopEffect(args) {
			stopEffectSounds(args.effectName);
		}

		return EffectPlayer;

	});