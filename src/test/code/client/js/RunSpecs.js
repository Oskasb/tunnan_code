
require.config({
    paths: {
        application: "../../../../main/code/client/js/application",
        "3d":        "../../../../main/code/client/js/3d",
        view:        "../../../../main/code/client/js/view",
        feedback:    "../../../../main/code/client/js/feedback",
        sound:       "../../../../main/code/client/js/sound",
        goo:         "../../../../../../goojs/src/gooo",
        io:          "../../../../main/code/client/js/io",
        lib:         "../../../../main/code/client/js/lib",
        load:        "../../../../main/code/client/js/load",
        navigation:  "../../../../main/code/client/js/navigation",
        physics:     "../../../../main/code/client/js/physics",
        template:    "../../../../main/code/client/js/template",
        game:        "../../../../main/code/client/js/game",
        domReady:    "lib/domReady"
    }
});

define([
    "domReady",
    "../spec/GameUtilSpec",
    "../spec/TrajectoryPhysicsSpec",
    "../spec/ShapePhysicsSpec"
],
    function ()
    {

        jasmine.getEnv().addReporter(
            new jasmine.HtmlReporter()
        );

        var run = function() {

            jasmine.getEnv().execute();
        }

        return {
            run:run
        }
    })


