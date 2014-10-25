"use strict";

define(["game/GameConfiguration", "game/ModelDefinitions", "game/weapons/WeaponData"], function (gameConfig, modelDefinitions, weaponData) {

    var ANIM_STATES = {
        movement:{
            idle:'idle',
            turnLeft:'turnLeft',
            turnRight:'turnRight',
            strafeRight:'strafeRight',
            strafeLeft:'strafeLeft',
            forward:'forward',
            back:'back',
            halfStrafeRight:'halfStrafeRight',
            halfStrafeLeft:'halfStrafeLeft',
            backRight:'backRight',
            backLeft:'backLeft',
            jumpState:'jumpState'
        },
        seated: {
            pilotSit:'pilotSit',
            sit:'sit'
        }
    };

    return {
        ANIM_STATES:ANIM_STATES,
        PILOT:{
            modelPath:gameConfig.GOO_PROJECTS.human.entityIds.pilot,
            dimensions:{
                massEmpty:2,
                height:1.75,
                mobRadius: 0.7,
                weightDistribution:[1, 1, 1]
            },

            hitPoints:300,
            physicalShapes:[
                {partId:"body", posOffset:[0, 1, 0], radius:1}
            ],
            physicalRadius:5,

            keyBindings:"move",
            uiPages:[],

            wings:{
                body:{
                    pos:[0, 2.0, 0],
                    size:[0.6, 1.9, 0.6],
                    rot:[0, 0, 0],
                    stallAngle:[1, 1, 1],
                    stallLiftCoeff:[1, 1, 1],
                    formDragCoeff:0.21
                }
            },

            gooProject:gameConfig.GOO_PROJECTS.human,
            piecePath:gameConfig.GOO_PROJECTS.human.pilot,
            instruments: {},
            measurements: {},
            animations:{
                moveStates:{
                    idle:'idle',
                    forward:'run',
                    back:'backwards',
                    backLeft:'back_left',
                    backRight:'back_right',
                    turnLeft:'turn_left',
                    turnRight:'turn_right',
                    strafeLeft:'strafe_left',
                    strafeRight:'strafe_right',
                    halfStrafeLeft:'half_strafe_left',
                    halfStrafeRight:'half_strafe_right',
                    jumpState:'jumpstate'
                },
                seated:{
                    pilotSit:'pilot_sit',
                    sit:'sit'
                }
            }
        }
    }
});