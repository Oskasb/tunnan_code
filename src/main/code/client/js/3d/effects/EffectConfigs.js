define([
	'game/GameConfiguration'
], function(
		GameConfig
	) {
		"use strict";

	var txUrls = {
		flare:GameConfig.PRELOAD_GOO_TEXTURES.dot_particle,
		splash:GameConfig.PRELOAD_GOO_TEXTURES.splash_particle
	};

	var effectIds = {
		white_cloud_puff:'white_cloud_puff',
		white_smoke_stream:'white_smoke_stream',
		splash_water:'splash_water',
		metal_sparks:'metal_sparks',
		explosion:'explosion'
	};


	return {

		effects:[
			{
				"id": effectIds.white_cloud_puff,
				"particles": [
					"white_cloud_puff"
				],
				"sounds": []
			},
			{
				"id": effectIds.white_smoke_stream,
				"particles": [
					"white_smoke_stream"
				],
				"sounds": []
			},
			{
				"id": effectIds.splash_water,
				"particles": [
					"splash_water"
				],
				"sounds": []
			},
			{
				"id": effectIds.metal_sparks,
				"particles": [
					"metal_sparks"
				],
				"sounds": []
			},
			{
				"id": effectIds.explosion,
				"particles": [
					"explosion_fire"
				],
				"sounds": []
			}
		],
		audio:[],
		particles:[
			{
				"id": "white_cloud_puff",
				"texture": GameConfig.PRELOAD_GOO_TEXTURES.smoke_particle,
				"color": [
					0.61,
					0.61,
					0.75,
					0.02
				],
				//	"blending": "additive",
				"size": [
					3214200,
					6214480
				],
				"growth": [
					0,
					10
				],
				"rotation": [
					0,
					350
				],
				"spin": [
					0,
					0
				],
				"gravity": 0,
				"count": 1,
				"spread": 1,
				"strength": 10.1,
				"acceleration": 1,
				"lifespan": [
					26.1,
					155.8
				],
				"poolCount": 2500
			},
			{
				"id": "white_smoke_stream",
				"texture": GameConfig.PRELOAD_GOO_TEXTURES.smoke_particle,
				"color": [
					0.8,
					0.84,
					0.91,
					0.01
				],
				//	"blending": "additive",
				"size": [
					200,
					480
				],
				"growth": [
					4900,
					12400
				],
				"rotation": [
					0,
					360
				],
				"spin": [
					-10,
					10
				],
				"gravity": 0,
				"count": 1,
				"spread": 1,
				"strength": 0.1,
				"acceleration": 1.0007,
				"lifespan": [
					2.1,
					15.8
				],
				"poolCount": 2500
			},
			{
				"id": "splash_water",
				"texture": txUrls.splash,
				"color": [
					0.8,
					0.8,
					0.99,
					1
				],
			//	"blending": "additive",
				"size": [
					1200,
					2280
				],
				"growth": [
					6900,
					7400
				],
				"rotation": [
					0,
					360
				],
				"spin": [
					0,
					0
				],
				"gravity": -4,
				"count": 2,
				"spread": 0.4,
				"strength": 1,
				"acceleration": 0.999,
				"lifespan": [
					1.1,
					1.8
				],
				"poolCount": 500
			},
			{
				"id": "metal_sparks",
				"texture": txUrls.flare,
				"blending": "additive",
				"color": [
					1,
					1,
					1,
					0.8
				],
				"size": [
					20,
					40
				],
				"rotation": [
					0,
					360
				],
				"gravity": -15,
				"count": 15,
				"spread": 0,
				"strength": 1,
				"lifespan": [
					0.05,
					0.1
				],
				"poolCount": 1000,
				"growth": [
					0,
					0
				],
				"spin": [
					0,
					0
				],
				"acceleration": 0.999
			},
			{
				"id": "explosion_fire",
				"texture": txUrls.flare,
				"color": [
					1,
					1,
					0.7,
					1
				],
				"blending": "additive",
				"size": [
					120,
					140
				],
				"growth": [
					900,
					900
				],
				"rotation": [
					0,
					360
				],
				"spin": [
					-150,
					150
				],
				"gravity": 0,
				"count": 7,
				"spread": 0,
				"strength": 1,
				"acceleration": 1,
				"lifespan": [
					0.02,
					0.03
				],
				"poolCount": 12500
			}
		]

	};
});