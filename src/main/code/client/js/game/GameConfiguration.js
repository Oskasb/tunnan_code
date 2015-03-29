"use strict";

define(function() {

    return {

        GAME_IDENTITY:{
            title:"Tunnan & Friends",
            tagLine:"Early test version for you to fly"
        },

        WORLD_PROPERTIES: {
            gravity:[0, -9.81, 0],
            newton:9.81,
            speedOfSound:340.29
        },

        PLAYER_INIT: {
            startSpatial:{
                pos:[342, 18.2, 2880],
                vel:[0.0, 0.0001, 0.0],
                rot:[0, Math.PI*0.5, 0]
            },
            landingStrip: {
                pos:[2861, 15, 2388]
            },
            approach: {
                pos:[650, 620, 1000]
            },
            stratosphere: {
                pos:[-1050, 35690, 3000]
            },
            battle: {
                pos:[2750, 820, 2310]
            }
        },

        AERODYNAMICS:{
            airMassDensity:1.229,  // kg/ m^3
            densityPerMeter:0.00008,
            kelvinsAtSeaLevel: 288,
            kelvinDropByMeterUp: 0.0065, // K/m
            seaLevelPressure: 1.01, // kPa,
            gasConstant: 8.3, // J/(mol·K)
            airMolarMass: 0.0289644 // kg/mol
        },

        RENDER_SETUP: {
            targetFPS: 60,
            physicsFPS: 100
        },

        GAME_SETTINGS: {
            soundDisable:  {values: [0, 1],                      loadIndex:1}
        },

        INTRO: {
            containerId:"intro",
            stages:[
                {id:"intro_1", time:2000},
                {id:"intro_2", time:1000},
                {id:"intro_3", time:1000}
            ]
        },

        MIX_TRACKS: {
            game:{id:"Game",  spatial:true,  settingGain:"sound_game", settingFxSend:"sound_fx_game"},
            ambient:{id:"Ambient", spatial:false,  settingGain:"sound_ambient", settingFxSend:"sound_fx_ambient"},
            ui:{id:"UI",  spatial:false,  settingGain:"sound_ui", settingFxSend:"sound_fx_ui"},
            music:{id:"Music", spatial:false,  settingGain:"sound_music", settingFxSend:"sound_fx_music"}
        },

        PRELOAD_IMAGES:[
        /*    "resources/water/waternormals3.png",
            "resources/skybox/1.jpg",
            "resources/skybox/2.jpg",
            "resources/skybox/3.jpg",
            "resources/skybox/4.jpg",
            "resources/skybox/5.jpg",
            "resources/skybox/6.jpg",
            */
        //    "resources/goo/bundles/images/PlaneAtlas.png",
        //    "resources/goo/bundles/images/PlaneAtlasEmit.png",
        //    "resources/goo/bundles/images/PlaneAtlasSpec.png",
        //    "resources/goo/bundles/images/PlaneAtlas_Normal.png",
        //    "resources/goo/bundles/images/nature1024.png"
        ],

        PRELOAD_GOO_MATERIALS:{
        //    metal:"resources/goo/materials/metal.material",
        //    glass:"resources/goo/materials/glass.material",
        //    fire:"resources/goo/materials/fire.material"
        },

        PRELOAD_GOO_MESHES:{
        //    tunnan_metal:"resources/goo/tunnan_skinned/meshes/fuselage_0.mesh",
        //    tunnan_glass:"resources/goo/tunnan_skinned/meshes/canopy_0.mesh",
        //    nevada_metal:"resources/goo/nevada/meshes/ship_0.mesh",
        //    bullet_20:"resources/goo/bullet/meshes/Box002_0.mesh"
        },

        GOO_PROJECTS:{
         //   vehicles:{refFile:"project.project", projectPath:"vehicles", tunnan:"tunnan_skinned", tre_kronor:"tre_kronor", battleship:"battleship_skinned"},
			tunnan:		{folder:"tunnan_f", 		projectPath:"bundles", entityIds:{tunnan:"tunnan_f"}},
			human:		{folder:"pilot_animated", 	projectPath:"bundles", entityIds:{pilot:"pilot_bind_AO"}},
			tomcat:		{folder:"tunnan_assets", 			projectPath:"bundles", entityIds:{tomcat_skinned:"TomcatSkinned"}},

			environment:{folder:"environment",		projectPath:"bundles", entityIds:{skybox:"Default Environment", effects:"Post effects"}},
			carrier:	{folder:"tunnan_assets", 			projectPath:"bundles", entityIds:{carrier:"carrier"}},


			car_pv_9031:{refFile:"pv_9031.bundle", projectPath:"bundles", pv_9031:"pv_9031"},
            cougar_f9f:{refFile:"cougar_f9f.bundle", projectPath:"bundles", cougar_f9f:"cougar_f9f"},
            stratofortress:{refFile:"stratofortress.bundle", projectPath:"bundles", b_52:"b_52"},
            draken:{refFile:"draken.bundle", projectPath:"bundles", draken:"draken"},


            tre_kronor:{refFile:"tre_kronor.bundle", projectPath:"bundles", tre_kronor:"tre_kronor"},
            battleship:{refFile:"battleship.bundle", projectPath:"bundles", battleship:"battleship_skinned"},

            //      island_1k_x80:{refFile:"project.project", projectPath:"island_1k_x80_project", piecePath:"island_1k_x80"},


            nature:{folder:"nature", projectPath:"bundles",
				entityIds:{
					tree_leafy:"tree_leafy_30m",
					tree_40:"tree_leafy_40m",
					tree_leafy_small:"tree_leafy_small",
					rock_mossy:"rock_mossy",
					rock_plain:"rock_plain",
					rock_tiny:"rock_tiny"
				}
            },


            houses:{refFile:"houses.bundle", projectPath:"bundles",
                hangar_building:"hangar_building",
                seventeen_big_floors:"17_big_floors",
                seventeen_floor:"17_floors",
                ten_floors:"10_floors",
                cube_22:"cube_22",
                air_tower:"air_tower",
                cottage:"cottage"},
            targets:{refFile:"targets.bundle", projectPath:"bundles", ground_flat:"ground_flat", house_box_3:"house_box_3"},
            house_t:{refFile:"house_T.bundle", projectPath:"bundles", house_t:"house_T"},
            air_base:{refFile:"air_base.bundle", projectPath:"bundles", base:"base", roof:"roof", lockers:"lockers", lamps:"lamps"},
            hilltop_base:{refFile:"hilltop_base.bundle", projectPath:"bundles", base:"hilltop_base", roof:"hilltop_roof", lamps:"hilltop_lights", lamps_inner:"hilltop_lights_inner"},
            harbor:{refFile:"harbor.bundle", projectPath:"bundles", base:"harbor_base"},
            elevator:{refFile:"elevator.bundle", projectPath:"bundles", base:"elevator_base", roof:"elevator_roof"},
            top_base:{refFile:"top_base.bundle", projectPath:"bundles", base:"top_base", roof:"top_base_roof"},
            tv_screen:{refFile:"tv_monitors.bundle", projectPath:"bundles", tv:"tv_crt", tv_2:"tv_2", tv_3:"tv_3"},
            monitor_console:{refFile:"monitor_console.bundle", projectPath:"bundles", monitor_console:"monitor_console"},
            armaments:{refFile:"armaments.bundle", projectPath:"bundles", bomb_200kg:"bomb_200kg", rocket_7cm:"rocket_7cm", rocket_18cm:"rocket_18cm"},
            bullet_20:{refFile:"project.project", projectPath:"bullet_project", piecePath:"bullet_red"}
        },


        VIDEOS:{
            sources:{
                hsi:{
                    funnyCat:"resources/video/funny_cat_352x240.mp4",
                    cuteCat:"resources/video/cute_cat_320x240.mp4",
                    angryCat:"resources/video/angry_cat_screams_at_enemy_cat_640x360.mp4"
                },
                vdi:{
                    tunnanPromo:"resources/video/tunnan_short.mp4",
                    marineAd:"resources/video/united_states_marine_corps_640x480.mp4",
                    jetEngine:"resources/video/jet_engine_-_cinema_4d_animation_640x360.mp4"
                },
                hud:{
                    memorial:"resources/video/the_collings_foundation_vietnam_memorial_flight.__f-4_phantom_a-4_skyhawk_uh-1_huey_480x240.mp4",
                    dayTrap:"resources/video/day_trap_aboard_the_jfk_640x480.mp4",
                    carrierOps:"resources/video/aircraft_carrier_operation_640x360.mp4"
                },
                cats:{
                    funnyCat:"resources/video/funny_cat_352x240.mp4",
                    cuteCat:"resources/video/cute_cat_320x240.mp4",
                    angryCat:"resources/video/angry_cat_screams_at_enemy_cat_640x360.mp4"
                },
                promos:{
                    tunnanPromo:"resources/video/tunnan_short.mp4",
                    marineAd:"resources/video/united_states_marine_corps_640x480.mp4",
                    jetEngine:"resources/video/jet_engine_-_cinema_4d_animation_640x360.mp4"
                },
                military:{
                    memorial:"resources/video/the_collings_foundation_vietnam_memorial_flight.__f-4_phantom_a-4_skyhawk_uh-1_huey_480x240.mp4",
                    dayTrap:"resources/video/day_trap_aboard_the_jfk_640x480.mp4",
                    carrierOps:"resources/video/aircraft_carrier_operation_640x360.mp4"
                },
                history:{
                    strangelove:"resources/video/dr._strangelove_-_ending_640x384.mp4",
                    submarine:"resources/video/submarine_480x272.mp4",
                    bomber:"bomber_480x270.mp4"
                },
                animals:{
                    alaska:"resources/video/alaska_mammals_tour_640x350.mp4",
                    frogYear:"resources/video/year_of_the_frog_campaign_568x320.mp4",
                    unFrog:"resources/video/un_frog_640x272.mp4"
                },
                planes:{
                    blackbird:"resources/video/sr-71_blackbird_-_the_worlds_fastest_and_highest_flying_aircraft_(jet)_-_youtube_640x480.mp4"
                },
                doge:{
                    moonLaunch:'shopdoge.com-_dogecoin_moon_launch_hd__________much_trust_must_doge_640x358'
                }
            },

            channels:{
            //    hud:'hud',
                vdi:'vdi',
            //    hsi:'hsi',
                cats:'cats',
                animals:'animals',
                promos:'promos',
                military:'military',
                history:'history',
                planes:'planes'
            }
        },

        PRELOAD_GOO_TEXTURES:{
        //    machinery_diffuse:"resources/collada/PlaneAtlas.png",
        //    machinery_spec:"resources/collada/PlaneAtlasSpec.png",
        //    machinery_emit:"resources/collada/PlaneAtlasEmit.png",
        //    jet_particle:"resources/images/particles/shockwave.png",
            splash_particle:"images/particles/splash.png",
            shockwave_particle:"images/particles/shockwave.png",
            fieldring_particle:"images/particles/fieldring.png",
            spark_particle:"images/particles/spark.png",
            dot_particle:"images/particles/dot.png",
            foam_particle:"images/particles/water_foam.png",
			smoke_particle:"images/particles/smoke.png"
        },

        PRELOAD_GOO_SHADERS:{
            /*
            uberShader: {
                frag:"resources/goo/tunnan/shaders/uberShader.frag",
                vert:"resources/goo/tunnan/shaders/uberShader.vert",
                shader:"resources/goo/tunnan/shaders/uberShader.shader"
            }
            */
        },

        KEY_BINDINGS: {
            plane: {
                cannons:["1", 32],
				missiles:["2"],
                throttleUp:["R",107],
                throttleDown:["F",109],

                pitchUp:["S", 40],
                pitchDown:["W", 38],
                rollLeft:["A", 37],
                rollRight:["D", 39],
                yawLeft:["Q"],
                yawRight:["E"],

                canopy:["C"],
                gears:["G"],
                breaksOn:["B"],
                breaksOff:["V"],
                flapsDown:["X"],
                flapsUp:["Z"],
                eject:["P"],

                trimPitchUp:["K"],
                trimPitchDown:["I"],
                trimRollLeft:["J"],
                trimRollRight:["L"],
                trimYawLeft:["U"],
                trimYawRight:["O"]
            },
            car: {
                breaksOn:["B","X"],
                breaksOff:["V", "Q"],
                throttleUp:["W",107],
                throttleDown:["S",109],
                yawLeft:["A", 37],
                yawRight:["D", 39]
            },
            move: {
                forward:["W",38],
                back:["S", 40],
                turnleft:["A", 37],
                turnright:["D", 39],
                strafeModifier:["-"],
                jump:[" ", "E"]
            },
            carrier: {
            }
        }
    }
});