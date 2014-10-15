
"use strict";

define(['game/world/Curves'],function(curves) {
    var baseDragCoeff = 0.06;
	var skidStallCoeff = 0.1;
    var baseStallCoeff = 8;
    var wingStallCoeff = 18;
    var flapStallCoeff = 20;

    return {
        WINGS: {
			controls:{
				elevator:           {value:0, controlState:0},
				aeilrons:           {value:0, controlState:0},
				rudder:             {value:0, controlState:0},
				trim_elevator:      {value:0, controlState:0},
				trim_aeilrons:      {value:0, controlState:0},
				trim_rudder:        {value:0, controlState:0},
				flaps:              {value:0, controlState:0},
				breaks:             {value:0, controlState:0},
				auto_trim:          {value:0, controlState:0},
				wing_smoke:         {value:0, controlState:0},
				wing_sweep:         {value:0, controlState:0},
				reset_trim:         {value:0, controlState:0},
				debug_mechanics:    {value:0, controlState:0}
			},
			shapes:{
				fuselageMid:{
					pos:[0, 0.6, 0],
					size:[3.4, 0.4, 6.1],
					rot:[0.003, 0, 0],
					stallAngle:[1.3, 1, 1],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[baseStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				fuselageTip:{
					pos:[0, -0.4, 7.8],
					size:[1.2, 0.6, 4.8],
					rot:[0, 0, 0],
					stallAngle:[1.4, 1, 1],
					liftCurve:curves.WINGS.cone,
					stallLiftCoeff:[0.5, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				fuselageForeR:{
					pos:[1.5, 0.5, 3.1],
					size:[2.6, 0.1, 2.5],
					rot:[0.001, 0, 0],
					stallAngle:[0.9, 1, 1],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[baseStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				fuselageForeL:{
					pos:[-1.5, 0.5, 3.1],
					size:[2.6, 0.1, 2.5],
					rot:[0.001, 0, 0],
					stallAngle:[0.9, 1, 1],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[baseStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				fuselageAft:{
					pos:[0, 0.2, -4.1],
					size:[3.2, 0.4, 4],
					rot:[0.001, 0, 0],
					stallAngle:[0.8, 1, 1],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[baseStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},

				mainInnerRight:{
					controls:{
						wing_sweep:[-0.01, -0.3, 0]
					},
					pos:[2.4, 0.90, 0.7],
					size:[2.3, 0.05, 3.2],
					rot:[-0.005, 0.35, 0],
					stallAngle:[0.55, 0.3, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				mainInnerLeft:{
					controls:{
						wing_sweep:[-0.01, 0.3, 0]
					},
					pos:[-2.4, 0.90, 0.7],
					size:[2.3, 0.05, 3.2],
					rot:[-0.005, -0.35, 0],
					stallAngle:[0.55, 0.3, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},

				mainRight:{
					controls:{
						wing_sweep:[0.1, 1.1, 0]
					},
					pos:[4.4, 0.60, -0.9],
					size:[7.5, 0.1, 3.8],
					rot:[-0.1, 0.35, 0],
					stallAngle:[0.55, 0.3, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				mainLeft:{
					controls:{
						wing_sweep:[0.1, -1.1, 0]
					},
					pos:[-4.4, 0.60, -0.9],
					size:[7.5, 0.1, 3.8],
					rot:[-0.1, -0.35, 0],
					stallAngle:[0.55, 0.3, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},

				flapRight:{
					controls:{
						flaps:[-0.5, 0, 0]
					},

					pos:[2.5, 0.9, -1.2],
					size:[3.8, 0.05, 2.8],
					rot:[0.0, 0.1, 0],
					stallAngle:[1.2, 0.7, 0.2],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[flapStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},

				flapLeft:{
					controls:{
						flaps:[-0.5, 0, 0]
					},

					pos:[-2.5, 0.9, -1.2],
					size:[3.8, 0.05, 2.8],
					rot:[0.0, -0.1, 0],
					stallAngle:[1.2, 0.7, 0.2],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[flapStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				aeilronRight:{
					controls:{
						aeilrons:[0.5, 0, 0],
						elevator:[0.5, 0, 0]
					},

					pos:[4, 0.15, -7.2],
					size:[3, 0.1, 2.8],
					rot:[0, 0.4, 0],
					stallAngle:[0.9, 0.4, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[baseStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				aeilronLeft:{
					controls:{
						aeilrons:[-0.5, 0, 0],
						elevator:[0.5, 0, 0]
					},

					pos:[-4, 0.15, -7.2],
					size:[3, 0.1, 2.8],
					rot:[0, -0.4, 0],
					stallAngle:[0.9, 0.4, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[baseStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				break_up:{
					controls:{
						breaks:[0.8, 0, 0]
					},
					pos:[0, 0.6, -6.1],
					size:[2, 0.15, 2],
					rot:[0.0, 0, 0],
					stallAngle:[1.9, 1, 1],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				break_down:{
					controls:{
						breaks:[-0.8, 0, 0]
					},
					pos:[0, -0.6, -6.1],
					size:[2, 0.15, 2],
					rot:[0.0, 0, 0],
					stallAngle:[1.9, 1, 1],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:baseDragCoeff
				},
				rudder_r:{
					controls:{
						rudder:[-0.4, 0, 0]
					},
					pos:[1.8, 2.2, -7.9],
					size:[2.5, 0.14, 0.6],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.2, 0, 0],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[0, wingStallCoeff,  0],
					formDragCoeff:baseDragCoeff
				},
				rudder_l:{
					controls:{
						rudder:[-0.4, 0, 0]
					},
					pos:[-1.8, 2.2, -7.9],
					size:[2.5, 0.14, 0.6],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.2, 0, 0],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[0,wingStallCoeff,  0],
					formDragCoeff:baseDragCoeff
				},
				vert_stab_R:{
					pos:[1.8, 1.8, -6.7],
					size:[3.2, 0.1, 2.1],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.0, 0, 0],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[0, wingStallCoeff, 0],
					formDragCoeff:baseDragCoeff
				},
				vert_stab_L:{
					pos:[-1.8, 1.8, -6.7],
					size:[3.2, 0.1, 2.1],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.0, 0, 0],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[0, wingStallCoeff, 0],
					formDragCoeff:baseDragCoeff
				},
				/*
				 vert_skid_F:{
				 pos:[0, -1.4, 5.2],
				 size:[0.1, 0.2, 1.6],
				 rot:[0, 0, -Math.PI / 2],
				 stallAngle:[1.0, 0, 0],
				 liftCurve:curves.WINGS.stab,
				 stallLiftCoeff:[0, skidStallCoeff, 0],
				 formDragCoeff:baseDragCoeff
				 },
				 */
				vert_skid_R:{
					pos:[1.5, -0.8, -0.01],
					size:[0.1, 0.1, 1.3],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.0, 0, 0],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[0, skidStallCoeff, 0],
					formDragCoeff:baseDragCoeff
				},
				vert_skid_L:{
					pos:[-1.5, -0.8, -0.01],
					size:[0.1, 0.1, 1.3],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.0, 0, 0],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[0, skidStallCoeff, 0],
					formDragCoeff:baseDragCoeff
				},

				vert_lift:{
					pos:[0, -0.1, -0.2],
					size:[1.4, 0.1, 8],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[0.7, 0, 0],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[ 0, wingStallCoeff,0],
					formDragCoeff:baseDragCoeff
				}
			}

        }
    }
})