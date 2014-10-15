"use strict";

define(["game/GameConfiguration"], function(gameConfig) {

    var blendStates = {
        smoke:{
            blending: 'CustomBlending',
            blendEquation: 'AddEquation',
            blendSrc: 'SrcAlphaFactor',
            blendDst: 'OneMinusSrcAlphaFactor'
        },
        fire:{
            blending: 'CustomBlending',
            blendEquation: 'AddEquation',
            blendSrc: 'SrcAlphaFactor',
            blendDst: 'OneFactor'
        }
    };

    return {
        BULLETS: {
            cannon:{
                fire:{
                    //    mesh:gameConfig.PRELOAD_GOO_MESHES.nevada_metal,
                    mesh:gameConfig.PRELOAD_GOO_MESHES.bullet_20,
                    material:gameConfig.PRELOAD_GOO_MATERIALS.fire,
                    textures: {
                        DIFFUSE_MAP:gameConfig.PRELOAD_GOO_TEXTURES.machinery_diffuse,
                        EMISSIVE_MAP:gameConfig.PRELOAD_GOO_TEXTURES.machinery_diffuse
                    },
                    shaderId:"uberShader"
                }
            }
        },
		GOO_PROJECTS:gameConfig.GOO_PROJECTS,
        GOO_MODELS:{
            nevada:{
                metal:{
                    mesh:gameConfig.PRELOAD_GOO_MESHES.nevada_metal,
                    material:gameConfig.PRELOAD_GOO_MATERIALS.metal,
                    textures: {
                        DIFFUSE_MAP:gameConfig.PRELOAD_GOO_TEXTURES.machinery_diffuse,
                        SPECULAR_MAP:gameConfig.PRELOAD_GOO_TEXTURES.machinery_spec
                    },
                    shaderId:"uberShader"
                }
            }
        },
        GOO_PARTICLES:{
            /*
            wing_smoke:{
                name:"wing_smoke",
                blendState:blendStates.smoke,
                targetSpace:null,
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 45,
                    minLifetime : 35.0,
                    maxLifetime : 42.0
                },{
                        totalParticlesToSpawn: -1,
                        releaseRatePerSecond : 125,
                        minLifetime : 2.0,
                        maxLifetime : 6.0
                    }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 0.2,
                    color : [0.95, 0.95, 0.95, 0.48]
                }, {
                    timeOffset : 0.01,
                    size : 0.8,
                    color : [0.85, 0.85, 0.85, 0.32]
                }, {
                    timeOffset : 0.30,
                    size : 2.2,
                    color : [0.65, 0.65, 0.65, 0.18]
                }, {
                    timeOffset : 0.3,
                    size : 4.5,
                    color : [0.95, 0.95, 0.95, 0]
                }]
            },
            */
            smokestack:{
                name:"smokestack",
                blendState:blendStates.smoke,
                targetSpace:null,
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 8,
                    minLifetime : 3.0,
                    maxLifetime : 21.0
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 5.1,
                    color : [0, 0, 0, 0.15]
                }, {
                    timeOffset : 0.2,
                    size : 25,
                    color : [0, 0, 0, 0.05]
                }, {
                    timeOffset : 0.4,
                    size : 44.2,
                    color : [0, 0, 0, 0.03]
                }, {
                    timeOffset : 0.3,
                    size : 70.5,
                    color : [0, 0, 0, 0]
                }]
            },
            jet_smoke:{
                name:"jet_smoke",
                blendState:blendStates.smoke,
                targetSpace:null,
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 45,
                    minLifetime : 1.0,
                    maxLifetime : 9.0,
                    posOffset:[0, -0.22, -4.5]
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 0.2,
                    color : [0.25, 0.12, 0.11, 0.08]
                }, {
                    timeOffset : 0.05,
                    size : 1,
                    color : [0.1, 0.1, 0.1, 0.03]
                }, {
                    timeOffset : 0.3,
                    size : 8.2,
                    color : [0, 0, 0, 0.02]
                }, {
                    timeOffset : 0.3,
                    size : 22.5,
                    color : [0, 0, 0, 0]
                }]
            },
            tomcat_jet:{
                name:"tomcat_jet",
                blendState:blendStates.fire,
                targetSpace:"parent",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.dot_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 1400,
                    minLifetime : 0.03,
                    maxLifetime : 0.07
                }],
                timeline : [{
                    timeOffset : 0.0,
                    mass : 1,
                    size : 0.7,
                    color : [0.5, 0.5, 0.6, 0.38]
                }, {
                    timeOffset : 0.3,
                    size : 0.95,
                    color : [0.4, 0.3, 0.3, 0.12]
                }, {
                    timeOffset : 0.2,
                    size : 0.35,
                    color : [0.6, 0.6, 0.3, 0.04]
                }, {
                    timeOffset : 0.3,
                    size : 1.57,
                    color : [1, 0.6, 0.1, 0.03]
                }, {
                    timeOffset : 0.2,
                    size : 0.85,
                    color : [1, 0.3, 0.0, 0]
                }]
            },
            basic_jet:{
                name:"basic_jet",
                blendState:blendStates.fire,
                targetSpace:"parent",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.dot_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 600,
                    minLifetime : 0.06,
                    maxLifetime : 0.14
                }, {
                        totalParticlesToSpawn: -1,
                        releaseRatePerSecond : 600,
                        minLifetime : 0.04,
                        maxLifetime : 0.08
                    }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 0.3,
                    color : [0.1, 0.3, 1, 0.04]
                }, {
                    timeOffset : 0.2,
                    size : 0.35,
                    color : [0.2, 0.5, 0.9, 0.18]
                }, {
                    timeOffset : 0.2,
                    size : 0.45,
                    color : [0.6, 0.6, 0.5, 0.06]
                }, {
                    timeOffset : 0.3,
                    size : 0.47,
                    color : [1, 0.4, 0.0, 0.02]
                }, {
                    timeOffset : 0.2,
                    size : 0.75,
                    color : [1, 0.3, 0.0, 0]
                }]
            },
            black_puff:{
                name:"black_puff",
                blendState:blendStates.smoke,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 50,
                    minLifetime : 4.8,
                    maxLifetime : 12.8
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 4.1,
                    color : [1, 1, 1, 0]
                }, {
                    timeOffset : 0.02,
                    size : 8,
                    color : [0.3, 0.3, 0.3, 0.27]
                }, {
                    timeOffset : 0.3,
                    size : 34.2,
                    color : [0, 0, 0, 0.12]
                }, {
                    timeOffset : 0.7,
                    size : 50.5,
                    color : [0.2, 0.2, 0.2, 0]
                }]
            },
            cloud_puff:{
                name:"cloud_puff",
                blendState:blendStates.smoke,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 10,
                    minLifetime : 7,
                    maxLifetime : 15
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 1245,
                    color : [0.98, 0.98, 0.98, 0]
                }, {
                    timeOffset : 0.15,
                    size : 1355,
                    color : [0.98, 0.98, 0.98, 0.21]
                }, {
                    timeOffset : 0.5,
                    size : 1475,
                    color : [0.96, 0.96, 0.96, 0.28]
                }, {
                    timeOffset : 0.34,
                    size : 1594,
                    color : [0.95, 0.95, 0.95, 0]
                }]
            },
            acrobatic_puff:{
                name:"acrobatic_puff",
                blendState:blendStates.smoke,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 120,
                    minLifetime : 15,
                    maxLifetime : 22
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 0.65,
                    color : [1, 1, 1, 0.02]
                }, {
                    timeOffset : 0.02,
                    size : 2.5,
                    color : [0.94, 0.94, 0.94, 0.18]
                }, {
                    timeOffset : 0.1,
                    size : 9,
                    color : [0.9, 0.9, 0.9, 0.05]
                }, {
                    timeOffset : 0.6,
                    size : 34,
                    color : [0.85, 0.85, 0.85, 0.02]
                }, {
                    timeOffset : 0.2,
                    size : 124,
                    color : [0.85, 0.85, 0.85, 0]
                }]
            },
            small_puff:{
                name:"small_puff",
                blendState:blendStates.smoke,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 120,
                    minLifetime : 0.4,
                    maxLifetime : 1.5
                }],
                timeline : [{
                    timeOffset : 0,
                    spin : 0,
                    mass : 1,
                    size : 0.25,
                    color : [1, 1, 1, 0.11]
                }, {
                    timeOffset : 0.15,
                    size : 1.2,
                    color : [0.99, 0.99, 0.99, 0.14]
                }, {
                    timeOffset : 0.3,
                    size : 2.5,
                    color : [0.97, 0.97, 0.97, 0.07]
                }, {
                    timeOffset : 0.5,
                    size : 7,
                    color : [0.95, 0.95, 0.95, 0]
                }]
            },
            rapid_puff:{
                name:"rapid_puff",
                blendState:blendStates.smoke,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 1420,
                    minLifetime : 0.04,
                    maxLifetime : 0.13
                }],
                timeline : [{
                    timeOffset : 0,
                    spin : 0,
                    mass : 1,
                    size : 0.85,
                    color : [1, 1, 1, 0.51]
                }, {
                    timeOffset : 0.3,
                    size : 2.2,
                    color : [1, 1, 1, 0.27]
                }, {
                    timeOffset : 0.5,
                    size : 5,
                    color : [1, 1, 1, 0]
                }]
            },
            white_puff:{
                name:"white_puff",
                blendState:blendStates.smoke,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 150,
                    minLifetime : 1.8,
                    maxLifetime : 3.8
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 5.66,
                    color : [0.3, 0.3, 0.3, 0]
                }, {
                    timeOffset : 0.3,
                    size : 8,
                    color : [0.7, 0.7, 0.7, 0.13]
                }, {
                    timeOffset : 0.9,
                    size : 64.2,
                    color : [0.95, 0.95, 0.95, 0]
                }]
            },
            water_splash:{
                name:"water_splash",
                blendState:blendStates.smoke,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.splash_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 150,
                    minLifetime : 0.8,
                    maxLifetime : 2.1
                }],
                timeline : [{
                    timeOffset : 0.01,
                    spin : 0.1,
                    mass : 1,
                    size : 0.06,
                    color : [0.95, 0.95, 1, 0.6]
                }, {
                    timeOffset : 0.3,
                    spin : -0.1,
                    size : 7.22,
                    color : [0.85, 0.9, 1.0, 0.48]
                }, {
                    timeOffset : 0.6,
                    spin : 0,
                    size : 16.2,
                    color : [1,1, 1, 0]
                }]
            },
            spark_flash:{
                name:"spark_flash",
                blendState:blendStates.fire,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.spark_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 55,
                    minLifetime : 0.21,
                    maxLifetime : 0.46
                }],
                timeline : [{
                    timeOffset : 0.01,
                    spin : 53.1,
                    mass : 1,
                    size : 0.06,
                    color : [0.55, 0.65, 1, 0.9]
                }, {
                    timeOffset : 0.6,
                    spin : 0,
                    size : 12.22,
                    color : [0.85, 0.8, 0.9, 0.28]
                }, {
                    timeOffset : 0.4,
                    spin : 0,
                    size : 18.2,
                    color : [1,1, 1, 0]
                }]
            },
            shockwave_hit:{
                name:"shockwave_hit",
                blendState:blendStates.fire,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.shockwave_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 55,
                    minLifetime : 0.26,
                    maxLifetime : 0.46
                }],
                timeline : [{
                    timeOffset : 0.01,
                    spin : 0.1,
                    mass : 1,
                    size : 8,
                    color : [0.95, 0.95, 1, 0.4]
                }, {
                    timeOffset : 0.15,
                    spin : -0.1,
                    size : 0.22,
                    color : [0.95, 0.9, 0.5, 0.6]
                }, {
                    timeOffset : 0.85,
                    spin : 0,
                    size : 28.2,
                    color : [1,0.8, 0.4, 0]
                }]
            },
            muzzle_flash:{
                name:"muzzle_flash",
                blendState:blendStates.fire,
                targetSpace:"null",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.dot_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 150,
                    minLifetime : 0.28,
                    maxLifetime : 0.66
                }],
                timeline : [{
                    timeOffset : 0.01,
                    spin : 0.1,
                    mass : 1,
                    size : 2,
                    color : [0.95, 0.5, 0.4, 0.6]
                }, {
                    timeOffset : 0.3,
                    spin : -0.1,
                    size : 12.22,
                    color : [0.85, 0.5, 0.1, 0.48]
                }, {
                    timeOffset : 0.6,
                    spin : 0,
                    size : 8,
                    color : [1,0.3, 0, 0]
                }]
            },
            muzzle_flame:{
                name:"muzzle_flame",
                blendState:blendStates.fire,
                targetSpace:"parent",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.dot_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 200,
                    minLifetime : 0.04,
                    maxLifetime : 0.08
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 0.06,
                    color : [0.7, 0.6, 0.9, 0.44]
                }, {
                    timeOffset : 0.4,
                    size : 0.62,
                    color : [1, 0.9, 0.6, 0.18]
                }, {
                    timeOffset : 0.6,
                    size : 0.2,
                    color : [0.6, 0.3, 0.01, 0]
                }]
            },
            muzzle_smoke:{
                name:"muzzle_smoke",
                blendState:blendStates.smoke,
                targetSpace:"parent",
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.smoke_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 50,
                    minLifetime : 0.19,
                    maxLifetime : 0.55
                }],
                timeline : [{
                    timeOffset : 0.0,
                    spin : 0,
                    mass : 1,
                    size : 0.36,
                    color : [0.3, 0.3, 0.3, 0.3]
                }, {
                    timeOffset : 0.4,
                    size : 0.92,
                    color : [0.5, 0.5, 0.5, 0.18]
                }, {
                    timeOffset : 0.6,
                    size : 2.2,
                    color : [0.0, 0.0, 0.0, 0]
                }]
            },
            water_ringlet:{
                name:"water_ringlet",
                blendState:blendStates.smoke,
                targetSpace:"null",
                billboard:{bbx:[1, 0, 0], bby:[0, 0, 1]},
                textures: {
                    PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.fieldring_particle
                },
                emitters:[{
                    totalParticlesToSpawn: -1,
                    releaseRatePerSecond : 20,
                    minLifetime : 52,
                    maxLifetime : 88
                }],
                timeline : [{
                    timeOffset : 0,
                    spin : 0.1,
                    mass : 1,
                    size : 12,
                    color : [0.85, 0.95, 1, 0]
                }, {
                    timeOffset : 0.03,
                    spin : 0.1,
                    mass : 1,
                    size : 18,
                    color : [0.85, 0.85, 0.9, 0.1]
                }, {
                    timeOffset : 0.3,
                    spin : -0.1,
                    size : 80,
                    color : [0.75, 0.9, 1.0, 0.03]
                }, {
                    timeOffset : 0.6,
                    spin : 0,
                    size : 250,
                    color : [0.4, 0.7, 1, 0]
                }],
            },

                water_foam:{
                    name:"water_foam",
                    blendState:blendStates.smoke,
                    targetSpace:"null",
                    billboard:{bbx:[1, 0, 0], bby:[0, 0, 1]},
                    textures: {
                        PARTICLE_TX:gameConfig.PRELOAD_GOO_TEXTURES.foam_particle
                    },
                    emitters:[{
                        totalParticlesToSpawn: -1,
                        releaseRatePerSecond : 20,
                        minLifetime : 22,
                        maxLifetime : 88
                    }],
                    timeline : [{
                        timeOffset : 0,
                        spin : 0.1,
                        mass : 1,
                        size : 15,
                        color : [0.85, 0.95, 1, 0]
                    }, {
                        timeOffset : 0.2,
                        spin : 0.1,
                        mass : 1,
                        size : 15,
                        color : [1, 1, 1, 0.5]
                    }, {
                        timeOffset : 0.3,
                        spin : -0.1,
                        size : 25,
                        color : [1, 1, 1.0, 0.23]
                    }, {
                        timeOffset : 0.6,
                        spin : 0,
                        size : 57,
                        color : [1, 1, 1, 0]
                    }]
                }
            }
        }
});