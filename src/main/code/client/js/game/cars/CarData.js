"use strict";

define(["game/GameConfiguration", "game/ModelDefinitions", "game/weapons/WeaponData"], function (gameConfig, modelDefinitions, weaponData) {

    return {
        PV_9031:{
            modelPath:"pv_9031",
            dimensions:{
                massEmpty:845,
                massMax:2375,
                weightDistribution:[1.2, 0.6, 1.2], // average radius from pog for each axis, user for inertia of momentum
                length:4,
                pilotSeatPos:[0, 0.90, 1.72],
                wingspan:2.23,
                height:1.75
            },

            keyBindings:gameConfig.KEY_BINDINGS.car,
            uiPages:[],

            wings:{
                body:{
                    pos:[0, 1.0, 0],
                    size:[2.6, 1.19, 4.8],
                    rot:[0.0, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[4.5, 0, 0],
                    formDragCoeff:10.21
                }
            },

            gooProjectUrl:gameConfig.GOO_PROJECTS.car_pv_9031.projectPath,
            piecePath:gameConfig.GOO_PROJECTS.car_pv_9031.pv_9031,
            uiPage:"UI_CAR",
            instruments: {},
            measurements: {},
            surfaces:{
                rudder:{
                    inputBehavior:{release:1, speed:0.1},
                    controls: {
                        rudder:{right_f_susp:0.2, left_f_susp:-0.2, steer:4.7}
                    },
                    speed:0.02
                }
            },

            systems:{
                drive:{
                    inputBehavior:{type:"toggle", speed:1},
                    controls: {
                        doors:{},
                        stands:{}
                    },
                    wheels:{
                        right_f_wheel:{control:'rudder', radius:0.3, pos:[-0.9, -0.84, 2.1],  breakMax:1251, drag:5, suspension:{boneId:'right_f_susp',  range:0.25, axis:[0, 0, 1], stiffness:7850}}, // stiffness approx n/m
                        left_f_wheel: {control:'rudder', radius:0.3, pos:[0.9,  -0.84, 2.1],  breakMax:1251, drag:5, suspension:{boneId:'left_f_susp',   range:0.25, axis:[0, 0, 1], stiffness:7850}}, // stiffness approx n/m
                        wheel_right : {control:null,     radius:0.3, pos:[-0.9, -0.84, -2.1], breakMax:1251, drag:5, suspension:{boneId:'right_suspend', range:0.25, axis:[0, 0, 1], stiffness:7850}},
                        wheel_left  : {control:null,     radius:0.3, pos:[0.9,  -0.84, -2.1], breakMax:1251, drag:5, suspension:{boneId:'left_suspend',  range:0.25, axis:[0, 0, 1], stiffness:7850}}
                    },
                    speed:0.01
                },
                breaks:{
                    inputBehavior:{type:"slide", speed:0.1},

                    controls:{
                        breaks:{}
                    },

                    speed:0.01
                },
                engines:{
                    inputBehavior:{type:"slide", speed:0.1},
                    controls:{
                        throttle:{}
                    },
                    mounts:[
                        {
                            maxThrust:27000, // KiloNewtons  Actual Tunnan Engine: 27k
                            jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                            posOffset:[0, 1, -1]
                        }
                    ],
                    speed:0.005
                }
            }
        }
    }
});