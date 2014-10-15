"use strict";

define(["game/ModelDefinitions", "game/weapons/WeaponData"],function(modelDefinitions, weaponData) {

    return {
        SYSTEMS:{
            auto_trim: {
				pieceInput:{
					auto_trim:{value:0, controlState:0}
				},
                inputBehavior:{type:"toggle", speed:1},
                speed:1
            },
            gears: {
				pieceInput:{
					gears: {value:0, controlState:0},
					doors: {value:0, controlState:0}
				},
                inputBehavior:{type:"toggle", speed:1},
                controls: {
                    doors:{door_nose_r:[-1.4, 0, 0], door_nose_l:[1.4,0,0], door_left:[0.8,0,0], door_right:[-0.8,0,0]},
                    stands:{nose_gear:[-1.5, 0, 0], gear_right:[1.8, 0, 0], gear_left:[-1.8, 0, 0], right_suspend:[-0.6, 0, 0], left_suspend:[0.6, 0, 0]}
                },
                wheels:{
                    wheel_nose: {control:'rudder', radius:0.3, pos:[0, -1.5, 3.4], axis:[1, 0, 0], breakMax:155.02, drag:5, suspension:{boneId:'nose_suspend', range:0.31, axis:[0, 0, -1], stiffness:22550}}, // stiffness approx n/m
                    wheel_right:{control:null, radius:-0.5,    pos:[-0.9, -1.43, -0.17],  breakMax:2225, drag:5, suspension:{boneId:'right_suspend', range:0.31, axis:[0, 1,  0], stiffness:75000}},
                    wheel_left: {control:null, radius:0.5,   pos:[0.9, -1.43, -0.17], breakMax:2225, drag:5, suspension:{boneId:'left_suspend',  range:0.31, axis:[0, -1, 0], stiffness:75000}},
                    wheel_rear: {control:null, radius:0.3, pos:[0, -1.1, -4.4],      breakMax:1555.02, drag:5, suspension:{boneId:null, range:0.31, axis:[0, 0, -1], stiffness:14550}}

                },
                speed:0.01
            },
            breaks: {
				pieceInput:{
					breaks: {value:0, controlState:0}
				},
                inputBehavior:{type:"slide", speed:0.1},
                controls: {

                },
                speed:0.01
            },
            canopy: {
				pieceInput:{
					canopy:{value:0, controlState:0}
				},
                inputBehavior:{type:"toggle", speed:1},
                controls: {
                    xform:"slide",
                    doors:{canopy:[-0.7, 0, -0.09]}
                },
                speed:0.01
            },
            seat: {
				pieceInput:{
					eject:{value:0, controlState:0}
				},
                inputBehavior:{type:"button", speed:1},
                type:"ejection",
                controls: {
                    seats:{seat:[-2.15, 0, -0.5]}
                },
                speed:0.4
            },
            engines:{
				pieceInput:{
					throttle:{value:0, controlState:0}
				},
                inputBehavior:{type:"slide", speed:0.02, inputAnim:{bone:"throttle", rot:[-1,0,0]}},
                controls: {
                    throttle:{throttle:0.8}
                },
                mounts: [{
                    maxThrust:27000, // KiloNewtons  Actual Tunnan Engine: 27k
                    afterBurner:22000,
                    jet_flame:modelDefinitions.GOO_PARTICLES.basic_jet,
                    jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                    posOffset:[0, -0.3, -4]
                }],
                speed:0.0008
            },
            weapons:{
				pieceInput:{
					cannons: {value:0, controlState:0}
				},
                inputBehavior:{type:"button", speed:1},
                controls: {
                    cannons:{bones:[{trigger:0.3}]}
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
    }
});