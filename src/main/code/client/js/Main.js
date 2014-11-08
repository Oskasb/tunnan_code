"use strict";

var gameUtil;

window.resourcePath = "../../../../../../projects/tunnan/tunnan_resources/";

require.config({
    paths: {
        goo: "../../../../../../../projects/goojs/src/goo",
        'goo/lib': '../lib',
        data_pipeline:'submodules/data_pipeline/src',
        particle_system:'submodules/particle_system/src',
        environment:'submodules/environment/src',
        terrain:'submodules/terrain/src',
        gui:'submodules/canvas_gui_3d/src'
    }
});



require(["application/AnalyticsWrapper", "application/Client", "3d/GooController"], function(analytics, Client, GooController) {
	var client = new Client();
    client.initiateClient(new GooController());
});
