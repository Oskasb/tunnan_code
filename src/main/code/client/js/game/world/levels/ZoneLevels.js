"use strict";

define(['game/GameConfiguration', 'game/world/ZoneData'],function(gameConfig, ZoneData) {
    var ZONES = {
        start:{
            zoneId:ZoneData.ZONE_ID_LIST.start,
            gooProjects:[
		/*
                gameConfig.GOO_PROJECTS.harbor,
                gameConfig.GOO_PROJECTS.top_base,
                gameConfig.GOO_PROJECTS.elevator,
                gameConfig.GOO_PROJECTS.hilltop_base,
                gameConfig.GOO_PROJECTS.air_base,
                gameConfig.GOO_PROJECTS.houses
		*/
            ],
            buildings:[
			/*
                {
                    model:gameConfig.GOO_PROJECTS.harbor.base,
                    entries:[
                        {pos:[3605, 13.7, 4615], rot:[0, 1.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.top_base.base,
                    entries:[
                        {pos:[3014, 381, 3605], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.top_base.roof,
                    entries:[
                        {pos:[3014, 381, 3605], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.elevator.base,
                    entries:[
                        {pos:[3839, 84, 858], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.elevator.roof,
                    entries:[
                        {pos:[3839, 84, 858], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {

                    model:gameConfig.GOO_PROJECTS.hilltop_base.base,
                    entries:[
                        {pos:[3753, 293, 1515], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.hilltop_base.roof,
                    entries:[
                        {pos:[3753, 293, 1515], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.hilltop_base.lamps,
                    entries:[
                        {pos:[3753, 293, 1515], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.hilltop_base.lamps_inner,
                    entries:[
                        {pos:[3753, 293, 1515], rot:[0, 2.5*3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.air_base.base,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.air_base.roof,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]},
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.air_base.lamps,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]},
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.air_base.lockers,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]},
                    ]
                },
                /*
                {
                    model:gameConfig.GOO_PROJECTS.house_t.house_t,
                    entries:[
                        {pos:[2848, 218.2, 2272], rot:[0, 0, 0]},
                    //    {pos:[2818, 218.2, 2242], rot:[0, 1.68, 0]},
                    //    {pos:[2878, 218.2, 2162], rot:[0, 3.14, 0]},
                    //    {pos:[2948, 218.2, 2172], rot:[0, 0, 0]},
                    //    {pos:[2918, 218.2, 2142], rot:[0, 1.68, 0]}
                    ]
                },

                {
                    model:gameConfig.GOO_PROJECTS.houses.air_tower,
                    entries:[
                        {pos:[3248, 218.2, 2572], rot:[0, 0, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.houses.cube_22,
                    entries:[
                        {pos:[3248, 218.2, 2172], rot:[0, 0, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.houses.ten_floors,
                    entries:[
                        {pos:[2548, 218.2, 2572], rot:[0, 0, 0]},
                        {pos:[2506, 218.2, 2667], rot:[0, 0, 0]},
                        {pos:[2686, 218.2, 2707], rot:[0, 0, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.houses.seventeen_floor,
                    entries:[
                        {pos:[3048, 218.2, 2672], rot:[0, 0, 0]},
                        {pos:[3000, 218.2, 2667], rot:[0, 0, 0]},
                        {pos:[3086, 218.2, 2707], rot:[0, 0, 0]}
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.houses.seventeen_big_floors,
                    entries:[
                        {pos:[2748, 218.2, 2572], rot:[0, 0, 0]},
                        {pos:[2706, 218.2, 2667], rot:[0, 0, 0]},
                        {pos:[2786, 218.2, 2707], rot:[0, 0, 0]}
                    ]
                },
                 */

			/*
                {
                    model:gameConfig.GOO_PROJECTS.houses.hangar_building,
                    entries:[

                        {pos:[3040, 218.2, 2515], rot:[0, 0, 0]},
                        {pos:[3100, 218.2, 2515], rot:[0, 0, 0]}
                    ]
                }

			*/

            ]
        },
        cove:{
            zoneId:ZoneData.ZONE_ID_LIST.cove,
            gooProjects:[
                gameConfig.GOO_PROJECTS.harbor,
                gameConfig.GOO_PROJECTS.top_base,
                gameConfig.GOO_PROJECTS.elevator,
                gameConfig.GOO_PROJECTS.hilltop_base,
                gameConfig.GOO_PROJECTS.air_base,
                gameConfig.GOO_PROJECTS.houses
            ],
            buildings:[
                {
                    model:gameConfig.GOO_PROJECTS.air_base.base,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]},
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.air_base.roof,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]},
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.air_base.lamps,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]},
                    ]
                }, {
                    model:gameConfig.GOO_PROJECTS.air_base.lockers,
                    entries:[
                        {pos:[2791, 218.2, 2515], rot:[0, 3.14, 0]},
                    ]
                }
            ]
        }
    };
    return {
        ZONES:ZONES
    }
});