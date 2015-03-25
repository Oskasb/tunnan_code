"use strict";

define(function() {

    var ZONE_ID_LIST = {
        big_1_1:"big_1_1",
        big_2_1:"big_2_1",
        ocean:"Open Ocean",
		carrier_takeoff:"Ocean Takeoff",
        start:"Runway Island",
        cove:"Cove",
        peak:"Peak Island"
    };

    return {
        ZONE_ID_LIST:ZONE_ID_LIST,

        FREEFLIGHT_ZONES: {
            ocean:{
                id:ZONE_ID_LIST.ocean,
                width:15000,
                depth: 15000,
                height: 800,
                pos:[0, 0, 0],
                clouds:{intensity:1},
                playerSpawn:{
                    plane:{
                        pos:[-1342, 620, 3280],
                        vel:[0.0, 0.0001, -1.0],
                        rot:[0, Math.PI*0.+9, 0],
                        state:0
                    },
                    human:{
                        pos:[-1000, 25.75, 0],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }
                }
            },
			carrier_takeoff:{
				id:ZONE_ID_LIST.carrier_takeoff,
				width:15000,
				depth: 15000,
				height: 800,
				pos:[0, 0, 0],
				clouds:{intensity:1},
				playerSpawn:{
					plane:{
						pos:[-200, 29, 500],
						vel:[0.0, 0.0001, 0.08],
						rot:[0, 0, 0],
						state:1
					},
					human:{
						pos:[-200, 31, 500],
						vel:[0.0, 0.0, 0.001],
						rot:[0, 0, 0],
						state:1
					},
					carrier:{
						pos:[-100, 0, 300],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					}
				}
			}
        },

        TERRAIN_ZONES: {
            big_1_1:{
                id:ZONE_ID_LIST.big_1_1,
                width:5000,
                depth: 5000,
                height: 4000,
                pos:[5000, -1000, 5500],
                heightData:'resources/heightmap/hf_large.png',
                texture1:'resources/heightmap/tx_large.jpg',
                tree_spread:1400,
                clouds:{intensity:0},
                playerSpawn:{
                    plane:{
                        pos:[2885, 218.2, 2652],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    },
                    human:{
                        pos:[2840, 218.5, 2528],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    },
                    car:{
                        pos:[2868, 218.2, 2372],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }
                }
            },

            big_2_1:{
                id:ZONE_ID_LIST.big_2_1,
                width:25000,
                depth: 25000,
                height: 4000,
                pos:[0, -300, -17500],
                heightData:'resources/heightmap/hf_large.png',
                texture1:'resources/heightmap/tx_large.png',
                tree_spread:3400,
                clouds:{intensity:0},
                playerSpawn:{
                    plane:{
                        pos:[2885, 218.2, 2652],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    },
                    human:{
                        pos:[2840, 218.5, 2528],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    },
                    car:{
                        pos:[2868, 218.2, 2372],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }
                }
            },

            start:{
                id:ZONE_ID_LIST.start,
                width:5000,
                depth: 5000,
                height: 890,
                pos:[0, -200, 0],
                heightData:window.resourcePath+'/heightmap/128_hf.png',
                texture1:window.resourcePath+'/heightmap/tx_start.png',
                tree_spread:600,
                clouds:{intensity:0},
                playerSpawn:{
					plane:{
						pos:[-3200, 29, 3500],
						vel:[0.0, 0.0001, 0.08],
						rot:[0, 0, 0],
						state:1
					},
					human:{
						pos:[-3200, 31, 3500],
						vel:[0.0, 0.0, 0.001],
						rot:[0, 0, 0],
						state:1
					},
					carrier:{
						pos:[-3100, 0, 3300],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					}
                }
            },
            cove:{
                id:ZONE_ID_LIST.cove,
                width:5000,
                depth: 5000,
                height: 650,
                pos:[-7500, -137, 500],

                heightData:'tunnan_resources/heightmap/hf_cove.png',
                texture1:'tunnan_resources/heightmap/tx_cove.png',

                tree_spread:750,
                clouds:{intensity:0},
                playerSpawn:{
                    plane:{
                        pos:[2885, 218.2, 2652],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    },
                    human:{
                        pos:[2840, 218.5, 2528],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    },
                    car:{
                        pos:[2868, 218.2, 2372],
                        vel:[0.0, 0.0, 0.001],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }
                }
            },
            peak:{
                id:ZONE_ID_LIST.peak,
                width:5000,
                depth: 5000,
                height: 950,
                pos:[-5128, -350, -5128],
                heightData:'resources/heightmap/hf_small.png',
                texture1:'resources/heightmap/tx_small.png',
                tree_spread:650,
                clouds:{intensity:0.3}
            }
        },

        SPAWN_POINTS: {
            pilot_runway:{
                humans:{
                    PILOT:[{
                        pos:[2824, 218.2, 2370],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*0.5, 0]
                    }]
                }
            },
            air_patrol:{
                planes:{
                    B52:[{
                        pos:[3700, 5000, 4300],
                        vel:[1.04, 0, -0.51],
                        rot:[0, 0, 0],
                        state:2
                    }]
                }
            },
            battleship_assault:{
                boats:{
                    BATTLESHIP:[{
                        pos:[5700, 0, 1300],
                        vel:[-0.02, 0, -0.08],
                        rot:[0, 0, 0]
                    },{
                        pos:[6700, 0, 4300],
                        vel:[-0.02, 0, -0.08],
                        rot:[0, 0, 0]
                    }],
                    TRE_KRONOR:[{
                        pos:[4811, 0, 3235],
                        vel:[-0.07, 0, 0.10],
                        rot:[0, 0, 0]
                    },{
                        pos:[6811, 0, -1235],
                        vel:[-0.07, 0, 0.10],
                        rot:[0, 0, 0]
                    },{
                        pos:[8811, 0, 5235],
                        vel:[-0.07, 0, 0.10],
                        rot:[0, 0, 0]
                    }]
                }
            },
			carrier_takeoff:{
				boats:{

/*
					BATTLESHIP_NEVADA:[{
						pos:[600, 0, 790],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					}],
*/
					TRE_KRONOR:[{
						pos:[1200, 0, -710],
						vel:[0, 0, 0.08],
						rot:[0,0, 0]
					}]
						/*
					,{
						pos:[4300, 0, -2900],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					},{
						pos:[-2300, 0, 1900],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					},{
						pos:[-12300, 0, 12900],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					},{
						pos:[7300, 0, 13900],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					},{
						pos:[-14300, 0, -11900],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					},{
						pos:[11300, 0, -11900],
						vel:[0, 0, 0.08],
						rot:[0, 0, 0]
					}
						*/

				}
			},
            carrier:{
                boats:{

                    CARRIER:[{
                        pos:[4850, 0, 2700],
                        vel:[-0.0, 0, 0.08],
                        rot:[0, 0, 0]
                    }]
                }
            },
            ocean:{
                boats:{
                    CARRIER:[{
                        pos:[-1000, 0, 0],
                        vel:[-0.0, 0, 0.08],
                        rot:[0, 0, 0]
                    }]
                }
                /*
                planes:{
                    TUNNAN:[{
                        pos:[-4000, 1215.75, 0],
                        vel:[0.0, 0.000001, 1.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    }]
                }
                */
            },
            cougar:{
                planes:{
                    COUGAR:[{
                        pos:[2855, 218.2, 2390],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }]
                }
            },
            draken:{
                planes:{
                    DRAKEN:[{
                        pos:[2855, 218.2, 2390],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }]
                }
            },
            tunnan:{
                planes:{
                    TUNNAN:[{
                        pos:[2870, 215.75, 2515],
                        vel:[0.0, 0.000001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    }]
                }
            },
            tomcat:{
                planes:{
                    TOMCAT:[ {
                        pos:[2840, 215.75, 2445],
                        vel:[0.0, 0.000001, 0.0],
                        rot:[0, Math.PI*0.7, 0],
                        state:1
                    }]
                }
            },

            air_base:{

                targets:{
                    /*
                    TV_CRT:[{
                        pos:[2847, 220, 2531],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 3.3, 0],
                        state:1
                    },{
                        pos:[2843, 220, 2531],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 3.1, 0],
                        state:1
                    },{
                        pos:[2839, 220, 2531],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 2.8, 0],
                        state:1
                    }],
                    */
                     MONITOR_CONSOLE:[{
                        pos:[2826.5, 214, 2534],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 3.14, 0],
                        state:1
                    },{
                         pos:[2835.5, 214, 2534],
                         vel:[0.0, 0.0001, 0.0],
                         rot:[0, 3.14, 0],
                         state:1
                     },{
                         pos:[2844.5, 214, 2534],
                         vel:[0.0, 0.0001, 0.0],
                         rot:[0, 3.14, 0],
                         state:1
                     },{
                         pos:[2836, 214, 2506.5],
                         vel:[0.0, 0.0001, 0.0],
                         rot:[0, 0, 0],
                         state:1
                     }]
                     /*
                    ,{
                        pos:[2847, 215.5, 2532],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 3.4, 0],
                        state:1
                    },{
                        pos:[2843, 213, 2533],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 3.1, 0],
                        state:1
                    }],
                    TV_CRT_3:[{
                        pos:[2843, 215.5, 2533],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 3.1, 0],
                        state:1
                    },{
                        pos:[2839, 213, 2532],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 2.8, 0],
                        state:1
                    },{
                        pos:[2839, 215.5, 2532],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, 2.8, 0],
                        state:1
                    }

                    ]
    */
                }
            },

            practice_range:{
                targets:{

                    GROUND_FLAT:[{
                        pos:[1250, 339.5, 1185],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1340, 339.5, 1185],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1250, 339.5, 1255],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1340, 339.5, 1255],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1020, 339.5, 1315],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1420, 339.5, 1395],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1020, 339.5, 1415],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1420, 339.5, 1495],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1020, 339.5, 1515],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1420, 339.5, 1595],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1120, 339.5, 1315],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1320, 339.5, 1395],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1120, 339.5, 1415],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1320, 339.5, 1495],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1120, 339.5, 1515],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    },{
                        pos:[1320, 339.5, 1595],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI, 0],
                        state:1
                    }
                    ] ,
                    HOUSE_BOX_30:[{
                        pos:[1260, 339.5, 3330],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.1, 0],
                        state:1
                    },{
                        pos:[1350, 339.5, 3410],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.2, 0],
                        state:1
                    },{
                        pos:[1250, 339.5, 3510],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.1, 0],
                        state:1
                    },{
                        pos:[1135, 339.5, 3505],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.1, 0],
                        state:1
                    },{
                        pos:[1170, 339.5, 3400],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.2, 0],
                        state:1
                    },{
                        pos:[1040, 339.5, 3480],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.02, 0],
                        state:1
                    },{
                        pos:[1025, 339.5, 3585],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.1, 0],
                        state:1
                    },{
                        pos:[950, 339.5, 3445],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.03, 0],
                        state:1
                    },{
                        pos:[925, 339.5, 3545],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*1.06, 0],
                        state:1
                    }]
                }
            },

            start:{
                planes:{

                    COUGAR:[{
                        pos:[2865, 218.2, 2410],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }],
                    DRAKEN:[{
                        pos:[2868, 218.2, 2466],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*0.5, 0],
                        state:1
                    }]
                },
                cars:{
                    PV_9031:[{
                        pos:[2832, 218.2, 2370],
                        vel:[0.0, 0.0001, 0.0],
                        rot:[0, Math.PI*0.5, 0]
                    }]
                }
            }
        }

    } });