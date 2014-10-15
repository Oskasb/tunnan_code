"use strict";

define(["game/GameConfiguration"], function(gameConfig) {

    return {
        SCREENS:{
            meshData:[{meshEntityName:'lights'}],
			controls:{
				screen_intensity:   {value:0.9, controlState:0},
				hud_intensity:      {value:0.6, controlState:0},
				hdd_intensity:      {value:0.7, controlState:0}
			},
            displays:{
                vdi:{
                    mapcoords:[414, 418, 230, 226],
                    instruments: {
                        vdi_video:{
                            script:'VideoPlayer',
                            meshIndex:0,
                            txcoords:[414, 418, 230, 226],
                            sources:{
                                video:[0, 0, 256, 128]
                            },
                            channel:gameConfig.VIDEOS.channels.vdi
                        },

                        vdi_horizon:{
                            script:'VdiLadder',
                            meshIndex:0,
                            txcoords:[414, 418, 230, 226],
                            sources:{
                                //  flat:[428, 54, 60, 5],
                                up:  [428, 30, 60, 6],
                                down:[428, 75, 60, 6],
                                origin:[442, 42, 32, 7],
                                o_line:[315, 418, 20, 1],
                                flat:[345, 417, 140, 3]
                            }
                        },

                        vdi_compass:{
                            script:'CompassTape',
                            meshIndex:0,
                            lines:7,
                            txcoords:[411, 350, 197, 187],
                            sources:{
                                dots:[480, 0, 32, 6],
                                '0':[397, 0, 7, 11],
                                '1':[405, 0, 7, 11],
                                '2':[413, 0, 7, 11],
                                '3':[421, 0, 7, 11],
                                '4':[429, 0, 7, 11],
                                '5':[437, 0, 7, 11],
                                '6':[445, 0, 7, 11],
                                '7':[453, 0, 7, 11],
                                '8':[461, 0, 7, 11],
                                '9':[469, 0, 7, 11]
                            }
                        }
                    }
                },
                hsi:{
                    mapcoords:[137, 416, 162, 198],
                    instruments: {
                        hsi_video:{
                            script:'VideoPlayer',
                            meshIndex:0,
                            txcoords:[137, 416, 162, 198],
                            sources:{
                                video:[0, 0, 256, 128]
                            },
                            channel:gameConfig.VIDEOS.channels.hsi
                        },

                        hsi_rotation:{
                            script:'HsiRotation',
                            meshIndex:0,
                            txcoords:[137, 416, 162, 198],
                            sources:{
                                circles:[94, 369, 90, 90]
                            }
                        },
                        hsi_compass:{
                            script:'CompassTape',
                            meshIndex:0,
                            lines:7,
                            txcoords:[139, 335, 161, 27],
                            sources:{
                                dots:[480, 0, 32, 6],
                                '0':[397, 0, 7, 11],
                                '1':[405, 0, 7, 11],
                                '2':[413, 0, 7, 11],
                                '3':[421, 0, 7, 11],
                                '4':[429, 0, 7, 11],
                                '5':[437, 0, 7, 11],
                                '6':[445, 0, 7, 11],
                                '7':[453, 0, 7, 11],
                                '8':[461, 0, 7, 11],
                                '9':[469, 0, 7, 11]
                            }
                        }
                    }
                },
                hud: {
                    mapcoords:[452, 59, 121, 119],
                    instruments: {
                        hud_video:{
                            script:'VideoPlayer',
                            meshIndex:0,
                            txcoords:[452, 59, 121, 119],
                            sources:{
                                video:[0, 0, 256, 128]
                            },
                            channel:gameConfig.VIDEOS.channels.hud
                        },
                        hud_horizon:{
                            script:'HudLadder',
                            meshIndex:0,
                            txcoords:[452, 59, 121, 119],
                            sources:{
                                flat:[428, 54, 60, 5],
                                up:[428, 31, 60, 5],
                                down:[428, 75, 60, 5],
                                origin:[440, 42, 36, 5]
                            }
                        },
                        hud_compass:{
                            script:'CompassTape',
                            meshIndex:0,
                            lines:5,
                            txcoords:[452, 17, 121, 110],
                            sources:{
                                dots:[480, 0, 32, 6],
                                '0':[397, 0, 7, 11],
                                '1':[405, 0, 7, 11],
                                '2':[413, 0, 7, 11],
                                '3':[421, 0, 7, 11],
                                '4':[429, 0, 7, 11],
                                '5':[437, 0, 7, 11],
                                '6':[445, 0, 7, 11],
                                '7':[453, 0, 7, 11],
                                '8':[461, 0, 7, 11],
                                '9':[469, 0, 7, 11]
                            }
                        },

                        hud_altimeter:{
                            script:'ScreenDigits',
                            sourceValue:'altimeter',
                            meshIndex:0,
                            txcoords:[412, 105, 114, 110],
                            sources:{
                                '0':[397, 0, 7, 11],
                                '1':[405, 0, 7, 11],
                                '2':[413, 0, 7, 11],
                                '3':[421, 0, 7, 11],
                                '4':[429, 0, 7, 11],
                                '5':[437, 0, 7, 11],
                                '6':[445, 0, 7, 11],
                                '7':[453, 0, 7, 11],
                                '8':[461, 0, 7, 11],
                                '9':[469, 0, 7, 11]
                            }
                        },

                        hud_speed:{
                            script:'ScreenDigits',
                            sourceValue:'ground_speed',
                            meshIndex:0,
                            txcoords:[412, 116, 114, 110],
                            sources:{
                                '0':[397, 0, 7, 11],
                                '1':[405, 0, 7, 11],
                                '2':[413, 0, 7, 11],
                                '3':[421, 0, 7, 11],
                                '4':[429, 0, 7, 11],
                                '5':[437, 0, 7, 11],
                                '6':[445, 0, 7, 11],
                                '7':[453, 0, 7, 11],
                                '8':[461, 0, 7, 11],
                                '9':[469, 0, 7, 11]
                            }
                        },

                        climb_rate:{
                            script:'RulerGauge',
                            sourceValue:'climb_indicator',
                            meshIndex:0,
                            scaleFactor: 2,
                            xOffset:10,
                            txcoords:[408, 54, 15, 50],
                            sources:{
                                ruler:[407, 29, 15, 50],
                                arrow:[422, 51, 4, 7]
                            }
                        },
                        aoa_z:{
                            meshIndex:0,
                            script:'RulerGauge',
                            sourceValue:'aoa_indicator',
                            scaleFactor: 160,
                            xOffset:-10,
                            txcoords:[502, 54, 8, 48],
                            sources:{
                                ruler:[496, 34, 8, 44],
                                arrow:[491, 50, 4, 8]
                            }
                        }
                    }
                }
            }
        }
    }
});