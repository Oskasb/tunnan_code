"use strict";

define([
    'game/planes/tomcat/TomcatInstruments',
    'game/planes/tomcat/TomcatSystems',
    'game/planes/tomcat/TomcatSurfaces',
    'game/planes/tomcat/TomcatOnScreenInput' ,
    'game/planes/tomcat/TomcatWings',
    'game/planes/tomcat/TomcatLights',
    'game/planes/tomcat/TomcatScreens',
    "game/GameConfiguration",
    "game/ModelDefinitions"

], function(
    TomcatInstruments,
    TomcatSystems,
    TomcatSurfaces,
    TomcatOnScreenInput,
    TomcatWings,
    TomcatLights,
    TomcatScreens,
    gameConfig,
    modelDefinitions
    ) {

    return {

        TOMCAT:{
            modelPath:gameConfig.GOO_PROJECTS.tomcat.entityIds.tomcat_skinned,
			configs:{
				dataKeys:[
					'tomcat_control_surface_data',
					'tomcat_instruments_data',
					'tomcat_wings_data',
					'tomcat_control_systems_data',
					'tomcat_screen_systems_data',
					'tomcat_light_mapping_data',
					'tomcat_systems_data'
				],
				display_settings:'display_settings',
				instruments:'instruments',
				light_systems:'light_systems',
				control_settings:'control_settings',
				control_surfaces:'control_surfaces',
				piece_systems:'piece_systems',
				wing_shapes:'wing_shapes'
			},
            dimensions: {
                massEmpty:14845,
                massMax:28375,
                weightDistribution:[6, 2, 7], // average radius from pog for each axis, user for inertia of momentum
                length:19,
                wingspan:18.23,
                pilotSeatPos:[0, 0.85, 6.52],
                wingAngle:0.2, // ratio length / width / (1 = arrow, 0 = easystar)
                height:5.75
            },

            hitPoints:300,
            physicalShapes:[
                {partId:"fuselage", posOffset:[0, 0, 0], radius:5},
                {partId:"fuselage", posOffset:[0, 0, 4], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -4], radius:5},
                {partId:"wing",     posOffset:[4,  0, -4], radius:5},
                {partId:"wing",     posOffset:[-4, 0, -4], radius:5}
            ],
            physicalRadius:30,

            keyBindings:gameConfig.KEY_BINDINGS.plane,
            gooProjectUrl:gameConfig.GOO_PROJECTS.tomcat.projectPath,
            gooProject:gameConfig.GOO_PROJECTS.tomcat,
            piecePath:gameConfig.GOO_PROJECTS.tomcat.tomcat,
            contrail_effect:modelDefinitions.GOO_PARTICLES.wing_smoke,
            uiPages:[],

            wing_smoke:[
                [-5.8, 0, -2],
                [5.8, 0, -2]
            ],

            onScreenInput:new TomcatOnScreenInput(),

            instruments: TomcatInstruments.INSTRUMENTS,



            lights:TomcatLights.LIGHTS,
            screens:TomcatScreens.SCREENS,

            measurements: {
                throttle:1,
                speed:1,
                altitude:1,
                airflowx:1,
                airflowy:1,
                airflowz:1,
                gForce:1
            },

            wings:TomcatWings.WINGS,
            systems:TomcatSystems.SYSTEMS
        }
    }
});