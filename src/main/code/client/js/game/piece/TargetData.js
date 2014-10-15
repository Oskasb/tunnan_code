"use strict";

define(["game/GameConfiguration"], function (gameConfig) {

    return {
        TV_CRT:{
            dimensions:{
                massEmpty:2,
                massMax:3,
                mobRadius: 1.05
            },
            screens:{
                meshData:[{meshEntityName:'tv_crt/entities/screen.entity'}],
                displays:{
                    tv_crt:{
                        mapcoords:[125, 94, 250, 180],
                        instruments: {
                            tv_crt_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[125, 94, 250, 180],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.hud
                            }
                        }
                    }
                }
            },

            hitPoints:5,
            physicalShapes:[
                {partId:"bullseye", posOffset:[0,  0.5, 0],  radius:2}
            ],
            physicalRadius:2,
            gooProject:gameConfig.GOO_PROJECTS.tv_screen,
            piecePath:gameConfig.GOO_PROJECTS.tv_screen.tv
        },
        MONITOR_CONSOLE:{
            dimensions:{
                massEmpty:2,
                massMax:3,
                mobRadius: 1.05
            },
            screens:{
                meshData:[{meshEntityName:'monitor_console/entities/console_screens.entity'}],
                displays:{
                    console_main:{
                        mapcoords:[127, 94, 254, 190],
                        instruments: {
                            console_main_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[127, 94, 254, 190],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.animals
                            }
                        }
                    },
                    console_right:{
                        mapcoords:[383, 95, 254, 190],
                        instruments: {
                            console_right_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[383, 95, 254, 190],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.promos
                            }
                        }
                    },
                    console_left:{
                        mapcoords:[85, 248, 170, 105],
                        instruments: {
                            console_left_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[85, 248, 170, 105],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.cats
                            }
                        }
                    },
                    console_top_1:{
                        mapcoords:[256, 248, 170, 105],
                        instruments: {
                            console_top_1_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[256, 248, 170, 105],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.history
                            }
                        }
                    },
                    console_top_2:{
                        mapcoords:[427, 248, 170, 105],
                        instruments: {
                            console_top_2_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[427, 248, 170, 105],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.military
                            }
                        }
                    },
                    console_left_3:{
                        mapcoords:[85, 358, 170, 105],
                        instruments: {
                            console_top_3_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[85, 358, 170, 105],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.planes
                            }
                        }
                    },
                    console_top_4:{
                        mapcoords:[254, 358, 170, 105],
                        instruments: {
                            console_top_4_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[254, 355, 170, 105],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.vdi
                            }
                        }
                    },
                    console_top_5:{
                        mapcoords:[425, 358, 170, 105],
                        instruments: {
                            console_top_5_video:{
                                script:'VideoPlayer',
                                meshIndex:0,
                                txcoords:[425, 358, 170, 105],
                                sources:{
                                    video:[0, 0, 240, 180]
                                },
                                channel:gameConfig.VIDEOS.channels.hud
                            }
                        }
                    },
                }
            },
            hitPoints:5,
            physicalShapes:[
                {partId:"bullseye", posOffset:[0,  0.5, 0],  radius:2}
            ],
            physicalRadius:8,
            gooProject:gameConfig.GOO_PROJECTS.monitor_console,
            piecePath:gameConfig.GOO_PROJECTS.monitor_console.monitor_console
        },
        GROUND_FLAT:{
            dimensions:{
                massEmpty:845,
                massMax:2375,
                mobRadius: 1
            },

            hitPoints:5,
            physicalShapes:[
                {partId:"bullseye", posOffset:[0,  3, 0],  radius:6},
                {partId:"edge",     posOffset:[10, 2, 10], radius:8},
                {partId:"edge",     posOffset:[-10,2, 10], radius:8},
                {partId:"edge",     posOffset:[10, 2, -10],radius:8},
                {partId:"edge",     posOffset:[-10,2, -10],radius:8},
                {partId:"edge",     posOffset:[0,  2, 10], radius:8},
                {partId:"edge",     posOffset:[-10,2, 0],  radius:8},
                {partId:"edge",     posOffset:[10, 2, 0],  radius:8},
                {partId:"edge",     posOffset:[0,  2, -10],radius:8}
            ],
            physicalRadius:130,
            gooProject:gameConfig.GOO_PROJECTS.targets,
            piecePath:gameConfig.GOO_PROJECTS.targets.ground_flat
        },
        HOUSE_BOX_30:{
            dimensions:{
                massEmpty:845,
                massMax:2375,
                mobRadius: 1
            },

            hitPoints:3000,
            physicalShapes:[
                {partId:"bullseye", posOffset:[0,   15,  0],  radius:14},
                {partId:"edge",     posOffset:[ 16,  7,  16], radius:18},
                {partId:"edge",     posOffset:[-16,  7,  16], radius:18},
                {partId:"edge",     posOffset:[ 16,  7, -16], radius:18},
                {partId:"edge",     posOffset:[-16,  7, -16], radius:18},
                {partId:"edge",     posOffset:[  0,  7,  16], radius:18},
                {partId:"edge",     posOffset:[-16,  7,  0],  radius:18},
                {partId:"edge",     posOffset:[ 16,  7,  0],  radius:18},
                {partId:"edge",     posOffset:[0,    7, -16], radius:18},
                {partId:"edge",     posOffset:[ 16, 16,  16], radius:18},
                {partId:"edge",     posOffset:[-16, 16,  16], radius:18},
                {partId:"edge",     posOffset:[ 16, 16, -16], radius:18},
                {partId:"edge",     posOffset:[-16, 16, -16], radius:18},
                {partId:"edge",     posOffset:[  0, 16,  16], radius:18},
                {partId:"edge",     posOffset:[-16, 16,  0],  radius:18},
                {partId:"edge",     posOffset:[ 16, 16,  0],  radius:18},
                {partId:"edge",     posOffset:[0,   16, -16], radius:18}
            ],
            physicalRadius:180,
            gooProject:gameConfig.GOO_PROJECTS.targets,
            piecePath:gameConfig.GOO_PROJECTS.targets.house_box_3
        }
    }
});