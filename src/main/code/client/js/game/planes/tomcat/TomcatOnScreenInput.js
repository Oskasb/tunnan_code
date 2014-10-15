"use strict";

define(function() {

	var monitor = {
	//	throttle:           {xMin:31, yMin:84, xMax:34, yMax:95, axis:1, max:1, min:0,  factor:1   ,     name:'THR'  	,  label:''        },
	//	flaps:              {xMin:26, yMin:89, xMax:28, yMax:94, axis:1, max:1, min:0,  factor:1   ,     name:'FLP'     ,  label:''        },
	//	breaks:             {xMin:22, yMin:89, xMax:24, yMax:94, axis:1, max:1, min:0,  factor:1   ,     name:'BRK'    	,  label:''        },

		elevator:           {xMin:72, yMin:85, xMax:76, yMax:95, axis:1, max:1, min:-1, factor:0.7 ,     name:'Steer'   ,  label:''        },
		aeilrons:           {xMin:69, yMin:88, xMax:79, yMax:92, axis:0, max:1, min:-1, factor:1   ,     name:''   		,  label:''         },
		rudder:             {xMin:71, yMin:95, xMax:77, yMax:97, axis:0, max:1, min:-1, factor:1   ,     name:''    	,  label:''         },

		trim_elevator:      {xMin:83, yMin:87, xMax:85, yMax:95, axis:1, max:0.5, min:-0.5, factor:0.3 , name:'Trim'	,  label:'' 		},
		trim_aeilrons:      {xMin:80, yMin:90, xMax:88, yMax:92, axis:0, max:0.5, min:-0.5, factor:0.3 , name:'' 		,  label:''      	},
		trim_rudder:        {xMin:81, yMin:95, xMax:87, yMax:96, axis:0, max:0.5, min:-0.5, factor:0.3 , name:''  		,  label:''       	},

	//	cannons:            {xMin:63, yMin:96, xMax:67, yMax:98, axis:2, max:1, min:0, factor:100 		, name:'Gun'  	,  label:'space'     },
	//	canopy:             {xMin:6,  yMin:92, xMax:10, yMax:94, axis:2, max:1, min:0, factor:100 		, name:'Canopy'	,  label:'C'         },
	//	gears:              {xMin:6,  yMin:86, xMax:10, yMax:88, axis:2, max:1, min:0, factor:100 		, name:'Gear'	,  label:'G'         }
	};

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
	         // {xMin:5,  yMin:62,  xMax:32,  yMax:79}
	var flight = {
		throttle:           {xMin:27, yMin:62, xMax:33, yMax:70, axis:1, max:1, min:0,  factor:1   ,     name:'Engines'  	,  label:'Throttle'     },
		flaps:              {xMin:21, yMin:62, xMax:26, yMax:72, axis:1, max:1, min:0,  factor:1   ,     name:'Flaps'     	,  label:'Angle'        },
		breaks:             {xMin:15, yMin:62, xMax:20, yMax:72, axis:1, max:1, min:0,  factor:1   ,     name:'Brake'     	,  label:'State'      	},
		wing_sweep:         {xMin:7,  yMin:65, xMax:14, yMax:71, axis:1, max:1, min:0,  factor:1   ,     name:'Wing'		,  label:'Sweep'  		},
		wing_smoke:         {xMin:29, yMin:76, xMax:33, yMax:78, axis:2, max:1, min:0,  factor:100 ,     name:'Smoke'		,  label:'' 	  		},
		debug_mechanics:    {xMin:6,  yMin:76, xMax:10, yMax:78, axis:2, max:1, min:0,  factor:1  ,      name:'Debug'		,  label:'' 	  		}
	};

	var landing = {
		gears:              {xMin:18, yMin:52, xMax:23, yMax:63, axis:2, max:1, min:0,  factor:80  ,     name:'Gear'      	,  label:'State'        },
		hook:               {xMin:12, yMin:52, xMax:17, yMax:63, axis:2, max:0, min:-1, factor:80  ,     name:'Hook'      	,  label:'State'        },
		canopy:             {xMin:7,  yMin:55, xMax:11, yMax:66, axis:2, max:1, min:0,  factor:80  ,     name:'Canopy'    	,  label:'State'       	}
	};
	 //xMin:70,  yMin:49,  xMax:90,  yMax:69
	var lights = {
		formation_lights:   {xMin:90, yMin:68, xMax:93, yMax:73, axis:1, max:1, min:0.1,factor:1   ,     name:'Form'      	,  label:'Light'        },
		formation_mode:     {xMin:90, yMin:62, xMax:93, yMax:65, axis:0, max:1, min:-1, factor:1   ,     name:'Mode'      	,  label:''         	},
		position_lights:    {xMin:85, yMin:68, xMax:88, yMax:73, axis:1, max:1, min:0.1,factor:1   ,     name:'Pos'       	,  label:'Light'        },
		position_mode:      {xMin:85, yMin:62, xMax:88, yMax:65, axis:0, max:1, min:-1, factor:1   ,     name:'Mode'      	,  label:''         	},
		collision_lights:   {xMin:80, yMin:68, xMax:83, yMax:73, axis:1, max:1, min:0.1,factor:1   ,     name:'Coll'      	,  label:'Light'        },
		collision_mode:     {xMin:80, yMin:62, xMax:83, yMax:65, axis:0, max:1, min:-1, factor:1   ,     name:'Mode'      	,  label:''        	 	},
		taxi_lights:        {xMin:75, yMin:68, xMax:78, yMax:73, axis:1, max:1, min:0.1,factor:1   ,     name:'Taxi'      	,  label:'Light'        },
		taxi_mode:          {xMin:75, yMin:62, xMax:78, yMax:65, axis:0, max:1, min:-1, factor:1   ,     name:'Mode'     	,  label:''      	   	}
	};
	             // xMin:77,  yMin:34,  xMax:94,  yMax:55
	var cockpit = {
		screen_intensity:   {xMin:86, yMin:38, xMax:90, yMax:50, axis:1, max:0.9, min:0,factor:1   ,     name:'Master'   	,  label:'Brt'    		},
		hud_intensity:      {xMin:82, yMin:40, xMax:85, yMax:50, axis:1, max:0.9, min:0,factor:1 ,     name:'Hud'       	,  label:'Brt'   		},
		hdd_intensity:      {xMin:78, yMin:40, xMax:81, yMax:50, axis:1, max:0.9, min:0,factor:1   ,     name:'HDD'       	,  label:'Brt'          },
		cockpit_lights:     {xMin:91, yMin:42, xMax:94, yMax:50, axis:1, max:1,   min:0,factor:1   ,     name:'Inst'      	,  label:'Light'        },
		cockpit_mode:       {xMin:91, yMin:37, xMax:94, yMax:40, axis:0, max:1,   min:-1, factor:1   ,     name:'Mode'      	,  label:''         	}
	};


	var TomcatOnScreenInput = function() {
		this.guiMainStateId = "tomcat_controls";
		this.widgets = [{
			controls:monitor
			}
		];
		this.menus = [
			{
				closed:{name:'Steering', xMin:41, yMin:92, xMax:49, yMax:96},
				active:{name:'Steering', xMin:39, yMin:62, xMax:61, yMax:95},
				controls:main
			},
			{
				closed:{name:'Trim', xMin:57, yMin:91, xMax:65, yMax:95},
				active:{name:'Trim', xMin:50, yMin:62, xMax:72, yMax:95},
				controls:trim
			},

			{
			 	closed:{name:'Flight', xMin:14, yMin:74,  xMax:21,  yMax:78},
				active:{name:'Flight', xMin:5,  yMin:59,  xMax:34,  yMax:79},
				controls:flight
			},

			{
			 	closed:{name:'Landing', xMin:13, yMin:64,  xMax:21,  yMax:68},
				active:{name:'Landing', xMin:5,  yMin:49,  xMax:24,  yMax:69},
				controls:landing
			},

			{
			 	closed:{name:'Lights', xMin:82, yMin:55,  xMax:90,  yMax:59},
		   		active:{name:'Lights', xMin:73,  yMin:54,  xMax:95,  yMax:75},
				controls:lights
			},
			{
				closed:{name:'Cockpit',xMin:82, yMin:50,  xMax:91,  yMax:54},
				active:{name:'Cockpit',xMin:76,  yMin:34,  xMax:96,  yMax:55},
				controls:cockpit
			}
		]
	};

    return TomcatOnScreenInput
});