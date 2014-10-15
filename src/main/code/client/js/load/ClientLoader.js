"use strict";

define(["application/EventManager",
    "sound/SoundManager",
    "load/TrackProgress",
    "game/GameConfiguration",
    "game/ships/BoatData",
    "game/cars/CarData",
    "game/piece/TargetData",
    "game/planes/PlaneData",
    "game/characters/CharacterData",
    'game/world/ZoneData',
	'gui/GuiConfigLoader'
],
    function(event,
             soundManager,
             trackProgress,
             gameConfig,
             boatData,
             carData,
             targetData,
             planeData,
             characterData,
             zoneData) {


		var ClientLoader = function() {

		};

		ClientLoader.prototype.loadScenarioData		= function(scenario, dataLoaded) {
				console.log("Load Scenario: ", scenario)

		//		trackProgress.showLoadingScreen(scenario.IDENTITY);
				//   if (scenario.loadLevels) loadLevelProjects(scenario.loadLevels);
				if (scenario.playerVehicle) loadScenarioPlayerVehicle(scenario.playerVehicle);
				//if (scenario.playerCarrier) loadScenarioPlayerVehicle(scenario.playerCarrier);
				if (scenario.playerCharacter) loadPieceData(characterData[scenario.playerCharacter]);
				if (scenario.loadVehicles) loadVehicleSpawns(scenario.loadVehicles);


				this.loadData(dataLoaded);

		};
		ClientLoader.prototype.getLoadedImageByUrl	= function() {

		};
		ClientLoader.prototype.preloadClientData	= function(titles) {
			return preloadClientData(titles)
		};
		ClientLoader.prototype.loadData				= function(dataLoaded) {
		//	trackProgress.loadingProgress(1, 0, 0, 'load_mesh_data');
			this.loadGooMeshes(dataLoaded);
		//	event.fireEvent(event.list().LOAD_3D, {});
		};


		ClientLoader.prototype.loadGooMeshes		= function(dataLoaded) {
			console.log("Load Goo Meshes: ", loadGooProjects, dataLoaded);
			var onload =function(result){
				trackProgress.loadingProgress(0, 1, 0, 'load_mesh_data');
			};

			var dataloadDone = function(result) {
				dataLoaded(result);
			};


			var delayedProjectLoad = function(path, folder, entityIds, delay) {
				if (!projectQueue.length) {
					var callback = function(result) {
						trackProgress.loadingProgress(0, 1, 0, 'load_ref_'+folder);
						onload(result);
						if (loadCount == 0) dataloadDone(result)
						loadCount -= 1;
					}

				} else {
					var callback = function() {
						trackProgress.loadingProgress(0, 1, 0, 'load_ref_'+folder);
						loadCount -= 1;
						loadNext();
					}
				}

				setTimeout(function() {
					trackProgress.loadingProgress(1, 0, 0, 'load_ref_'+folder);
					loadGooProject(path, folder, entityIds, callback)
				}, delay)
			};

			var tries = 0;
			var loadNext = function() {
				if (tries > 10) {
					dataLoaded("Nothing found... tries: "+tries, loadGooProjects)
					return;
				}
				if (projectQueue.length == 0) {
					setTimeout(function() {
						tries +=1;
						console.log("Load tries: ", tries, loadGooProjects)
						loadNext();

					}, 1);
					return;
				}
				var next = projectQueue.shift();
				console.log("next", loadCount, next, projectQueue, loadGooProjects);
				delayedProjectLoad(loadGooProjects[next].projectPath, loadGooProjects[next].folder, loadGooProjects[next].entityIds, 20)
			};

			var projectQueue = [];
			trackProgress.loadingProgress(1, 0, 0,'load_sequence');

			for (var index in loadGooProjects) {
				loadCount +=1;
				projectQueue.push(index);
				console.log("Load Goo Project: ",index )
			}

			if (projectQueue.length == 0) {
				dataloadDone("No projects in queue, proceeding");
				return;
			}
			loadNext();
		};

		ClientLoader.prototype.clientLoaded			= function() {
			var clientLoaded = function() {
				console.log("Remove Loading Screen");
			//	trackProgress.removeLoadingScreen();
				soundManager.initFx();
			};

			return clientLoaded();
		};
		ClientLoader.prototype.getLoadedCount		= function() {

		};
		ClientLoader.prototype.getCachedImage		= function() {

		};

        var imageCache = {};
        var loadGooProjects = [];

        var getCachedImage = function(src) {
            return imageCache[src];
        };

        var getLoadedImageByUrl = function(url) {
            return imageCache[url];
        };

        var preloadClientData = function(pageTitles) {

            loadImages();
            soundManager.initSounds();
            soundManager.loadSounds();
        };

	    var resourcePath = "../../../../../tunnan_resources/";

        var loadImages = function() {
            console.log("Load Images");
            for (var each in gameConfig.PRELOAD_GOO_TEXTURES) {
                var c=new Image();
                c.src = resourcePath+gameConfig.PRELOAD_GOO_TEXTURES[each];
                imageCache[gameConfig.PRELOAD_GOO_TEXTURES[each]] = c;
                trackProgress.loadingProgress(1, 0, 0, c.src);
                c.onload=function(){
                    trackProgress.loadingProgress(0, 1, 0, c.src);
                }
            }

            for (var i = 0; i < gameConfig.PRELOAD_IMAGES.length; i++) {
                var c=new Image();
                c.src = gameConfig.PRELOAD_IMAGES[i];
                imageCache[gameConfig.PRELOAD_IMAGES[i]] = c;
                trackProgress.loadingProgress(1, 0, 0, c.src);
                c.onload=function(){
                    trackProgress.loadingProgress(0, 1, 0, c.src);
                }
            }
        };

		var loadCount = 0;

        var loadGooProject = function(path, folder, ids, callback) {
			console.log("LoadProject: ", path, folder, ids)
            event.fireEvent(event.list().LOAD_GOO_PROJECT, {projectPath:path, folder:folder, entityIds:ids, callback:callback});
        };

        var loadGooMeshes = function(dataLoaded) {

        };





        var getLoadedCount = function() {
            return trackProgress.getLoadedCount();
        };

        function registerGooProject(project, idMap) {
			console.log("Register load project: ", project)
            loadGooProjects.push(project);
        }

        function registerGooProjects(projects) {
            for (var index in projects) registerGooProject(projects[index]);
        }


        var loadZonePlanes = function(zonePos, planes) {
            for (var planeType in planes) {
                for (var i = 0; i < planes[planeType].length; i++) {
                //    var piece = planes[planeType][i];
               //     var pos = [piece.pos[0]+zonePos[0], piece.pos[1]+zonePos[1], piece.pos[2]+zonePos[2]];
               //     var plane = addPlane(planeType, , pos, piece.vel, piece.rot, piece.state);
                    var data = planeData[planeType]

                //    if (piece.state != 1) new AiPilot(plane);
                }
            }
        };

        function loadPieceData(data) {
            trackProgress.loadingProgress(1, 0, 0, data.gooProject.folder);
            var callback = function() {
                trackProgress.loadingProgress(0, 1, 0, data.gooProject.folder);
            };
            loadGooProject(data.gooProject.projectPath, data.gooProject.folder, data.gooProject.entityIds, callback);
        }

        function loadScenarioPlayerVehicle(vehicle) {
            loadPieceData(planeData[vehicle]);
        }

		function loadBaseProject(gooProject, callback) {
			trackProgress.loadingProgress(1, 0, 0, gooProject.folder);
			var loadCallback = function(result) {
				console.log("Base project loaded callback: ", result)
				callback()
				trackProgress.loadingProgress(0, 1, 0, gooProject.folder);
			};

			event.fireEvent(event.list().LOAD_GOO_PROJECT, {
				projectPath:	gooProject.projectPath,
				folder:			gooProject.folder,
				entityIds:		gooProject.entityIds,
				callback:loadCallback});
		}


        function loadVehicleSpawns(zoneSpawns) {
            for (var i = 0; i < zoneSpawns.length; i++) {
                for (var j = 0; j < zoneSpawns[i].length; j++) {
                    var spawnPoints = zoneSpawns[i][j];
                    if (spawnPoints.boats) {
                        for (var index in spawnPoints.boats) {
                            loadPieceData(boatData[index]);
                        }
                    }

                    if (spawnPoints.targets) {
                        for (var index in spawnPoints.targets) {
                            loadPieceData(targetData[index]);
                        }
                    }

                    if (spawnPoints.planes) {
                        for (var index in spawnPoints.planes) {
                            loadPieceData(planeData[index]);
                        }
                    }
                }
            }
        }



		var loadScene = function() {
			trackProgress.loadingProgress(0, 1, 0, 'load_sequence');
		};
		event.registerListener(event.list().ENINGE_READY, loadScene);

        return {
			ClientLoader:ClientLoader,
            getLoadedImageByUrl:getLoadedImageByUrl,
            preloadClientData:preloadClientData,
			loadBaseProject:loadBaseProject,
            getLoadedCount:getLoadedCount,
            getCachedImage:getCachedImage
        };

    });