"use strict";

define(["game/GameConfiguration", "game/ModelDefinitions", "game/weapons/WeaponData", 'game/ships/CarrierCable'], function(gameConfig, modelDefinitions, weaponData, CarrierCable) {

    return {
        CARRIER:{
            gooProject:gameConfig.GOO_PROJECTS.carrier,
            piecePath:gameConfig.GOO_PROJECTS.carrier.entityIds.carrier,
            hitPoints:235000,
            dimensions: {
                pilotSeatPos:[23, 41.5, 44],
                length:310,
                wingspan:280
            },
            parkingLots:{
                launch:{posOffset:[18.2, 20.5, -48], rot:[0, -3.101, 0]},
                service:{posOffset:[31, 19, 90], rot:[0, -2, 0]}
            },
            uiPages:["UI_CARRIER"],
            keyBindings:gameConfig.KEY_BINDINGS.plane,
            physicalShapes:[
                {partId:"cable",    posOffset:[4,  13, 125],    radius:14, cableNr:1},
                {partId:"cable",    posOffset:[0,  13, 100 ],   radius:14, cableNr:2},
                {partId:"cable",    posOffset:[-2, 13, 75],     radius:14, cableNr:3},
                {partId:"cable",    posOffset:[-6, 13, 50],     radius:14, cableNr:4},
                {partId:"hull",     posOffset:[0, 2, 0],        radius:14},
                {partId:"hull",     posOffset:[0, 2, -62 ],     radius:14},
                {partId:"hull",     posOffset:[0, 2, -125],     radius:14},
                {partId:"hull",     posOffset:[0, 2, -158],     radius:14},
                {partId:"hull",     posOffset:[0, 2, 51],       radius:14},
                {partId:"hull",     posOffset:[0, 2, 118],      radius:14},
                {partId:"hull",     posOffset:[0, 2, 172],      radius:14},
              {partId:"bridge",     posOffset:[0, 45, -14],     radius:14},
               {partId:"bridge",    posOffset:[0, 45, 29],      radius:14}
            ],
            physicalRadius:220,
            chimneys:[],
            wakes:[
				{posOffset:[0, 0, -160], 		spread:0.001},
				{posOffset:[-0, 0, 170], 		spread:0.5},
				{posOffset:[-11, 0, 155], 		spread:0.2},
				{posOffset:[3, -0, -145.7], 	spread:0.07},
				{posOffset:[-3, -0, -145.7], 	spread:0.07},
				{posOffset:[-7, 0, -135.7], 	spread:0.18},
				{posOffset:[7, 0, -135.7], 		spread:0.18},
				{posOffset:[11, 0, 155], 		spread:0.2}
			],
            radars:[],
            flags:[],
            turrets:[],
            instruments: {},
            measurements: {},
            systems:{}
        },
        BATTLESHIP:{
            gooProject:gameConfig.GOO_PROJECTS.battleship,
            piecePath:gameConfig.GOO_PROJECTS.battleship.battleship,
            hitPoints:225000,
            physicalShapes:[
                {partId:"hull", posOffset:[0, 0, 0], radius:30},
                {partId:"hull", posOffset:[0, 0, -62 ], radius:26},
                {partId:"hull", posOffset:[0, 0, -125], radius:16},
                {partId:"hull", posOffset:[0, 5, -158], radius:10},
                {partId:"hull", posOffset:[0, 0, 51], radius:20},
                {partId:"hull", posOffset:[0, 0, 118], radius:20},
                {partId:"hull", posOffset:[0, 3, 172], radius:30},
                {partId:"bridge", posOffset:[0, 45, -14], radius:14},
                {partId:"bridge", posOffset:[0, 45, 29], radius:11}
            ],
            physicalRadius:180,
            chimneys:[{posOffset:[0, 60, 2]}, {posOffset:[15, 45, 12]}, {posOffset:[-15, 45, 12]}],
            wakes:[{posOffset:[0, 0, -180], spread:0.001}, {posOffset:[0, 0, -138.8], spread:0.21}, {posOffset:[7, -1, -171.7], spread:0.07}, {posOffset:[-7, -1, -171.7], spread:0.07},{posOffset:[-12, 0, -115.7], spread:0.18}, {posOffset:[12, 0, -115.7], spread:0.18}],
            radars:[],
            flags:[],
            turrets:[
                {targets:["boat"], bonePivot:"gun_main_1", boneElevate:"main_elev_1", bulletData:weaponData.BULLET_MAIN, cannonData:weaponData.MAIN_GUNS.main_gun_16, baseRot:Math.PI       ,speed:0.2 ,swivel:2.4,     posOffset:[0.01,   25.6,   -96.34   ]},
                {targets:["boat"], bonePivot:"gun_main_2", boneElevate:"main_elev_2", bulletData:weaponData.BULLET_MAIN, cannonData:weaponData.MAIN_GUNS.main_gun_16, baseRot:Math.PI       ,speed:0.2 ,swivel:2.4,     posOffset:[0.01,   35.6,   -65.74   ]},
                {targets:["boat"], bonePivot:"gun_main_3", boneElevate:"main_elev_3", bulletData:weaponData.BULLET_MAIN, cannonData:weaponData.MAIN_GUNS.main_gun_16, baseRot:0             ,speed:0.2 ,swivel:2.4,     posOffset:[0.01,   25.6 ,   73.54   ]},
                {targets:["boat"], bonePivot:"gun_main_4", boneElevate:"main_elev_4", bulletData:weaponData.BULLET_MAIN, cannonData:weaponData.MAIN_GUNS.main_gun_16, baseRot:0             ,speed:0.2 ,swivel:2.4,     posOffset:[0.01,   18.6  ,  109.54  ]},
                {targets:["plane"],bonePivot:"gun_port_1", boneElevate:"port_elev_1", bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:-0.5*Math.PI  ,speed:0.6 ,swivel:1.6,   posOffset:[-26.94 , 23.9 ,   -52.04  ]},
                {targets:["plane"],bonePivot:"gun_port_2", boneElevate:"port_elev_2", bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:-0.5*Math.PI  ,speed:0.6 ,swivel:1.6,   posOffset:[-29.64 , 23.9,    -7.34   ]},
                {targets:["plane"],bonePivot:"gun_port_3", boneElevate:"port_elev_3", bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:-0.5*Math.PI  ,speed:0.6 ,swivel:1.6,   posOffset:[-29.64 , 17.3  ,  34.84   ]},
                {targets:["plane"],bonePivot:"gun_port_4", boneElevate:"port_elev_4", bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:-0.5*Math.PI  ,speed:0.6 ,swivel:1.6,   posOffset:[-27.04 , 17.2  ,  74.04   ]},
                {targets:["plane"],bonePivot:"gun_sb_1",   boneElevate:"sb_elev_1",   bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:0.5*Math.PI   ,speed:0.6 ,swivel:1.6,   posOffset:[26.94, 23.9 ,   -52.04  ]},
                {targets:["plane"],bonePivot:"gun_sb_2",   boneElevate:"sb_elev_2",   bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:0.5*Math.PI   ,speed:0.6 ,swivel:1.6,   posOffset:[29.64, 23.9,    -7.34   ]},
                {targets:["plane"],bonePivot:"gun_sb_3",   boneElevate:"sb_elev_3",   bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:0.5*Math.PI   ,speed:0.6 ,swivel:1.6,   posOffset:[29.64, 17.3  ,  34.84   ]},
                {targets:["plane"],bonePivot:"gun_sb_4",   boneElevate:"sb_elev_4",   bulletData:weaponData.BULLET_AAA, cannonData:weaponData.AAA.midship_80,        baseRot:0.5*Math.PI   ,speed:0.6 ,swivel:1.6,   posOffset:[27.04, 17.2  ,  74.04   ]}
            ]
        },
        TRE_KRONOR:{
            gooProject:gameConfig.GOO_PROJECTS.tre_kronor,
            piecePath:gameConfig.GOO_PROJECTS.tre_kronor.tre_kronor,
            hitPoints:82000,
            physicalShapes:[

                {partId:"hull", posOffset:[0, 5,   -88], radius:6},
                {partId:"hull", posOffset:[0, 1.5, -74], radius:8},
                {partId:"hull", posOffset:[0, 1,  -60 ], radius:8},
                {partId:"hull", posOffset:[0, 0.5, -42], radius:8},
                {partId:"hull", posOffset:[0, 0.5, -29], radius:8},
                {partId:"hull", posOffset:[0, 0.5, -15], radius:8},
                {partId:"hull", posOffset:[0, 0.5,   0], radius:8},
                {partId:"hull", posOffset:[0, 0.5,  15], radius:8},
                {partId:"hull", posOffset:[0, 0.5,  29], radius:8},
                {partId:"hull", posOffset:[0, -0.5, 42], radius:8},
                {partId:"hull", posOffset:[0, -0.5, 56], radius:8},
                {partId:"hull", posOffset:[0, -0.5, 71], radius:8},
                {partId:"hull", posOffset:[0, -0.5, 86], radius:6},
                {partId:"bridge", posOffset:[0, 13, -31],radius:7},
                {partId:"bridge", posOffset:[0, 9, -8], radius:11}
            ],
            physicalRadius:200,
            wakes:[{posOffset:[0, -1, -86.7], spread:0.001}, {posOffset:[2, -5, -81.7], spread:0.03}, {posOffset:[-2, -5, -81.7], spread:0.03}, {posOffset:[0, -3, -91.8], spread:0.001}],
            chimneys:[{posOffset:[0, 16, -15]}, {posOffset:[0, 15, 3]}],
            radars:[{bonePivot:"radar", rotVel:0.06}, {bonePivot:"parabolic_antenna", rotVel:-0.02}],
            flags:[{baseBone:"flag_base", flapBone:"flag_flap", flapFreq:1.3}],
            turrets:[
                {targets:["boat"], bonePivot:"main_gun_fore", boneElevate:"main_fore_elev",  bulletData:weaponData.BULLET_MAIN, cannonData:weaponData.MAIN_GUNS.main_gun_16, baseRot:Math.PI       ,speed:0.2 ,swivel:2.4,     posOffset:[0,   8.3,   -46.74   ]},
                {targets:["boat"], bonePivot:"main_gun_aft_1",boneElevate:"main_aft_elev_1", bulletData:weaponData.BULLET_MAIN, cannonData:weaponData.MAIN_GUNS.main_gun_16, baseRot:0             ,speed:0.2 ,swivel:2.4,     posOffset:[0,   9.1 ,  45.54   ]},
                {targets:["boat"], bonePivot:"main_gun_aft_2",boneElevate:"main_aft_elev_2", bulletData:weaponData.BULLET_MAIN, cannonData:weaponData.MAIN_GUNS.main_gun_16, baseRot:0             ,speed:0.2 ,swivel:2.4,     posOffset:[0,   12.0  ,  22.1  ]},
                {targets:["plane"],bonePivot:"port_gun_1",    boneElevate:"port_elev_1",     bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:-0.5*Math.PI  ,speed:0.6 ,swivel:1.6,   posOffset:[-5.5 , 7.2 ,   -26.6  ]},
                {targets:["plane"],bonePivot:"port_gun_2",    boneElevate:"port_elev_2",     bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:-0.5*Math.PI  ,speed:0.6 ,swivel:1.6,   posOffset:[-5.5 , 7.2,    -8.4   ]},
                {targets:["plane"],bonePivot:"port_gun_3",    boneElevate:"port_elev_3",     bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:-0.5*Math.PI  ,speed:0.6 ,swivel:1.6,   posOffset:[-5.5 , 17.3  ,  10.14   ]},
                {targets:["plane"],bonePivot:"sb_gun_1",      boneElevate:"sb_elev_1",       bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:0.5*Math.PI   ,speed:0.6 ,swivel:1.6,   posOffset:[5.5, 7.2 ,   -26.6  ]},
                {targets:["plane"],bonePivot:"sb_gun_2",      boneElevate:"sb_elev_2",       bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:0.5*Math.PI   ,speed:0.6 ,swivel:1.6,   posOffset:[5.5, 7.2,    -8.4   ]},
                {targets:["plane"],bonePivot:"sb_gun_3",      boneElevate:"sb_elev_3",       bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:0.5*Math.PI   ,speed:0.6 ,swivel:1.6,   posOffset:[5.5, 17.3  ,  10.14   ]},
                {targets:["plane"],bonePivot:"fore_gun_mid",  boneElevate:"gun_fore_mid",    bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:Math.PI       ,speed:0.6 ,swivel:2.7,   posOffset:[0,  6.2   ,  71.5   ]},
                {targets:["plane"],bonePivot:"aft_gun_mid",   boneElevate:"aft_mid_elev",    bulletData:weaponData.BULLET_AAA,  cannonData:weaponData.AAA.midship_80,        baseRot:0.            ,speed:0.6 ,swivel:2.7,   posOffset:[0 , 9.02  ,  -70.4   ]}

            ]

        }
    }
})