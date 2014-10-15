"use strict";

define(function() {

	var main = {
		elevator:           {xMin:47, yMin:65, xMax:53, yMax:85, axis:1, max:1, min:-1, factor:0.7 ,     name:'Elevator'    ,  label:'Pitch'        },
		aeilrons:           {xMin:41, yMin:71, xMax:59, yMax:79, axis:0, max:1, min:-1, factor:1   ,     name:'Aeilrons'   	,  label:'Roll'         },
		rudder:             {xMin:42, yMin:85, xMax:58, yMax:88, axis:0, max:1, min:-1, factor:1   ,     name:'Rudder'      ,  label:'Yaw'          },
	};

	var trim = {
		trim_elevator:      {xMin:58, yMin:67, xMax:63, yMax:87, axis:1, max:0.5, min:-0.5, factor:0.3 , name:'Pitch'		,  label:'Trim' 		},
		trim_aeilrons:      {xMin:52, yMin:73, xMax:69, yMax:81, axis:0, max:0.5, min:-0.5, factor:0.3 , name:'Roll' 		,  label:'Trim'      	},
		trim_rudder:        {xMin:55, yMin:87, xMax:66, yMax:90, axis:0, max:0.5, min:-0.5, factor:0.3 , name:'Yaw'  		,  label:'Trim'       	}
	};
	var flight = {
		throttle:           {xMin:27, yMin:62, xMax:33, yMax:73, axis:1, max:1, min:0,  factor:1   ,     name:'Engines'  	,  label:'Throttle'     },
		flaps:              {xMin:21, yMin:62, xMax:26, yMax:73, axis:1, max:1, min:0,  factor:1   ,     name:'Flaps'     	,  label:'Angle'        },
		breaks:             {xMin:15, yMin:62, xMax:20, yMax:73, axis:1, max:1, min:0,  factor:1   ,     name:'Brake'     	,  label:'State'      	},
	};

	var landing = {
		gears:              {xMin:18, yMin:52, xMax:23, yMax:63, axis:1, max:1, min:0,  factor:80  ,     name:'Gear'      	,  label:'State'        },
		canopy:             {xMin:12, yMin:52, xMax:17, yMax:63, axis:1, max:1, min:0, factor:80  ,     name:'Canopy'      	,  label:'State'        }
	};

	var TunnanOnScreenInput = function() {
		this.data = [
			{
				closed:{xMin:41, yMin:92, xMax:52, yMax:96, name:'Steering'},
				active:{xMin:39, yMin:60, xMax:61, yMax:96, name:'Steering'},
				name:'Steering',
				controls:main

			},
			{
				closed:{xMin:57, yMin:91, xMax:65, yMax:95, name:'Trim'},
				active:{xMin:50, yMin:62, xMax:72, yMax:95, name:'Trim'},
				name:'Trim',
				controls:trim
			},

			{
				closed:{xMin:26, yMin:74,  xMax:33,  yMax:78, name:'Flight'},
				active:{xMin:5,  yMin:59,  xMax:34,  yMax:79, name:'Flight'},
				name:'Flight',
				controls:flight
			},

			{
				closed:{xMin:16, yMin:64,  xMax:23,  yMax:68, name:'Landing'},
				active:{xMin:5,  yMin:49,  xMax:24,  yMax:69, name:'Landing'},
				name:'Landing',
				controls:landing
			}
		]
	};

	return TunnanOnScreenInput
});