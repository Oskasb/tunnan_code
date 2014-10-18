define(
	[
		'goo/math/Vector3',
		'goo/entities/SystemBus',
		'3d/effects/EffectConfigs',
		'3d/effects/MusicPlayer',
		'3d/effects/SoundHandler',
		'3d/effects/SimpleParticles',
		'data_pipeline/PipelineAPI'
	],
	function(
		Vector3,
		SystemBus,
		EffectConfigs,
		MusicPlayer,
		SoundHandler,
		SimpleParticles,
		PipelineAPI
		) {

		var goo;
		var simpleParticles;
		var effectSounds = {};
		var updateCallbacks = [];
		var musicPlayer;
		var terrain;

		var path = "../../../../../tunnan_resources/";

		var EffectPlayer = function(g00, gooTerrain) {
			goo = g00;
			terrain = gooTerrain;
			musicPlayer = new MusicPlayer();
			console.log("Add effect player ", goo, EffectConfigs);
			SoundHandler.init(goo);



		};

		EffectPlayer.prototype.initEffectPlayer = function() {
			initEffectPlayer();
		};


		function testDriveFx()  {
			setInterval(function() {

				var direction = new Vector3(Math.random(), 1, Math.random());
				var position = new Vector3(10+Math.random()*24, 30 +Math.random()*3, 10+ Math.random()*24);

				SystemBus.emit('playEffect', {effectName:'explosion', pos:position, vel:direction, effectData:null} )


				var direction = new Vector3(Math.random(), 1, Math.random());
				var position = new Vector3(15+Math.random()*24, 35 +Math.random()*3, 15+ Math.random()*24);

				SystemBus.emit('playEffect', {effectName:'ground_stone_hit', pos:position, vel:direction, effectData:null} )

				var direction = new Vector3(Math.random(), 1, Math.random());
				var position = new Vector3(20+Math.random()*24, 40 +Math.random()*3, 20+ Math.random()*24);

				SystemBus.emit('playEffect', {effectName:'cascade_stars', pos:position, vel:direction, effectData:null} )

			},200)
		}

		function processEffectData(systemsData, particlesConfig, audioConfig) {

			function particleDataUpdated(srcKey, config) {
				for (var index in config) {
					var name = config[index].id;
					var particle = config[index];
					simpleParticles.addGroup(name, [name]);
					simpleParticles.createSystem(path, name, particle);
				}
			}
		/*
			for (var index in particlesConfig) {
				var name = particlesConfig[index].id;
				var particle = particlesConfig[index];
				simpleParticles.createSystem(path, name, particle);
			}
        */
			PipelineAPI.subscribeToCategoryUpdate("particle_effects", particleDataUpdated);

			for (var index in systemsData) {
				var name = systemsData[index].id;
				var group = systemsData[index].particles;
				simpleParticles.addGroup(name, group);
				effectSounds[name] = systemsData[index].sounds
			}

			SoundHandler.registerAudioConfigs(audioConfig);
		}



		function initEffectPlayer() {

			var effectsConfig = EffectConfigs.effects;
			var particlesConfig = EffectConfigs.particles;
			var audioConfig = EffectConfigs.audio;

			 console.log("init effects: ", goo, effectsConfig, particlesConfig, audioConfig);
			simpleParticles = new SimpleParticles(goo);
			processEffectData(effectsConfig, particlesConfig, audioConfig);

			SystemBus.addListener('playParticles', handlePlayParticles);
			SystemBus.addListener('playEffect', handlePlayEffect);
		//	SystemBus.addListener('updateEffect', handleUpdateEffect);
			SystemBus.addListener('stopEffect', handleStopEffect);
			SystemBus.addListener('stopAllSounds', handleStopAllSounds);
			SystemBus.addListener('playMusic',  handlePlayMusic);
			SystemBus.addListener('stopMusic',  handleStopMusic);
			SystemBus.addListener('groundEffect',  handleGroundEffect);
			SystemBus.addListener('terrainEffect',  handleTerrainEffect);

			registerUpdateHandlers();

			var updateParticles = function(tpf) {
				simpleParticles.update(tpf);
			};
			updateCallbacks.push(updateParticles);
			var updateSoundPlayer = function(tpf, camera) {
				SoundHandler.update(tpf, camera)
			};
			updateCallbacks.push(updateSoundPlayer);
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

		function playEffectParticles(effectName, pos, vel, data) {
			simpleParticles.spawnGroup(effectName, pos, vel, data);
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
			playEffectParticles(args.effectName, args.pos, args.vel, args.effectData);
		}

		function handlePlayEffect(args) {
			playEffectParticles(args.effectName, args.pos, args.vel, args.effectData);
			playEffectSounds(args.effectName, args.pos, args.vel);
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