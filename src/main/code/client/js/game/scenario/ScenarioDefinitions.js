"use strict";

define(["game/world/ZoneData", 'game/world/levels/ZoneLevels', "game/GameConfiguration"], function(zoneData, zoneLevels, gameConfig) {

    return {
        SCENARIOS: {
            carrier_patrol: {
                IDENTITY:{
                    title:"Carrier at sea",
                    tagLine:"Play around with the Carrier."
                },
                playerVehicle:"TOMCAT",
                playerCharacter:"PILOT",
				playerCarrier:"CARRIER",
                loadZones:[zoneData.FREEFLIGHT_ZONES.ocean/*, zoneData.TERRAIN_ZONES.cove, zoneData.TERRAIN_ZONES.big_2_1 , zoneData.TERRAIN_ZONES.big_2_1 */],
                loadLevels:[],
                loadPlayer:zoneData.FREEFLIGHT_ZONES.carrier_takeoff,
                loadVehicles:[[zoneData.SPAWN_POINTS.carrier_takeoff], [], []]
            },
            tomcat_freeflight: {
                IDENTITY:{
                    title:"F-14 Tomcat",
                    tagLine:"Free flight over ocean"
                },
                playerVehicle:"TOMCAT",
                playerCharacter:"PILOT",
                loadLevels:[],
                loadZones:[zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.FREEFLIGHT_ZONES.ocean,
                loadVehicles:[[]]
            },
            tunnan_freeflight: {
                IDENTITY:{
                    title:"J-29 Tunnan",
                    tagLine:"Free flight over ocean"
                },
                playerVehicle:"TUNNAN",
                playerCharacter:"PILOT",
                loadZones:[zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.FREEFLIGHT_ZONES.ocean,
                loadVehicles:[[]],
                loadLevels:[]
            },
            draken_freeflight: {
                IDENTITY:{
                    title:"J-35 Draken",
                    tagLine:"Free flight over ocean"
                },
                playerVehicle:"DRAKEN",
                loadZones:[zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.FREEFLIGHT_ZONES.ocean,
                loadVehicles:[[]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    vehicles:gameConfig.GOO_PROJECTS.draken,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20,
                    environment:gameConfig.GOO_PROJECTS.environment
                }
            },
            cougar_freeflight: {
                IDENTITY:{
                    title:"Cougar F9F",
                    tagLine:"Free flight over ocean"
                },
                playerVehicle:"COUGAR",
                loadZones:[zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.FREEFLIGHT_ZONES.ocean,
                loadVehicles:[[]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    vehicles:gameConfig.GOO_PROJECTS.cougar_f9f,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20
                }
            },
            b52_freeflight: {
                IDENTITY:{
                    title:"B-52",
                    tagLine:"Free flight over ocean"
                },
                playerVehicle:"B52",
                loadZones:[zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.FREEFLIGHT_ZONES.ocean,
                loadVehicles:[[]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    stratofortress:gameConfig.GOO_PROJECTS.stratofortress
                }
            },
            tunnan_takeoff: {
                IDENTITY:{
                    title:"Mysterious Island",
                    tagLine:"An island with things to land on and shoot at"
                },
                //     playerVehicle:"TUNNAN",
                     playerCharacter:"PILOT",
                loadZones:[zoneData.TERRAIN_ZONES.start/*, zoneData.TERRAIN_ZONES.cove, zoneData.TERRAIN_ZONES.big_2_1 , zoneData.TERRAIN_ZONES.big_2_1 */],
                loadLevels:[zoneLevels.ZONES.start],
                loadPlayer:zoneData.TERRAIN_ZONES.start,
                loadVehicles:[[zoneData.SPAWN_POINTS.air_base, zoneData.SPAWN_POINTS.tomcat, zoneData.SPAWN_POINTS.tunnan ,zoneData.SPAWN_POINTS.practice_range, zoneData.SPAWN_POINTS.carrier], [], []],
                loadProjects:{}
            },
            draken_takeoff: {
                IDENTITY:{
                    title:"J-35 Draken",
                    tagLine:"Island runway takeoff"
                },
                playerCharacter:"PILOT",
                loadZones:[zoneData.TERRAIN_ZONES.start],
                loadLevels:[zoneLevels.ZONES.start],
                loadPlayer:zoneData.TERRAIN_ZONES.start,
                loadVehicles:[[zoneData.SPAWN_POINTS.draken]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    environment:gameConfig.GOO_PROJECTS.environment,
                    houses:gameConfig.GOO_PROJECTS.houses,
                    house_t:gameConfig.GOO_PROJECTS.house_t,
                    draken:gameConfig.GOO_PROJECTS.draken,
                    nature:gameConfig.GOO_PROJECTS.nature,
                    air_base:gameConfig.GOO_PROJECTS.air_base,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20
                }
            },

            cougar_takeoff: {
                IDENTITY:{
                    title:"Cougar F9F",
                    tagLine:"Island runway takeoff"
                },
                playerCharacter:"PILOT",
                loadZones:[zoneData.TERRAIN_ZONES.start],
                loadLevels:[zoneLevels.ZONES.start],
                loadPlayer:zoneData.TERRAIN_ZONES.start,
                loadVehicles:[[zoneData.SPAWN_POINTS.cougar]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    environment:gameConfig.GOO_PROJECTS.environment,
                    houses:gameConfig.GOO_PROJECTS.houses,
                    house_t:gameConfig.GOO_PROJECTS.house_t,
                    cougar_f9f:gameConfig.GOO_PROJECTS.cougar_f9f,
                    nature:gameConfig.GOO_PROJECTS.nature,
                    air_base:gameConfig.GOO_PROJECTS.air_base,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20
                }
            },
            human_pilot:{
                IDENTITY:{
                    title:"Purity of Essence",
                    tagLine:"Intercept the Rogue B-52"
                },
                playerCharacter:"PILOT",
                //    playerCar:"PV_9031",
                loadZones:[zoneData.TERRAIN_ZONES.start, zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.TERRAIN_ZONES.start,
                loadLevels:[zoneLevels.ZONES.start],
                loadVehicles:[[zoneData.SPAWN_POINTS.start, zoneData.SPAWN_POINTS.air_patrol], [], [],[]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    environment:gameConfig.GOO_PROJECTS.environment,
                    houses:gameConfig.GOO_PROJECTS.houses,
                    house_t:gameConfig.GOO_PROJECTS.house_t,
                    draken:gameConfig.GOO_PROJECTS.draken,
                    cougar_f9f:gameConfig.GOO_PROJECTS.cougar_f9f,
                    car_pv_9031:gameConfig.GOO_PROJECTS.car_pv_9031,
                    nature:gameConfig.GOO_PROJECTS.nature,
                    stratofortress:gameConfig.GOO_PROJECTS.stratofortress,
                    air_base:gameConfig.GOO_PROJECTS.air_base,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20
                }
            },

            battleship_battle: {
                IDENTITY:{
                    title:"Fleet Battle",
                    tagLine:"A fleet of ships are battling it out at the island."
                },
                playerCharacter:"PILOT",
                loadZones:[zoneData.TERRAIN_ZONES.start, zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.TERRAIN_ZONES.start,
                loadLevels:[zoneLevels.ZONES.start],
                loadVehicles:[[zoneData.SPAWN_POINTS.air_base, zoneData.SPAWN_POINTS.tunnan, zoneData.SPAWN_POINTS.practice_range, zoneData.SPAWN_POINTS.battleship_assault, zoneData.SPAWN_POINTS.carrier], []],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    houses:gameConfig.GOO_PROJECTS.houses,
                //    house_t:gameConfig.GOO_PROJECTS.house_t,
                    tre_kronor:gameConfig.GOO_PROJECTS.tre_kronor,
                    battleship:gameConfig.GOO_PROJECTS.battleship,
                    carrier:gameConfig.GOO_PROJECTS.carrier,
                    tunnan:gameConfig.GOO_PROJECTS.tunnan,
                    nature:gameConfig.GOO_PROJECTS.nature,
                    air_base:gameConfig.GOO_PROJECTS.air_base,
                    top_base:gameConfig.GOO_PROJECTS.top_base,
                    harbor:gameConfig.GOO_PROJECTS.harbor,

                    hilltop_base:gameConfig.GOO_PROJECTS.hilltop_base,
                    elevator:gameConfig.GOO_PROJECTS.elevator,
                    targets:gameConfig.GOO_PROJECTS.targets,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20,
                    environment:gameConfig.GOO_PROJECTS.environment
                }
            },

            b52_chase: {
                IDENTITY:{
                    title:"B-52 Chase",
                    tagLine:"Chase the B-52"
                },
                playerVehicle:"DRAKEN",
                loadZones:[zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.FREEFLIGHT_ZONES.ocean,
                loadVehicles:[[zoneData.SPAWN_POINTS.air_patrol]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    draken:gameConfig.GOO_PROJECTS.draken,
                    stratofortress:gameConfig.GOO_PROJECTS.stratofortress,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20
                }
            },

            three_world_islands: {
                IDENTITY:{
                    title:"Tri Isles",
                    tagLine:"Explore the three islands "
                },
                playerVehicle:"TUNNAN",
                loadZones:[zoneData.TERRAIN_ZONES.start, zoneData.TERRAIN_ZONES.peak, zoneData.TERRAIN_ZONES.cove, zoneData.FREEFLIGHT_ZONES.ocean],
                loadPlayer:zoneData.TERRAIN_ZONES.start,
                loadVehicles:[[zoneData.SPAWN_POINTS.start, zoneData.SPAWN_POINTS.battleship_assault], [], [],[]],
                loadProjects:{
                    human:gameConfig.GOO_PROJECTS.human,
                    tre_kronor:gameConfig.GOO_PROJECTS.tre_kronor,
                    battleship:gameConfig.GOO_PROJECTS.battleship,
                    tunnan:gameConfig.GOO_PROJECTS.tunnan,
                    cougar_f9f:gameConfig.GOO_PROJECTS.cougar_f9f,
                    draken:gameConfig.GOO_PROJECTS.draken,
                    car_pv_9031:gameConfig.GOO_PROJECTS.car_pv_9031,
                    nature:gameConfig.GOO_PROJECTS.nature,
                    bullet_20:gameConfig.GOO_PROJECTS.bullet_20


                }
            }
        }
    }
});