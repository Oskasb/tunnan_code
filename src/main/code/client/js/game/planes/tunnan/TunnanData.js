"use strict";

define([
    'game/planes/tunnan/TunnanSystems',
    'game/planes/tunnan/TunnanInstruments',
    'game/planes/tunnan/TunnanSurfaces',
    'game/planes/tunnan/TunnanOnScreenInput' ,
    'game/planes/tunnan/TunnanWings',
    'game/planes/tunnan/TunnanLights',
    'game/planes/tunnan/TunnanScreens',
    "game/GameConfiguration",
    "game/ModelDefinitions",
    "game/weapons/WeaponData"
], function(
    TunnanSystems,
    TunnanInstruments,
    TunnanSurfaces,
    TunnanOnScreenInput,
    TunnanWings,
    TunnanLights,
    TunnanScreens,
    gameConfig,
    modelDefinitions,
    weaponData
    ) {

    return {

        TUNNAN:{
            modelPath:gameConfig.GOO_PROJECTS.tunnan.entityIds.tunnan,
            dimensions: {
                massEmpty:4845,
                massMax:8375,
                weightDistribution:[2, 2, 2], // average radius from pog for each axis, user for inertia of momentum
                length:11,
                wingspan:10.23,
                pilotSeatPos:[0, 0.14, 1.82],
                wingAngle:0.2, // ratio length / width / (1 = arrow, 0 = easystar)
                height:3.75
            },

            hitPoints:300,
            physicalShapes:[
                {partId:"fuselage", posOffset:[0, 0, 0], radius:5},
                {partId:"fuselage", posOffset:[0, 0, 4], radius:5},
                {partId:"fuselage", posOffset:[0, 0, -4], radius:5},
                {partId:"wing",     posOffset:[4,  0, -4], radius:5},
                {partId:"wing",     posOffset:[-4, 0, -4], radius:5}
            ],
            physicalRadius:30,

            keyBindings:gameConfig.KEY_BINDINGS.plane,
            gooProjectUrl:gameConfig.GOO_PROJECTS.tunnan.projectPath,
            gooProject:gameConfig.GOO_PROJECTS.tunnan,
            piecePath:gameConfig.GOO_PROJECTS.tunnan.tunnan,
            contrail_effect:modelDefinitions.GOO_PARTICLES.wing_smoke,
            uiPages:[],

            wing_smoke:[
                [-5.8, 0, -2],
                [5.8, 0, -2]
            ],


            onScreenInput: new TunnanOnScreenInput(),

            instruments: TunnanInstruments.INSTRUMENTS,

            measurements: {
                throttle:1,
                speed:1,
                altitude:1,
                airflowx:1,
                airflowy:1,
                airflowz:1,
                gForce:1
            },

            wings:TunnanWings.WINGS,
            surfaces:TunnanSurfaces.SURFACES,
            systems:TunnanSystems.SYSTEMS
        }
    }
});