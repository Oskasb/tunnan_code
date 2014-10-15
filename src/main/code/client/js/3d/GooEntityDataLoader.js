define([
    'application/EventManager',
	'load/BundleLoader'
],
    function(
        event,
		BundleLoader
        ) {
        "use strict";

		var rootPath = '../../../../../tunnan_resources/';

		var setGoo = function(goo) {
			BundleLoader.setGoo(goo);
		};

        var handleLoadGooProject = function(e) {
            var projectPath = event.eventArgs(e).projectPath;
            var folder = event.eventArgs(e).folder;
            var callback = event.eventArgs(e).callback;
			var entityIds = event.eventArgs(e).entityIds;

			console.log("Load Goo Project: ", projectPath, folder, entityIds);

			var loadOk = function(resultCount) {
				console.log("Cache Bundles OK ", resultCount);
				callback();
			};

			var loadFail = function(error) {
				console.log("Caching Fail: ", error)
			};

			BundleLoader.loadBundleData(rootPath+projectPath, folder, entityIds, loadOk, loadFail);

        };

        event.registerListener(event.list().LOAD_GOO_PROJECT, handleLoadGooProject);


		var cloneCachedEntity = function(name) {
			return BundleLoader.getCachedObjectByName(name);
		};

        return {
            cloneCachedEntity:cloneCachedEntity,
            setGoo:setGoo
        }
    });