"use strict";

define(['game/planes/tunnan/TunnanData', 'game/planes/tomcat/TomcatData', "game/GameConfiguration", "game/ModelDefinitions", "game/weapons/WeaponData"], function(TunnanData, TomcatData, gameConfig, modelDefinitions, weaponData) {

    return {
        TOMCAT:TomcatData.TOMCAT,
        TUNNAN:TunnanData.TUNNAN,


        DRAKEN:{
            modelPath:"draken",
            dimensions: {
                massEmpty:7245,
                massMax:11875,
                weightDistribution:[2, 2, 3], // average radius from pog for each axis, user for inertia of momentum
                length:15.3,
                wingspan:9.43,
                pilotSeatPos:[0, -0.10, 4.52],
                wingAngle:0.2, // ratio length / width / (1 = arrow, 0 = easystar)
                height:3.9
            },

            hitPoints:300,
            physicalShapes:[
                {partId:"fuselage", posOffset:[0, 0, 0], radius:5},
                {partId:"fuselage", posOffset:[0, 0, 4], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -4], radius:5},
                {partId:"wing", posOffset:[4,  0, -4], radius:5},
                {partId:"wing", posOffset:[-4, 0, -4], radius:5}
            ],
            physicalRadius:30,

            keyBindings:gameConfig.KEY_BINDINGS.plane,
            gooProjectUrl:gameConfig.GOO_PROJECTS.draken.projectPath,
            piecePath:gameConfig.GOO_PROJECTS.draken.draken,
            contrail_effect:modelDefinitions.GOO_PARTICLES.wing_smoke,
            uiPages:["UI_TUNNAN","UI_AIR_PARAMS", "UI_BOTTOM_BAR"],

            wing_smoke:[
                [-4.5, -0.2, -2],
                [4.5, -0.2, -2]
            ],

            instruments: {
                /*
                 horizon:{axisAmp:[[2, 0.0045], [1, 0], [2,-0.025]]},
                 roll_indicator:{axisAmp:1},
                 gyro_compass:{axisAmp:1},
                 gyro_steer:{axisAmp:1},
                 climb_indicator:{axisAmp:1},
                 speed_indicator:{axisAmp:1},
                 alt_outer:{axisAmp:-31.4},
                 alt_inner:{axisAmp:-3.14}
                 */
            },

            measurements: {
                throttle:1,
                speed:1,
                altitude:1,
                airflowx:1,
                airflowy:1,
                airflowz:1,
                gForce:1
            },

            wings: {
                /*
                 fuselageTip:{
                 pos:[0, -0.2, 3.4],
                 size:[0.6, 0.6, 0.6],
                 rot:[0.02, 0, 0],
                 stallAngle:[0.5, 1, 1],
                 stallLiftCoeff:[3.5, 0, 0],
                 formDragCoeff:0.1
                 },
                 */
                fuselageFore:{
                    pos:[0, -0.2, 2],
                    size:[1.2, 1.2, 1.2],
                    rot:[0.02, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[4.5, 0, 0],
                    formDragCoeff:0.05
                },
                /*
                 fuselageSkid:{
                 pos:[0, -1.2, 0],
                 size:[0.2, 0.1, 3],
                 rot:[0.07, 0, 0],
                 stallAngle:[0.5, 1, 1],
                 stallLiftCoeff:[5.5, 0, 0],
                 formDragCoeff:0.1
                 },
                 */
                fuselageMid:{
                    pos:[0, -0.2, 0],
                    size:[0.7, 0.01, 3],
                    rot:[0.05, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[4.5, 0, 0],
                    formDragCoeff:0.1
                },
                fuselageCore:{
                    pos:[0, -0.2, 0],
                    size:[1.4, 1.4, 1.4],
                    rot:[0.0, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[3.5, 0, 0],
                    formDragCoeff:0.05
                },
                fuselageAft:{
                    pos:[0, -0.2, -1.5],
                    size:[0.6, 0.6, 0.6],
                    rot:[0.03, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[2.5, 0, 0],
                    formDragCoeff:0.05
                },
                /*
                 fuselageEnd:{
                 pos:[0, -0.2, -3],
                 size:[1.0, 1.0, 1.0],
                 rot:[0.03, 0, 0],
                 stallAngle:[0.5, 1, 1],
                 stallLiftCoeff:[1.5, 0, 0],
                 formDragCoeff:0.05
                 },
                 */
                mainInnerFore:{
                    pos:[0, 0.24, 0.41],
                    size:[3.7, 0.1, 8.6],
                    rot:[0.004, 0, 0],
                    stallAngle:[0.4, 0.5, 0.2],
                    stallLiftCoeff:[35, 0, 0],
                    formDragCoeff:0.001
                },
                mainOuterRight:{
                    pos:[4, 0.20, -2.8],
                    size:[3.1, 0.05, 1.8],
                    rot:[0.002, 0.72, 0],
                    stallAngle:[0.45, 0.3, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.001
                },
                mainOuterLeft:{
                    pos:[-4, 0.20, -2.8],
                    size:[3.1, 0.05, 1.8],
                    rot:[0.002, -0.72, 0],
                    stallAngle:[0.45, 0.3, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.001
                },
                aeilronRight:{
                    controls:{
                        aeilrons:[0.3, 0, 0]
                    },

                    pos:[3, 0.15, -4.2],
                    size:[3, 0.05, 0.6],
                    rot:[0.0, 0.1, 0],
                    stallAngle:[0.4, 0.4, 0.2],
                    stallLiftCoeff:[12, 0, 0],
                    formDragCoeff:0.002
                },

                aeilronLeft:{
                    controls:{
                        aeilrons:[-0.3, 0, 0]
                    },

                    pos:[-3, 0.15, -4.3],
                    size:[3, 0.05, 0.6],
                    rot:[-0.0, -0.1, 0],
                    stallAngle:[0.4, 0.4, 0.2],
                    stallLiftCoeff:[12, 0, 0],
                    formDragCoeff:0.002
                },
                elevator:{
                    controls:{
                        elevator:[0.8,0,  0]
                    },
                    pos:[0, 0.2, -4.5],
                    size:[3.6, 0.04, 1.0],
                    rot:[0.0, 0, 0],
                    stallAngle:[1.5, 0.4, 0.3],
                    stallLiftCoeff:[12, 0, 0],
                    formDragCoeff:0.001
                },
                rudder:{
                    controls:{
                        rudder:[-0.4, 0, 0]
                    },
                    pos:[0, 1.9, -4.3],
                    size:[1.6, 0.01, 0.8],
                    rot:[0, 0, -Math.PI / 2],
                    stallAngle:[1.45, 0.5, 1],
                    stallLiftCoeff:[8, 0, 0],
                    formDragCoeff:0.01
                }
                /*
                 stabiliser:{
                 pos:[0, 1.3, -5.3],
                 size:[2.2, 0.1, 1.1],
                 rot:[0, 0, -Math.PI / 2],
                 stallAngle:[0.7, 0.4, 1],
                 stallLiftCoeff:[6, 0, 0],
                 formDragCoeff:0.01
                 }
                 */
            },

            surfaces:{

                elevator:{
                    inputBehavior:{release:1, speed:0.1},
                    controls: {
                        elevator:{flap_r:-0.5, flap_l:0.5},
                        aeilrons:{aeilron_r:-0.5, aeilron_l:0.5}
                    },
                    speed:0.03
                },
                aeilrons:{
                    inputBehavior:{release:1, speed:0.1},
                    controls:{
                        aeilrons:{aeilron_r:0.5, aeilron_l:0.5},
                        elevator:{flap_r:0.5, flap_l:0.5}
                    },
                    speed:0.03
                },
                /*
                 elevons: {
                 inputBehavior:{release:1, speed:0.1},
                 controls:{
                 aeilrons:{aeilron_r:0.5, aeilron_l:0.5},
                 elevator:{flap_r:0.5, flap_l:0.5}
                 },
                 speed:0.03
                 },
                 */
                rudder:{
                    inputBehavior:{release:1, speed:0.1},
                    controls: {
                        rudder:{rudder:-0.8}
                    },
                    speed:0.02
                }
            },

            systems:{

                auto_trim: {
                    inputBehavior:{type:"toggle", speed:1},
                    speed:1
                },

                gears: {
                    inputBehavior:{type:"toggle", speed:1},
                    controls: {
                        doors:{door_nose_r:[-2.7,0,0], door_nose_l:[2.7,0,0], door_l:[1.4,0,0], door_r:[-1.4,0,0], door_l_inner:[-1.4,0,0], door_r_inner:[1.4,0,0]},
                        stands:{gear_nose:[1.4, 0,0], gear_r:[1.3, 0, 0], gear_l:[-1.3, 0, 0]}
                    },
                    wheels:{
                        wheel_nose: {control:'rudder', radius:0.3,  pos:[0, -1.28, 3.0],     breakMax:555.02, drag:5, suspension:{boneId:'susp_nose', range:0.12, axis:[0, 1, 0], stiffness:22550}}, // stiffness approx n/m
                        wheel_r:    {control:null,     radius:-0.5, pos:[-1.9, -1.02, -0.5], breakMax:9525.05, drag:5, suspension:{boneId:'susp_r',    range:0.12, axis:[0, 1, 0], stiffness:75000}},
                        wheel_l:    {control:null,     radius:0.5,  pos:[1.9, -1.02, -0.5],  breakMax:9525.05, drag:5, suspension:{boneId:'susp_l',    range:0.12, axis:[0, -1, 0],  stiffness:75000}}
                        //    wheel_rear: {control:null, radius:0.3, pos:[0, -1.1, -4.4],      breakMax:1555.02, drag:5, suspension:{boneId:null, range:0.31, axis:[0, 0, -1], stiffness:14550}}

                    },
                    speed:0.01
                },
                breaks: {
                    inputBehavior:{type:"slide", speed:0.1},
                    controls: {
                        //  breaks:{airbreak_right:-0.65, airbreak_left:0.65}
                    },
                    speed:0.01
                },
                canopy: {
                    inputBehavior:{type:"toggle", speed:1},
                    controls: {
                        xform:"rotate",
                        doors:{canopy:[1.05, 0, 0]}
                    },
                    speed:0.01
                },
                seat: {
                    inputBehavior:{type:"button", speed:1},
                    type:"ejection",
                    controls: {
                        seats:{/* seat:[-2.15, 0, -0.5]*/}
                    },
                    speed:0.4
                },
                engines:{
                    inputBehavior:{type:"slide", speed:0.1 /* ,inputAnim:{bone:"throttle", rot:[-1,0,0]} */},
                    controls: {
                        throttle:{/*throttle:0.8*/}
                    },
                    mounts: [{
                        maxThrust:73000, // KiloNewtons  Actual Tunnan Engine: 27k
                        jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                        jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                        posOffset:[0, 0.2, -6]
                    }],
                    speed:0.005
                },
                weapons:{
                    inputBehavior:{type:"button", speed:1},
                    controls: {
                        cannons:{ /* trigger:0.3  */  }
                    },
                    cannons: [
                        {
                            data:weaponData.CANNONS.hispano_20,
                            bulletData:weaponData.BULLET_20,
                            posOffset:[1.65, 0.27, 1.8]
                        },
                        {
                            data:weaponData.CANNONS.hispano_20,
                            bulletData:weaponData.BULLET_20,
                            posOffset:[-1.65, 0.27, 1.8]
                        }
                    ],
                    speed:2
                }
            }
        },


        COUGAR:{
            modelPath:"cougar_f9f",
            dimensions: {
                massEmpty:7845,
                massMax:11375,
                weightDistribution:[2, 2, 3], // average radius from pog for each axis, user for inertia of momentum
                length:12,
                wingspan:11.23,
                pilotSeatPos:[0, 0.10, 2.22],
                wingAngle:0.2, // ratio length / width / (1 = arrow, 0 = easystar)
                height:3.75
            },

            hitPoints:300,
            physicalShapes:[
                {partId:"fuselage", posOffset:[0, 0, 0], radius:5},
                {partId:"fuselage", posOffset:[0, 0, 4], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -4], radius:5},
                {partId:"wing", posOffset:[4,  0, -4], radius:5},
                {partId:"wing", posOffset:[-4, 0, -4], radius:5}
            ],
            physicalRadius:30,

            keyBindings:gameConfig.KEY_BINDINGS.plane,
            gooProjectUrl:gameConfig.GOO_PROJECTS.cougar_f9f.projectPath,
            piecePath:gameConfig.GOO_PROJECTS.cougar_f9f.cougar_f9f,
            contrail_effect:modelDefinitions.GOO_PARTICLES.wing_smoke,
            uiPages:["UI_TUNNAN","UI_AIR_PARAMS", "UI_BOTTOM_BAR"],

            wing_smoke:[
                [-5.8, -0.5, -3],
                [5.8, -0.5, -3]
            ],

            instruments: {
                /*
                 horizon:{axisAmp:[[2, 0.0045], [1, 0], [2,-0.025]]},
                 roll_indicator:{axisAmp:1},
                 gyro_compass:{axisAmp:1},
                 gyro_steer:{axisAmp:1},
                 climb_indicator:{axisAmp:1},
                 speed_indicator:{axisAmp:1},
                 alt_outer:{axisAmp:-31.4},
                 alt_inner:{axisAmp:-3.14}
                 */
            },

            measurements: {
                throttle:1,
                speed:1,
                altitude:1,
                airflowx:1,
                airflowy:1,
                airflowz:1,
                gForce:1
            },

            wings: {
                /*
                 fuselageTip:{
                 pos:[0, -0.2, 3.4],
                 size:[0.6, 0.6, 0.6],
                 rot:[0.02, 0, 0],
                 stallAngle:[0.5, 1, 1],
                 stallLiftCoeff:[3.5, 0, 0],
                 formDragCoeff:0.1
                 },
                 */
                fuselageFore:{
                    pos:[0, -0.2, 2],
                    size:[1.2, 1.2, 1.2],
                    rot:[0.02, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[4.5, 0, 0],
                    formDragCoeff:0.05
                },
                /*
                 fuselageSkid:{
                 pos:[0, -1.2, 0],
                 size:[0.2, 0.1, 3],
                 rot:[0.07, 0, 0],
                 stallAngle:[0.5, 1, 1],
                 stallLiftCoeff:[5.5, 0, 0],
                 formDragCoeff:0.1
                 },
                 */
                fuselageMid:{
                    pos:[0, -0.2, 0],
                    size:[0.7, 0.01, 3],
                    rot:[0.05, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[4.5, 0, 0],
                    formDragCoeff:0.1
                },
                fuselageCore:{
                    pos:[0, -0.2, 0],
                    size:[1.4, 1.4, 1.4],
                    rot:[0.0, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[3.5, 0, 0],
                    formDragCoeff:0.05
                },
                fuselageAft:{
                    pos:[0, -0.2, -1.5],
                    size:[0.6, 0.6, 0.6],
                    rot:[0.03, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[2.5, 0, 0],
                    formDragCoeff:0.05
                },
                /*
                 fuselageEnd:{
                 pos:[0, -0.2, -3],
                 size:[1.0, 1.0, 1.0],
                 rot:[0.03, 0, 0],
                 stallAngle:[0.5, 1, 1],
                 stallLiftCoeff:[1.5, 0, 0],
                 formDragCoeff:0.05
                 },
                 */
                mainInnerRight:{
                    pos:[1.3, 0.24, 0.41],
                    size:[2.7, 0.1, 2.6],
                    rot:[0.004, 0.65, 0],
                    stallAngle:[0.5, 0.5, 0.2],
                    stallLiftCoeff:[75, 0, 0],
                    formDragCoeff:0.001
                },
                mainInnerLeft:{
                    pos:[-1.3, 0.24, 0.41],
                    size:[2.7, 0.05, 2.6],
                    rot:[0.004, -0.65, 0],
                    stallAngle:[0.5, 0.5, 0.2],
                    stallLiftCoeff:[75, 0, 0],
                    formDragCoeff:0.001
                },
                mainOuterRight:{
                    pos:[4, 0.20, -0.8],
                    size:[3.8, 0.05, 1.8],
                    rot:[0.002, 0.62, 0],
                    stallAngle:[0.45, 0.3, 0.2],
                    stallLiftCoeff:[52, 0, 0],
                    formDragCoeff:0.001
                },
                mainOuterLeft:{
                    pos:[-4, 0.20, -0.8],
                    size:[3.8, 0.05, 1.8],
                    rot:[0.002, -0.62, 0],
                    stallAngle:[0.45, 0.3, 0.2],
                    stallLiftCoeff:[52, 0, 0],
                    formDragCoeff:0.001
                },


                flapRight:{
                    controls:{
                        flaps:[-1.1, 0, 0]
                    },

                    pos:[1.6, 0.265, -0.05],
                    size:[1.8, 0.1, 1.4],
                    rot:[0.0, 0.5, 0],
                    stallAngle:[1.2, 0.7, 0.2],
                    stallLiftCoeff:[27, 0, 0],
                    formDragCoeff:0.002
                },

                flapLeft:{
                    controls:{
                        flaps:[-1.1, 0, 0]
                    },

                    pos:[-1.6, 0.265, -0.05],
                    size:[1.8, 0.05, 1.4],
                    rot:[0.0, -0.5, 0],
                    stallAngle:[1.2, 0.7, 0.2],
                    stallLiftCoeff:[27, 0, 0],
                    formDragCoeff:0.002
                },
                aeilronRight:{
                    controls:{
                        aeilrons:[0.3, 0, 0]
                    },

                    pos:[3, 0.15, -1.8],
                    size:[3, 0.05, 0.5],
                    rot:[0.0, 0.5, 0],
                    stallAngle:[0.4, 0.4, 0.2],
                    stallLiftCoeff:[32, 0, 0],
                    formDragCoeff:0.002
                },

                aeilronLeft:{
                    controls:{
                        aeilrons:[-0.3, 0, 0]
                    },

                    pos:[-3, 0.15, -1.8],
                    size:[3, 0.05, 0.5],
                    rot:[-0.0, -0.5, 0],
                    stallAngle:[0.4, 0.4, 0.2],
                    stallLiftCoeff:[32, 0, 0],
                    formDragCoeff:0.002
                },
                elevator:{
                    controls:{
                        elevator:[0.8,0,  0]
                    },
                    pos:[0, 1.1, -5.8],
                    size:[4.0, 0.04, 1.2],
                    rot:[0.0, 0, 0],
                    stallAngle:[1.5, 0.4, 0.3],
                    stallLiftCoeff:[28, 0, 0],
                    formDragCoeff:0.001
                },
                rudder:{
                    controls:{
                        rudder:[-0.4, 0, 0]
                    },
                    pos:[0, 1.9, -6.3],
                    size:[1.6, 0.01, 0.8],
                    rot:[0, 0, -Math.PI / 2],
                    stallAngle:[1.45, 0.5, 1],
                    stallLiftCoeff:[45, 0, 0],
                    formDragCoeff:0.01
                },

                stabiliser:{
                    pos:[0, 1.3, -5.3],
                    size:[2.2, 0.1, 1.1],
                    rot:[0, 0, -Math.PI / 2],
                    stallAngle:[0.7, 0.4, 1],
                    stallLiftCoeff:[6, 0, 0],
                    formDragCoeff:0.01
                }
            },

            surfaces:{
                elevator:{
                    inputBehavior:{release:1, speed:0.1/*, inputAnim:{bone:"stick", rot:[0.4,0.5,0]} */},
                    controls: {
                        elevator:{elevator:0.6}
                    },
                    speed:0.03
                },

                aeilrons:{
                    inputBehavior:{release:1, speed:0.1},
                    controls:{
                        aeilrons:{aeilron_r:0.5, aeilron_l:0.5}
                    },
                    speed:0.03
                },

                rudder:{
                    inputBehavior:{release:1, speed:0.1},
                    controls: {
                        rudder:{rudder:-0.8 /*, pedal_left:-0.7, pedal_right:-0.7 */}
                    },
                    speed:0.02
                },
                flaps:{
                    inputBehavior:{release:0, speed:0.1},
                    controls: {
                        flaps:{flap_r:1.1, flap_l:-1.1}
                    },
                    speed:0.005
                }
            },

            systems:{
                auto_trim: {
                    inputBehavior:{type:"toggle", speed:1},
                    speed:1
                },
                gears: {
                    inputBehavior:{type:"toggle", speed:1},
                    controls: {
                        doors:{door_nose_r:[-1.4,0,0], door_nose_l:[1.4,0,0], door_l:[-1.1,0,0], door_r:[1.1,0,0]},
                        stands:{gear_nose:[-1.5, 0,0], gear_right:[-1.0, 0, 0], gear_left:[1.0, 0, 0]}
                    },
                    wheels:{
                        wheel_nose: {control:'rudder', radius:0.3, pos:[0, -1.4, 3.4],      breakMax:1555.02, drag:5, suspension:{boneId:'susp_nose',    range:0.11, axis:[0, -1, 0], stiffness:14550}}, // stiffness approx n/m
                        wheel_r:    {control:null, radius:-0.5,    pos:[-1.4, -1.33, -0.17],  breakMax:3025.05, drag:5, suspension:{boneId:'susp_right', range:0.11, axis:[0, -1, 0], stiffness:85000}},
                        wheel_l:    {control:null, radius:0.5,   pos:[1.4, -1.33, -0.17], breakMax:3025.05, drag:5, suspension:{boneId:'susp_left',      range:0.11, axis:[0, 1, 0], stiffness:85000}}
                        //    wheel_rear: {control:null, radius:0.3, pos:[0, -1.1, -4.4],      breakMax:1555.02, drag:5, suspension:{boneId:null, range:0.31, axis:[0, 0, -1], stiffness:14550}}

                    },
                    speed:0.01
                },
                breaks: {
                    inputBehavior:{type:"slide", speed:0.1},
                    controls: {
                        //  breaks:{airbreak_right:-0.65, airbreak_left:0.65}
                    },
                    speed:0.01
                },
                canopy: {
                    inputBehavior:{type:"toggle", speed:1},
                    controls: {
                        xform:"slide",
                        doors:{canopy:[-0.05, 0.85, 0]}
                    },
                    speed:0.01
                },
                seat: {
                    inputBehavior:{type:"button", speed:1},
                    type:"ejection",
                    controls: {
                        seats:{seat:[-2.15, 0, -0.5]}
                    },
                    speed:0.4
                },
                engines:{
                    inputBehavior:{type:"slide", speed:0.1 /* ,inputAnim:{bone:"throttle", rot:[-1,0,0]} */},
                    controls: {
                        throttle:{throttle:0.8}
                    },
                    mounts: [{
                        maxThrust:57000, // KiloNewtons  Actual Tunnan Engine: 27k
                        jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                        jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                        posOffset:[0, -0.1, -4]
                    }],
                    speed:0.005
                },
                weapons:{
                    inputBehavior:{type:"button", speed:1},
                    controls: {
                        cannons:{ /* trigger:0.3  */  }
                    },
                    cannons: [
                        {
                            data:weaponData.CANNONS.hispano_20,
                            bulletData:weaponData.BULLET_20,
                            posOffset:[0.44, -0.54, 3.6]
                        },
                        {
                            data:weaponData.CANNONS.hispano_20,
                            bulletData:weaponData.BULLET_20,
                            posOffset:[0.32, -0.75, 3.35]
                        },
                        {
                            data:weaponData.CANNONS.hispano_20,
                            bulletData:weaponData.BULLET_20,
                            posOffset:[-0.32, -0.75, 3.35]
                        },
                        {
                            data:weaponData.CANNONS.hispano_20,
                            bulletData:weaponData.BULLET_20,
                            posOffset:[-0.44, -0.54, 3.6]
                        }
                    ],
                    speed:2
                }
            }
        },

        B52:{
            modelPath:"b_52",
            dimensions: {
                massEmpty:115845,
                massMax:231375,
                weightDistribution:[21, 21, 21], // average radius from pog for each axis, user for inertia of momentum
                length:47,
                wingspan:56.23,
                pilotSeatPos:[0, 0.90, 18.72],

                wingAngle:0.2, // ratio length / width / (1 = arrow, 0 = easystar)
                height:3.75
            },

            hitPoints:300,
            physicalShapes:[
                {partId:"fuselage", posOffset:[0, 0, 15], radius:5},
                {partId:"fuselage", posOffset:[0, 0, 7], radius:5},
                {partId:"fuselage", posOffset:[0, 0, 0], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -7], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -15], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -22], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -29], radius:5},
                {partId:"engine", posOffset:[19, -1.5, -2.5], radius:5},
                {partId:"engine", posOffset:[-19, -1.5, -2.5], radius:5},
                {partId:"engine", posOffset:[11, -1.5, 4.5], radius:5},
                {partId:"engine", posOffset:[-11, -1.5, 4.5], radius:5},
                {partId:"wing", posOffset:[12, 0.5, -2], radius:5},
                {partId:"wing", posOffset:[-12, 0.5, -2], radius:5},
                {partId:"wing", posOffset:[25, -1, -10.5], radius:5},
                {partId:"wing", posOffset:[-25, -1, -10.5], radius:5}

            ],
            physicalRadius:50,

            keyBindings:gameConfig.KEY_BINDINGS.plane,
            gooProjectUrl:gameConfig.GOO_PROJECTS.stratofortress.projectPath,
            piecePath:gameConfig.GOO_PROJECTS.stratofortress.b_52,
            //    contrail_effect:modelDefinitions.GOO_PARTICLES.wing_smoke,
            uiPages:["UI_TUNNAN","UI_AIR_PARAMS", "UI_BOTTOM_BAR"],

            wing_smoke:[
                [-19, -2, -5],
                [19, -2, -5],
                [-10.5, -1.4, 1.5],
                [10.5, -1.4, 1.5]
            ],

            instruments: {
                /*
                 horizon:{axisAmp:[[2, 0.0045], [1, 0], [2,-0.025]]},
                 roll_indicator:{axisAmp:1},
                 gyro_compass:{axisAmp:1},
                 gyro_steer:{axisAmp:1},
                 climb_indicator:{axisAmp:1},
                 speed_indicator:{axisAmp:1},
                 alt_outer:{axisAmp:-31.4},
                 alt_inner:{axisAmp:-3.14}
                 */
            },

            measurements: {
                throttle:1,
                speed:1,
                altitude:1,
                airflowx:1,
                airflowy:1,
                airflowz:1,
                gForce:1
            },

            wings: {
                fuselageMid:{
                    pos:[0, -0.9, 2],
                    size:[9, 9, 45],
                    rot:[0.0, 0, 0],
                    stallAngle:[0.5, 1, 1],
                    stallLiftCoeff:[5.5, 0, 0],
                    formDragCoeff:0.3
                },
                mainInnerRight:{
                    pos:[12.3, 0.24, -0.41],
                    size:[26, 1, 8],
                    rot:[0.02, 0.6, 0],
                    stallAngle:[0.5, 0, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.4
                },
                mainInnerLeft:{
                    pos:[-12.3, 0.24, -0.41],
                    size:[26, 1, 8],
                    rot:[0.02, -0.6, 0],
                    stallAngle:[0.5, 0, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.4
                },
                mainOuterRight:{
                    pos:[27, 0.20, -11.8],
                    size:[5.8, 1.7, 7],
                    rot:[0.0, 0, 0],
                    stallAngle:[0.45, 0.3, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.6
                },
                mainOuterLeft:{
                    pos:[-27, 0.20, -11.8],
                    size:[5.8, 1.7, 7],
                    rot:[0.0, 0, 0],
                    stallAngle:[0.45, 0.3, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.6
                },


                flapRight:{
                    controls:{
                        flaps:[-1.1, 0, 0]
                    },

                    pos:[15.6, 0.5, 0.05],
                    size:[12.8, 0.1, 4.4],
                    rot:[0.0, 0, 0],
                    stallAngle:[1.2, 0.7, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.2
                },

                flapLeft:{
                    controls:{
                        flaps:[-1.1, 0, 0]
                    },

                    pos:[-15.6, 0.5, 0.05],
                    size:[12.8, 0.1, 4.4],
                    rot:[0.0, 0, 0],
                    stallAngle:[1.2, 0.7, 0.2],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.2
                },
                aeilronRight:{
                    controls:{
                        aeilrons:[0.3, 0, 0]
                    },

                    pos:[18, 0.15, -8.8],
                    size:[8, 0.05, 1.5],
                    rot:[0.0, 0, 0],
                    stallAngle:[0.4, 0.4, 0.2],
                    stallLiftCoeff:[5, 0, 0],
                    formDragCoeff:0.002
                },

                aeilronLeft:{
                    controls:{
                        aeilrons:[-0.3, 0, 0]
                    },

                    pos:[-18, 0.15, -8.8],
                    size:[8, 0.05, 1.5],
                    rot:[-0.0, -0, 0],
                    stallAngle:[0.4, 0.4, 0.2],
                    stallLiftCoeff:[5, 0, 0],
                    formDragCoeff:0.002
                },
                tailplane:{
                    pos:[0, 1.1, -20.8],
                    size:[14.0, 0.4, 4.2],
                    rot:[-0.04, -0.0, 0],
                    stallAngle:[1.5, 0.4, 0.3],
                    stallLiftCoeff:[42, 0, 0],
                    formDragCoeff:0.001
                },
                elevator:{
                    controls:{
                        elevator:[0.8,0,  0]
                    },
                    pos:[0, 1.1, -22.8],
                    size:[14.0, 0.04, 1.2],
                    rot:[0.0, 0, 0],
                    stallAngle:[1.5, 0.4, 0.3],
                    stallLiftCoeff:[32, 0, 0],
                    formDragCoeff:0.001
                },
                rudder:{
                    controls:{
                        rudder:[-0.4, 0, 0]
                    },
                    pos:[0, 3.9, -23.3],
                    size:[5, 0.01, 1],
                    rot:[0, 0, -Math.PI / 2],
                    stallAngle:[1.45, 0.5, 1],
                    stallLiftCoeff:[22, 0, 0],
                    formDragCoeff:0.01
                },

                stabiliser:{
                    pos:[0, 1.3, -15.3],
                    size:[5.2, 0.1, 4.1],
                    rot:[0, 0, -Math.PI / 2],
                    stallAngle:[0.7, 0.4, 1],
                    stallLiftCoeff:[22, 0, 0],
                    formDragCoeff:0.01
                }
            },

            surfaces:{
                elevator:{
                    inputBehavior:{release:1, speed:0.1/*, inputAnim:{bone:"stick", rot:[0.4,0.5,0]} */},
                    controls: {
                        elevator:{elevator_r:-0.6, elevator_l:0.6}
                    },
                    speed:0.03
                },

                aeilrons:{
                    inputBehavior:{release:1, speed:0.1},
                    controls:{
                        aeilrons:{aeilron_r:0.5, aeilron_l:0.5}
                    },
                    speed:0.03
                },

                rudder:{
                    inputBehavior:{release:1, speed:0.1},
                    controls: {
                        rudder:{rudder:-0.8 /*, pedal_left:-0.7, pedal_right:-0.7 */}
                    },
                    speed:0.02
                },
                flaps:{
                    inputBehavior:{release:0, speed:0.1},
                    controls: {
                        flaps:{flap_r_in:1.1, flap_l_in:-1.1, flap_r_out:1.1, flap_l_out:-1.1}
                    },
                    speed:0.005
                }
            },

            systems:{
                auto_trim: {
                    inputBehavior:{type:"toggle", speed:1},
                    speed:1
                },

                /*
                 gears: {
                 inputBehavior:{type:"toggle", speed:1},
                 controls: {
                 doors:{door_nose_r:[-1.4,0,0], door_nose_l:[1.4,0,0], door_l:[-1.1,0,0], door_r:[1.1,0,0]},
                 stands:{gear_nose:[-1.5, 0,0], gear_right:[-1.0, 0, 0], gear_left:[1.0, 0, 0]}
                 },
                 wheels:{
                 wheel_nose: {control:'rudder', radius:0.3, pos:[0, -1.4, 3.4],      breakMax:1555.02, drag:5, suspension:{boneId:'susp_nose',    range:0.11, axis:[0, -1, 0], stiffness:14550}}, // stiffness approx n/m
                 wheel_r:    {control:null, radius:-0.5,    pos:[-1.4, -1.33, -0.17],  breakMax:3025.05, drag:5, suspension:{boneId:'susp_right', range:0.11, axis:[0, -1, 0], stiffness:85000}},
                 wheel_l:    {control:null, radius:0.5,   pos:[1.4, -1.33, -0.17], breakMax:3025.05, drag:5, suspension:{boneId:'susp_left',      range:0.11, axis:[0, 1, 0], stiffness:85000}}
                 //    wheel_rear: {control:null, radius:0.3, pos:[0, -1.1, -4.4],      breakMax:1555.02, drag:5, suspension:{boneId:null, range:0.31, axis:[0, 0, -1], stiffness:14550}}

                 },
                 speed:0.01
                 },
                 breaks: {
                 inputBehavior:{type:"slide", speed:0.1},
                 controls: {
                 //  breaks:{airbreak_right:-0.65, airbreak_left:0.65}
                 },
                 speed:0.01
                 },
                 canopy: {
                 inputBehavior:{type:"toggle", speed:1},
                 controls: {
                 xform:"slide",
                 doors:{canopy:[-0.05, 0.85, 0]}
                 },
                 speed:0.01
                 },
                 seat: {
                 inputBehavior:{type:"button", speed:1},
                 type:"ejection",
                 controls: {
                 seats:{seat:[-2.15, 0, -0.5]}
                 },
                 speed:0.4
                 },

                 */
                engines:{
                    inputBehavior:{type:"slide", speed:0.1 /* ,inputAnim:{bone:"throttle", rot:[-1,0,0]} */},
                    controls: {
                        throttle:{throttle:0.8}
                    },
                    mounts: [{
                        maxThrust:150000, // Newtons  Actual Tunnan Engine: 27k
                        jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                        jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                        posOffset:[-19, -1.4, -5]
                    },{
                        maxThrust:150000, // Newtons  Actual Tunnan Engine: 27k
                        jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                        jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                        posOffset:[19, -1.4, -5]
                    },{
                        maxThrust:150000, // Newtons  Actual Tunnan Engine: 27k
                        jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                        jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                        posOffset:[-10.5, -1.0, 1.5]
                    },{
                        maxThrust:150000, // Newtons  Actual Tunnan Engine: 27k
                        jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                        jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                        posOffset:[10.5, -1.0, 1.5]
                    }],
                    speed:0.005
                }

                /*

                 wing_smoke:[
                 [-19, -2, -5],
                 [19, -2, -5],
                 [-10.5, -1.4, 1.5],
                 [10.5, -1.4, 1.5]
                 weapons:{
                 inputBehavior:{type:"button", speed:1},
                 controls: {
                 cannons:{  }
                 },
                 cannons: [
                 {
                 data:weaponData.CANNONS.hispano_20,
                 bulletData:weaponData.BULLET_20,
                 posOffset:[0.44, -0.54, 3.6]
                 },
                 {
                 data:weaponData.CANNONS.hispano_20,
                 bulletData:weaponData.BULLET_20,
                 posOffset:[0.32, -0.75, 3.35]
                 },
                 {
                 data:weaponData.CANNONS.hispano_20,
                 bulletData:weaponData.BULLET_20,
                 posOffset:[-0.32, -0.75, 3.35]
                 },
                 {
                 data:weaponData.CANNONS.hispano_20,
                 bulletData:weaponData.BULLET_20,
                 posOffset:[-0.44, -0.54, 3.6]
                 }
                 ],
                 speed:2
                 }
                 */
            }
        },


        BLACKBIRD:{
            modelPath:"blackbird",
            dimensions: {
                massEmpty:30845,
                massMax:58375,
                weightDistribution:[2, 2, 2], // average radius from pog for each axis, user for inertia of momentum
                length:11,
                wingspan:10.23,

                wingAngle:0.2, // ratio length / width / (1 = arrow, 0 = easystar)
                height:3.75
            },

            forcePoints: {
                weight:[0, 0, 0],
                thrust:[0, -0.5, -5],
                wingLiftLeft:[3, 1, -2],
                wingLiftRight:[-3, 2, -2],
                elevatorLift:[0, 2, -7.5],
                rudderYaw:[0, 3, -7]
            },


            wings: {
                fuselage:{
                    pos:[0, -0.04, 5.1],
                    size:[1.7, 1.5, 29],
                    rot:[0, 0, 0],
                    stallAngle:[0.6, 1, 1],
                    stallLiftCoeff:[0.01, 0, 0],
                    formDragCoeff:0.0002
                },

                fuselageWing:{
                    pos:[0, -0.04, 6.1],
                    size:[3.2, 0.02, 29],
                    rot:[0.0031, 0, 0],
                    stallAngle:[0.6, 1, 1],
                    stallLiftCoeff:[4, 0, 0],
                    formDragCoeff:0.001
                },

                mainInnerRight:{
                    pos:[3.1, -0.24, -1.41],
                    size:[13.5, 0.02, 4.6],
                    rot:[0.004, 1.02, 0],
                    stallAngle:[0.3, 0.5, 0.2],
                    stallLiftCoeff:[12, 0, 0],
                    formDragCoeff:0.001
                },
                mainInnerLeft:{
                    pos:[-3.1, -0.24, -1.41],
                    size:[13.5, 0.02, 4.6],
                    rot:[0.004, -1.02, 0],
                    stallAngle:[0.3, 0.5, 0.2],
                    stallLiftCoeff:[12, 0, 0],
                    formDragCoeff:0.001
                },
                mainEngineRight:{
                    pos:[4.4, 0.20, -2],
                    size:[1.9, 1.9, 11.4],
                    rot:[0.002, 0, 0],
                    stallAngle:[0.15, 0.3, 0.2],
                    stallLiftCoeff:[1, 0, 0],
                    formDragCoeff:0.001
                },
                mainEngineLeft:{
                    pos:[-4.4, 0.20, -2],
                    size:[1.9, 1.9, 11.4],
                    rot:[0.002, 0, 0],
                    stallAngle:[0.15, 0.3, 0.2],
                    stallLiftCoeff:[1, 0, 0],
                    formDragCoeff:0.001
                },


                flapRight:{
                    controls:{
                        elevator:[0.08,0,  0]
                    },

                    pos:[2.3, -0.15, -8.3],
                    size:[2.4, 0.05, 1.5],
                    rot:[0.005, -0.4, 0],
                    stallAngle:[0.6, 0.7, 0.2],
                    stallLiftCoeff:[8, 0, 0],
                    formDragCoeff:0.001
                },

                flapLeft:{
                    controls:{
                        elevator:[0.08,0,  0]
                    },

                    pos:[-2.3, -0.15, -8.3],
                    size:[2.4, 0.05, 1.5],
                    rot:[0.005, 0.4, 0],
                    stallAngle:[0.6, 0.7, 0.2],
                    stallLiftCoeff:[8, 0, 0],
                    formDragCoeff:0.001
                },
                aeilronRight:{
                    controls:{
                        aeilrons:[0.1, 0, 0]
                    },

                    pos:[7, -0.15, -7.2],
                    size:[3.3, 0.05, 1.0],
                    rot:[0.0, -0.4, 0],
                    stallAngle:[0.6, 0.4, 0.2],
                    stallLiftCoeff:[6, 0, 0],
                    formDragCoeff:0.001
                },

                aeilronLeft:{
                    controls:{
                        aeilrons:[-0.1, 0, 0]
                    },

                    pos:[-7, -0.15, -7.2],
                    size:[3.3, 0.05, 1.0],
                    rot:[-0.0, 0.4, 0],
                    stallAngle:[0.6, 0.4, 0.2],
                    stallLiftCoeff:[6, 0, 0],
                    formDragCoeff:0.001
                },

                rudderR:{
                    controls:{
                        rudder:[0.1, 0, 0]
                    },
                    pos:[3.8, 2.7, -6.8],
                    size:[2.4, 0.1, 3.8],
                    rot:[0, 0, -0 -Math.PI / 2],
                    stallAngle:[0.4, 0.5, 1],
                    stallLiftCoeff:[12, 0, 0],
                    formDragCoeff:0.001
                },
                rudderL:{
                    controls:{
                        rudder:[0.1, 0, 0]
                    },
                    pos:[-3.8, 2.7, -6.8],
                    size:[2.4, 0.1, 3.8],
                    rot:[0, 0, -0 +Math.PI / 2],
                    stallAngle:[0.4, 0.4, 1],
                    stallLiftCoeff:[4, 0, 0],
                    formDragCoeff:0.001
                }


            },

            modelDefinition:modelDefinitions.GOO_MODELS.tunnan,
            uiPage:"UI_TUNNAN",
            elevator:{
                inputBehavior:{type:"slide", speed:0.1},
                controls: {
                    elevator:{elevator:0.6}
                },
                speed:0.1
            },

            aeilrons:{
                inputBehavior:{type:"slide", speed:0.1},
                controls:{
                    aeilrons:{rightAeilron:0.8, leftAeilron:0.8}
                },
                speed:0.07
            },

            rudder:{
                inputBehavior:{type:"slide", speed:0.1},
                controls: {
                    rudder:{rudder:-0.7}
                },
                speed:0.06
            },
            flaps:{
                inputBehavior:{type:"toggle", speed:1},
                controls: {
                    flaps:{rightFlap:1.1, leftFlap:-1.1}
                },
                speed:0.01
            },
            gears: {
                inputBehavior:{type:"toggle", speed:1},
                controls: {
                    doors:{noseGearDoorRight:-1.4, noseGearDoorLeft:1.4, leftGearDoor:1.2, rightGearDoor:-1.2},
                    stands:{noseGear:-1.4, rightGear:-2, leftGear:2}
                },
                wheels:{noseWheel:-0.8, rightWheel:1, leftWheel:-1},
                speed:0.01
            },
            canopy: {
                inputBehavior:{type:"button", speed:1},
                type:"slide",
                controls: {
                    doors:{canopy:[-0.15, 0, -0.8]}
                },
                speed:0.01
            },
            seat: {
                inputBehavior:{type:"button", speed:1},
                type:"ejection",
                controls: {
                    seats:{seat:[-2.15, 0, -0.5]}
                },
                speed:0.4
            },
            engines:{
                inputBehavior:{type:"slide", speed:0.1},
                modelDefinition:modelDefinitions.GOO_PARTICLES.wing_smoke,
                controls: {
                    jet:{flame:1}
                },
                mounts: [{maxThrust:600000}], // KiloNewtons  Actual Tunnan Engine: 27k
                speed:0.01
            },
            boneMap: {
                canopy:"bone4",
                noseGearRoot:"bone14",
                noseGear:"bone15",
                noseWheel:"bone16",
                noseGearDoorRight:"bone17",
                noseGearDoorLeft:"bone18",
                rightAeilron:"bone19",
                rightFlap:"bone20",
                leftFlap:"bone21",
                leftAeilron:"bone22",
                seat:"bone23",
                elevator:"bone30",
                rudder:"bone29",
                rightGearRoot:"bone6",
                rightGear:"bone7",
                rightWheel:"bone8",
                rightGearDoor:"bone9",
                leftGearRoot:"bone10",
                leftGearDoor:"bone11",
                leftGear:"bone12",
                leftWheel:"bone13"
            }
        }
    }
});