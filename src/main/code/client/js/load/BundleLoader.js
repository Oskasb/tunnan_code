define(['goo/loaders/DynamicLoader',
    'goo/util/rsvp',
    'goo/entities/EntityUtils',
	'goo/entities/SystemBus'],
    function(
        DynamicLoader,
        RSVP,
        EntityUtils,
		SystemBus
        ) {
        "use strict";

        var bundleQueue = [];
        var goo;
        var rootPath;
	    var idByNameMap = {};
        var entityCache = {};
	    var loaders = {};
	    var includeList = [];

        function setRootPath(path) {
            rootPath = path;
        }

        function setGoo(go0) {
            goo = go0;

        }


        function loadQueueEntry(refFile) {
            var promise = new RSVP.Promise();

	        var loader = new DynamicLoader({
		        world: goo.world,
		    //    preloadBinaries: true,
		        rootPath: rootPath+'/'+refFile,
		        beforeAdd:function(){return false} // return false to prevent auto-add to world
	        });

	        loaders[refFile] = loader;

            loader.load('root.bundle').then(function(configs) {
	//            console.log("Loader Has new data:", configs, loader)

	            var skipList = [
		            "Default Camera",
		            "ToolCamera",
		            "OrbitNPan",
		            "ToolCameraScript",
		            "Scene"
	            ];



	            for (var keys in configs) {
		            if (skipList.indexOf(configs[keys].name) != -1) {
			    //         console.log("Skipping load of: ", configs[keys].name)
		            } else if (includeList.indexOf(configs[keys].name) != -1) {
			            idByNameMap[configs[keys].name] = keys;
			            if (loaders[keys]) alert("Overwriting loader with key: "+ keys)
			            loaders[keys] = loaders[refFile];
		            } else {
			    //        console.log(configs[keys].name+" -- not handled")
		            }

	            }

            promise.resolve(refFile);
            }.bind(this)).then(null, function(error) {
                    promise.reject(error);
                });
            return promise;


        }

        function loadBundleQueue(successCallback, failCallback) {
        //    RSVP.all(bundleQueue).then(successCallback).then(null, failCallback);
			SystemBus.emit("message_to_gui",{channel:"system_channel", message:"Fetching:"})
	        function processRequest(refFile) {
		        var promise = loadQueueEntry(refFile);
		        promise.resolve = loadNext;
		        promise.reject = failCallback;
	        }

            function loadNext() {
                if (!bundleQueue.length) {



	//                console.log("Id's & Loaders: ", idByNameMap, loaders)
                    successCallback(idByNameMap);
                    return;
                }
                var refFile = bundleQueue.shift();
                console.log("Load bundle: ", refFile);
				SystemBus.emit("message_to_gui",{channel:"data_validation_update_channel", message:["Fetch!: "+bundleQueue.length, refFile]})
                processRequest(refFile);
            }

            loadNext();
        }

        function addBundleToQueue(bundle) {
            bundleQueue.push(bundle);
        }

	    function cacheEntityList(idMap, cachingCallback) {
		    var cacheCount = 0;

		     var cacheSum = 0;
		    for (var keys in idMap) {
	//		    console.log(keys, idMap)
			    cacheCount += 1;
			    loaders[idMap[keys]].load(idMap[keys]).then(function(result) {
					    cacheCount -= 1;
					    cacheSum += 1;
						SystemBus.emit("message_to_gui",{channel:"hint_channel", message: "Processing:"+result._index});
					 //   if (result.id == idMap["bind"]) alert("Bind exists here!")
		//			    console.log("Loader to Entity Cache:", cacheCount , result);
					    entityCache[result.id] = result;

					    if (cacheCount === 0) {
						    console.log("Stuffed the cache with:",entityCache);
						//    goo.world.process()
						    cachingCallback(cacheCount);
							SystemBus.emit("message_to_gui",{channel:"system_channel", message: "Cached:"+cacheSum})
					    }


					    if (result.id == idMap["goon_character"]) {

					    } else {
						    result.removeFromWorld();
					    }

					//
				    }
			    )
		    }
	    }

        function getCachedObjectByRef(ref) {

	//        console.log("Get cached: ", ref, idByNameMap)

	        if (ref == "Skybox") {

		    //    var skybox = loaders[idByNameMap[ref]].load(idByNameMap[ref])
		    //    console.log("Special skybox load: ", skybox);
		        return;

	        }

	        if(!entityCache[idByNameMap[ref]]) {
		        console.log("Needed ref is missing! "+idByNameMap[ref], entityCache);
	        }

            if (!entityCache[idByNameMap[ref]]._components) {
	            alert("Missing entity! "+ref)
            }

	        if (ref == "goon_character") {
		        console.log("Make goon:", entityCache[idByNameMap[ref]])
		//        entityCache[idByNameMap[ref]].addToWorld()

		    //    var entity = EntityUtils.clone(goo.world, entityCache[idByNameMap[ref]], {});
		        var entity = entityCache[idByNameMap[ref]];
		        return entity;
	        }

	   //     console.log("Clone entity: ", entityCache[idByNameMap[ref]])
	        var entity = EntityUtils.clone(goo.world, entityCache[idByNameMap[ref]], {});
	    //    entityCache[idByNameMap[ref]].removeFromWorld();
	    //    entity.addToWorld();
            return entity;
        }

	    function getCachedObjectByName(name) {
	//	    console.log("Get cached by name: ", name, entityCache)

			    if (!entityCache[idByNameMap[name]]) {
				    console.error("No entity found for name: ", name, entityCache);
				    return;
			    }

				var entity = EntityUtils.clone(goo.world, entityCache[idByNameMap[name]], {});
				return entity;

	    }

	    function buildMapFromIdArray(idArray) {
		    var map = {};
		    for (var i = 0; i < idArray.length; i++) {
			    map[idArray[i].id] = idArray[i].bundleName;
		    }
		    return map;
	    }

	    function includeEntityMap(map) {
		    for (var key in map) {
			    addToIncludeList(map[key])
		    }
	    }

	    function addToIncludeList(entry) {
		    includeList.push(entry);
	    }

	    function getEntityMap() {
		    return idByNameMap;
	    }

		function loadBundleData(rootPath, bundleFolder, idMap, loadOk, loadFail) {
			setRootPath(rootPath);

			includeEntityMap(idMap);

			addBundleToQueue(bundleFolder);

			var cachingOk = function() {
				cacheEntityList(getEntityMap(), loadOk)
			};
			loadBundleQueue(cachingOk, loadFail)
		}

        return {
            setGoo:setGoo,
	        buildMapFromIdArray:buildMapFromIdArray,
			loadBundleData:loadBundleData,
            getCachedObjectByRef:getCachedObjectByRef,
	        getCachedObjectByName:getCachedObjectByName
        }
    });
