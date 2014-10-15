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
                     lights:['wheels'],

                     doors:{door_nose_r:[-1.9, 0, 0], door_nose_l:[1.9,0,0], door_main_l:[1.3,0,0], door_main_r:[-1.3,0,0], door_rear_l:[1.2,0,0], door_rear_r:[-1.2,0,0], door_inner_l:[-1.5,0,0], door_inner_r:[1.5,0,0]},
                     stands:{gear_nose:[-1.66, 0, 0], gear_r:[-1.66, 0, 0], gear_l:[1.66, 0, 0], gear_susp_l:[1.5, 0, 0], gear_susp_r:[-1.5, 0, 0]}
                 },
                 wheels:{
                     nose_wheel: {control:'rudder', radius:-0.4, pos:[0, -1.71, 5.9], axis:[1, 0, 0],      breakMax:755.02, drag:5, suspension:{boneId:'nose_susp', range:0.41, axis:[0, 0, 10], stiffness:32550}}, // stiffness approx n/m
                     wheel_r:{control:null, radius:-0.5,    pos:[-2.6, -1.70, -1.07],  breakMax:5225, drag:5, suspension:{boneId:'gear_susp_r', range:0.41, axis:[0, 0, 10], stiffness:115000}},
                     wheel_l: {control:null, radius:0.5,   pos:[2.6, -1.70, -1.07], breakMax:5225, drag:5, suspension:{boneId:'gear_susp_l',  range:0.41, axis:[0, 0, 10], stiffness:115000}}
                 },
                 speed:0.01
             },
			 hook: {
				 pieceInput:{
					 hook: {value:0, controlState:0}
				 },
				 inputBehavior:{type:"slide", speed:0.1},
				 lights:['hook'],
				 controls: {

				 },
				 speed:0.01
			 },
             breaks: {
				 pieceInput:{
					 breaks: {value:0, controlState:0}
				 },
                 inputBehavior:{type:"slide", speed:0.1},
                 lights:['brakes'],
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
                     xform:"rotate",
                     doors:{canopy:[-0.45, 0, 0]}
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
                   inputBehavior:{type:"slide", speed:0.02, inputAnim:{bone:"throttle_r", rot:[-1,0,0]}},
                 //  inputBehavior:{type:"slide", speed:0.02},
                 controls: {
                     throttle:{throttle:0.8}
                 },
                 mounts: [{
                     maxThrust:77000, // KiloNewtons  Actual Tunnan Engine: 27k
                     afterBurner:42000,
                     nozzle:'nozzle_l',
                     flame_light:'engine_l',
                     jet_flame:modelDefinitions.GOO_PARTICLES.tomcat_jet,
                     jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                     posOffset:[-1.47, 0.3, -8],
                     rot:[0, 0.08, 0]
                 }, {
                     maxThrust:77000, // KiloNewtons  Actual Tunnan Engine: 27k
                     afterBurner:42000,
                     nozzle:'nozzle_r',
                     flame_light:'engine_r',
                     jet_flame:modelDefinitions.GOO_PARTICLES.tomcat_jet,
                     jet_smoke:modelDefinitions.GOO_PARTICLES.jet_smoke,
                     posOffset:[1.47, 0.3, -8],
                     rot:[0, -0.08, 0]
                 }],
                 speed:0.0008
             },
             weapons:{
				 pieceInput:{
					 cannons: {value:0, controlState:0}
				 },
                 inputBehavior:{type:"button", speed:6},
                 controls: {
                     //   cannons:{bones:[trigger:0.3]},
                     cannons:{lights:['hot_trig']}
                 },
                 cannons: [
                     {
                         data:weaponData.CANNONS.vulcan_20,
                         bulletData:weaponData.BULLET_20,
                         posOffset:[0.71, 0.23, 8.0]
                     }
                 ],
                 speed:1
             }
         }
    }
});