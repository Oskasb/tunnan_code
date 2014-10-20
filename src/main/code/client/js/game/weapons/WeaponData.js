"use strict";

define(["game/ModelDefinitions"], function(modelDefinitions) {



    return {
        BOMB_200:{
            modelPath:modelDefinitions.GOO_PROJECTS.armaments.bomb_200kg,
            damageEffects:[{kinetic:{points:5}}, {fire:{intensity:0.2, size:9}}],
            onHitSounds:["BULLET_HIT_0", "BULLET_HIT_1", "BULLET_HIT_2", "BULLET_HIT_3"],
			lifeTime: 60000,
            onHitEffects: {
                FLASH_SPARKS:{count:1},
                FLASH_SHOCKWAVE:{count:1},
                PUFF_BLACK_SMOKE:{count:2},
                PUFF_WHITE_SMOKE:{count:1}
            }
        },
        BULLET_20:{
            modelPath:modelDefinitions.GOO_PROJECTS.bullet_20.piecePath,
            damageEffects:[{kinetic:{points:5}}, {fire:{intensity:0.2, size:9}}],
            onHitSounds:["BULLET_HIT_0", "BULLET_HIT_1", "BULLET_HIT_2", "BULLET_HIT_3"],
			lifeTime: 8000,
            onHitEffects: [
				"hit_smoke_puff",
				"metal_sparks"
            ]
        },
        BULLET_AAA:{
            modelPath:modelDefinitions.GOO_PROJECTS.bullet_20.piecePath,
            damageEffects:[{kinetic:{points:20}}, {fire:{intensity:0.5, size:16}}],
            onHitSounds:["AAA_HIT_0", "AAA_HIT_1", "AAA_HIT_2"],
			lifeTime: 14000,
            onHitEffects: {
                PUFF_BLACK_SMOKE:{count:5},
                PUFF_WHITE_SMOKE:{count:2},
                FLASH_SPARKS:{count:5},
                FLASH_SHOCKWAVE:{count:1}
            }
        },
        BULLET_MAIN:{
            modelPath:modelDefinitions.GOO_PROJECTS.bullet_20.piecePath,
            damageEffects:[{kinetic:{points:100}}, {fire:{intensity:0.7, size:20}}],
            onHitSounds:["MAIN_HIT_0", "MAIN_HIT_1", "MAIN_HIT_2"],
			lifeTime: 38000,
            onHitEffects: {
                PUFF_WHITE_SMOKE:{count:12},
                PUFF_BLACK_SMOKE:{count:12},
                FLASH_SHOCKWAVE:{count:3},
                FLASH_SPARKS:{count:4},
                FLASH_MUZZLE_FIRE:{count:8}
            }
        },
        MAIN_GUNS: {
            main_gun_16:{
                name:"Main Gun 16",
                caliber:250,
                barrelLength:25,
                exitVelocity:230,
                rateOfFire:0.07,
                onFireSounds:["MAIN_GUN_0", "MAIN_GUN_1", "MAIN_GUN_2"],
                onFireEffects: {
                    PUFF_WHITE_SMOKE:{count:5},
                    PUFF_BLACK_SMOKE:{count:8},
                    FLASH_MUZZLE_FIRE:{count:14}
                },
                lifetime:92000
            }
        },
        AAA:{
            midship_80:{
                name:"Midship Gun 8",
                caliber:80,
                barrelLength:10,
                exitVelocity:380,
                rateOfFire:2.3,
                onFireSounds:["AAA_0", "AAA_1", "AAA_2"],
                onFireEffects: {
                    PUFF_WHITE_SMOKE:{count:1},
                    FLASH_MUZZLE_FIRE:{count:4}
                },
                lifetime:7000
            }
        },
        CANNONS:{
            hispano_20:{
                name:"Hispano 20",
                caliber:20,
                exitVelocity:720,
                rateOfFire:4,
                onFireSounds:["CANNON_20_0", "CANNON_20_1", "CANNON_20_2", "CANNON_20_3"],
                flameEffect:modelDefinitions.GOO_PARTICLES.muzzle_flame,
                smokeEffect:modelDefinitions.GOO_PARTICLES.muzzle_smoke,
                lifetime:7000
            },
            vulcan_20:{
                name:"Vulcan 20",
                caliber:20,
                exitVelocity:1120,
                rateOfFire:20,
                onFireSounds:["CANNON_20_0", "CANNON_20_1", "CANNON_20_2", "CANNON_20_3"],
                flameEffect:modelDefinitions.GOO_PARTICLES.muzzle_flame,
                smokeEffect:modelDefinitions.GOO_PARTICLES.muzzle_smoke,
                lifetime:7000
            }
        }
    }
});
