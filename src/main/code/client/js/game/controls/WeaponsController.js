"use strict";

define(["application/EventManager",
	"3d/GooJointAnimator",
	'data_pipeline/PipelineAPI',
	'game/weapons/WeaponData',
	"game/weapons/PlaneCannon",
	"game/weapons/MissilePod"
], function(
	event,
	GooJointAnimator,
	PipelineAPI,
	WeaponData,
	PlaneCannon,
	MissilePod
	) {


    var buildSystem = function(entity, weaponData) {
		var weaponSystem = {
			weaponData:weaponData,
			cannons:[],
			missiles:[],
			locked:false
		};

		for (var index in weaponData.controls) {
			for (var i = 0; i < weaponData[index].length; i++) {
				if (index == "cannons") {
					weaponSystem[index].push(new PlaneCannon(entity, weaponData[index][i].data, weaponData[index][i], weaponData[index][i].bulletData))
				}

				if (index == "missiles") {
					weaponSystem[index].push(new MissilePod(entity, weaponData[index][i].data, weaponData[index][i], weaponData[index][i].bulletData))
				}

			//	cannons.push(new PlaneCannon(entity, weaponData[index][i].data, weaponData[index][i], weaponData[index][i].bulletData))
			}
		}

		return weaponSystem;

    };

    var updateTriggerBones = function(entity, bones, controlState) {
        for (var i = 0; i < bones.length; i++) {
                 for (var index in bones[i]) {
                     var boneId = entity.pieceData.boneMap[index];
                     var bone = entity.animationChannels[boneId];
                     GooJointAnimator.rotateBone(bone, bones[i][index]*controlState)
                 }


        }
    };

    var updateTriggerLights = function(entity, lights, controlState) {
        console.log("Trigger lights: ", lights, controlState)
        for (var i = 0; i < lights.length; i++) {
            var boneId = entity.lights[lights[i]].setIntensity(controlState);
        }
    };

    var applyControlStateToWeapons = function(entity, value, control) {
             console.log("Update Weapon CTRL", value, control)
        if (value == undefined) value = 0;


		         var weapons = entity.systems.weapons[control];

        for (var i = 0; i < weapons.length; i++) {

            var weapon = weapons[i];
            if (weapon.currentState == value) value = 0;
            value = weapon.updateTriggerState(value, i, weapons.length);
        }

        return value;

    };

    var updateWeaponState = function(entity, weapon) {
        var cannons = entity.systems.weapons.cannons;
        for (var i = 0; i < cannons.length; i++) {
            var current = cannons[i].currentState
        }
        if (current == engine.currentState) return;
        if (entity.isPlayer) {
            event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"weapons", currentState:current})
        }
		entity.pieceInput.setAppliedState("weapons", current);
    };

     var processControlState = function() {

     };


    return {
        processControlState:processControlState,
        applyControlStateToWeapons:applyControlStateToWeapons,
        updateWeaponState:updateWeaponState,
        buildSystem:buildSystem
    }
});
