
"use strict";

define(['game/world/Curves'],function(curves) {
	var baseDragCoeff = 0.09;
	var baseStallCoeff = 8;
	var wingStallCoeff = 15;
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


				wing_smoke:         {value:0, controlState:0},
				reset_trim:         {value:0, controlState:0},
				debug_mechanics:    {value:0, controlState:0}
			},
			shapes:{


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
					pos:[0, -0.2, 3],
					size:[1.3, 1.3, 2.0],
					rot:[0.02, 0, 0],
					stallAngle:[0.5, 1, 1],
					liftCurve:curves.WINGS.cone,
					stallLiftCoeff:[4.5, 0, 0],
					formDragCoeff:0.02
				},

				fuselageSkid:{
					pos:[0, -1.2, 0],
					size:[0.2, 0.1, 3],
					rot:[0, 0, 0],
					stallAngle:[1.3, 0, 0],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[0, wingStallCoeff, 0],
					formDragCoeff:baseDragCoeff
				},

				vert_lift:{
					pos:[0, -0, -0.2],
					size:[2.0, 0.2, 4],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.3, 0, 0],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[0, wingStallCoeff, 0],
					formDragCoeff:baseDragCoeff
				},
				fuselageCore:{
					pos:[0, -0.3, 0],
					size:[1.5, 1.5, 1.9],
					rot:[0.0, 0, 0],
					stallAngle:[0.5, 1, 1],
					liftCurve:curves.WINGS.cone,
					stallLiftCoeff:[3.5, 0, 0],
					formDragCoeff:0.02
				},
				fuselageAft:{
					pos:[0, -0.1, -2.3],
					size:[1.5, 1.5, 1.9],
					rot:[0.03, 0, 0],
					stallAngle:[0.5, 1, 1],
					liftCurve:curves.WINGS.cone,
					stallLiftCoeff:[2.5, 0, 0],
					formDragCoeff:0.01
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
					size:[2.5, 0.2, 2.2],
					rot:[0.004, 0.55, 0],
					stallAngle:[0.5, 0.5, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.01
				},
				mainInnerLeft:{
					pos:[-1.3, 0.24, 0.41],
					size:[2.5, 0.2, 2.2],
					rot:[0.004, -0.55, 0],
					stallAngle:[0.5, 0.5, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.01
				},
				mainOuterRight:{
					pos:[5, 0.20, -0.6],
					size:[3.5, 0.15, 1.7],
					rot:[0.002, 0.49, 0],
					stallAngle:[0.65, 0.3, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.01
				},
				mainOuterLeft:{
					pos:[-5, 0.20, -0.6],
					size:[3.5, 0.15, 1.7],
					rot:[0.002, -0.49, 0],
					stallAngle:[0.65, 0.3, 0.2],
					liftCurve:curves.WINGS.wing,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.01
				},


				flapRight:{
					controls:{
						flaps:[-1.1, 0, 0]
					},

					pos:[1.6, 0.265, -0.05],
					size:[1.8, 0.2, 1.2],
					rot:[0.0, 0.2, 0],
					stallAngle:[1.5, 0.7, 0.2],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[flapStallCoeff, 0, 0],
					formDragCoeff:0.1
				},

				flapLeft:{
					controls:{
						flaps:[-1.1, 0, 0]
					},

					pos:[-1.6, 0.265, -0.05],
					size:[1.8, 0.2, 1.2],
					rot:[0.0, -0.2, 0],
					stallAngle:[1.5, 0.7, 0.2],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[flapStallCoeff, 0, 0],
					formDragCoeff:0.1
				},

				aeilronRight:{
					controls:{
						aeilrons:[0.7, 0, 0]
					},

					pos:[4, 0.15, -1.8],
					size:[3, 0.2, 0.5],
					rot:[0.0, 0.2, 0],
					stallAngle:[0.8, 0.4, 0.2],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[flapStallCoeff, 0, 0],
					formDragCoeff:0.002
				},

				aeilronLeft:{
					controls:{
						aeilrons:[-0.7, 0, 0]
					},

					pos:[-4, 0.15, -1.8],
					size:[3, 0.2, 0.5],
					rot:[-0.0, -0.2, 0],
					stallAngle:[0.8, 0.4, 0.2],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[flapStallCoeff, 0, 0],
					formDragCoeff:0.002
				},

				tailplaneR:{
					pos:[0.9, 1.1, -5.5],
					size:[2, 0.2, 0.7],
					rot:[-0.1, 0.55, 0],
					stallAngle:[1.3, 0.5, 0.4],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.01
				},

				tailplaneL:{
					pos:[-0.9, 1.1, -5.5],
					size:[2, 0.2, 0.7],
					rot:[-0.1, -0.55, 0],
					stallAngle:[1.3, 0.5, 0.4],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.01
				},
				elevator:{
					controls:{
						elevator:[0.7,0,  0]
					},
					pos:[0, 1.1, -6.3],
					size:[4.0, 0.2, 0.9],
					rot:[0.0, 0, 0],
					stallAngle:[1.5, 0.4, 0.3],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.001
				},

				rudder:{
					controls:{
						rudder:[-0.8, 0, 0]
					},
					pos:[0, 1.6, -6],
					size:[1.4, 0.2, 0.8],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.15, 0.5, 1],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[0, wingStallCoeff, 0],
					formDragCoeff:0.01
				},

				stabiliser:{
					pos:[0, 1.1, -5],
					size:[2.0, 0.2, 1.5],
					rot:[0, 0, -Math.PI / 2],
					stallAngle:[1.3, 0.4, 1],
					liftCurve:curves.WINGS.stab,
					stallLiftCoeff:[0, wingStallCoeff, 0],
					formDragCoeff:0.01
				},
				break_up:{
					controls:{
						breaks:[1.5, 0, 0]
					},
					pos:[0, -0.5, -1.1],
					size:[2, 0.2, 1],
					rot:[0.0, 0, 0],
					stallAngle:[1.9, 1, 1],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.001
				},
				break_down:{
					controls:{
						breaks:[-1.5, 0, 0]
					},
					pos:[0, -0.5, -1.1],
					size:[2, 0.2, 1],
					rot:[0.0, 0, 0],
					stallAngle:[1.9, 1, 1],
					liftCurve:curves.WINGS.rudder,
					stallLiftCoeff:[wingStallCoeff, 0, 0],
					formDragCoeff:0.001
				}
			}
		}
	}
})