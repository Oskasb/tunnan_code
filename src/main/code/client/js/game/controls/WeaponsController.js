"use strict";

define(["application/EventManager", "3d/GooJointAnimator", "game/weapons/PlaneCannon"], function(event, GooJointAnimator, PlaneCannon) {


    var buildWeapon = function(entity, type, weaponData) {
        if (type == "cannons") var weapon = new PlaneCannon(entity, weaponData);
        return weapon;
    };

    var buildSystem = function(entity, weaponData, bulletData) {
        var weapons = [];
        for (var index in weaponData.controls) {
            for (var i = 0; i < weaponData[index].length; i++) {
                weapons.push(buildWeapon(entity, index, weaponData[index][i], bulletData))
            }
        }
        return weapons;
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

    var applyControlStateToWeapons = function(entity, value) {
 //            console.log("Update Weapon CTRL", value)
        if (value == undefined) value = 0;

        for (var weapons in entity.pieceData.systems.weapons.controls) {
            var weapon = entity.pieceData.systems.weapons.controls[weapons];
            for (var triggers in weapon) {
                if (triggers == 'bones') updateTriggerBones(entity, weapon[triggers], value);
                if (triggers == 'lights') updateTriggerLights(entity, weapon[triggers], value);
            }
        }

        var weapons = entity.systems.weapons;
        for (var i = 0; i < weapons.length; i++) {

            var weapon = weapons[i];
            if (weapon.currentState == value) value = 0;
            value = weapon.updateTriggerState(value, i, weapons.length);
        }

        return value;

    };

    var updateWeaponState = function(entity, weapon) {
        var weapons = entity.systems.weapons;
        for (var i = 0; i < weapons.length; i++) {
            var current = weapons[i].currentState
            var engine = weapons[i];
            //    updateEngineThrust(engine, entity);
            engine.updateThrust(entity.air.density);
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
