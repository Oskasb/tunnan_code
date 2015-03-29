"use strict";

define(["application/EventManager",
	"game/controls/SurfaceController",
	"game/controls/FlapsController",
	"game/controls/BreaksController",
	"game/controls/EngineController",
	"game/controls/GearController",
	"game/controls/DriveController",
	"game/controls/CanopyController",
	"game/controls/EjectionSeatController",
	"game/controls/WeaponsController",
	"game/controls/TrimController"
],
	function(
		event,
		surfaceController,
		flapsController,
		breaksController,
		engineController,
		gearController,
		driveController,
		canopyController,
		ejectionSeatController,
		weaponsController
		) {

		var getControlUpdateCallback = function(control) {
			switch (control) {
				case "trim_elevator":
					return function(entity, value, control) {
						return surfaceController.applyTrimStateToSurface(entity, value, "elevator");
					};

					break;
				case "trim_rudder":

					return function(entity, value, control) {
						return surfaceController.applyTrimStateToSurface(entity, value, "rudder");
					};


					break;
				case "trim_aeilrons":
					return function(entity, value, control) {
						return surfaceController.applyTrimStateToSurface(entity, value, "aeilrons");
					};
					break;
				case 'elevator':
				case 'rudder':
				case 'aeilrons':
				case 'flaps':
				case 'wing_sweep':
					return function(entity, value, control) {
						return surfaceController.applyControlStateToSurface(entity, value, control);
					};
					break;
				case "breaks":
					return function(entity, value, control) {
						breaksController.applyControlStateToBreaks(entity, value);
						return surfaceController.applyControlStateToSurface(entity, value, control);
					};

					break;
				case "throttle":
					return function(entity, value, control) {
						return engineController.applyControlStateToEngines(entity, value)
					};

					break;
				case "cannons":
				case "missiles":
					return function(entity, value, control) {

						value = weaponsController.applyControlStateToWeapons(entity, value, control);
						event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:control, currentState:value})
					};

					break;
				case "gears":
					return function(entity, value, control) {
						if (value) {
							gearController.setEntityGearTargetState(entity, !entity.systems.gears.targetState);

						}

					};

					break;
				case "canopy":
					return function(entity, value, control) {
						if (value) canopyController.setEntityCanopyTargetState(entity, !entity.systems.canopy.targetState);
					};



					break;
				case "eject":
					return function(entity, value, control) {
						if (value) ejectionSeatController.fireEjectionSeat(entity);
					};

					break;

				case "wing_smoke":
					return function(entity, value, control) {
						if (entity.pieceInput.getAppliedState(control) == 1) value = 0;
						entity.pieceInput.setAppliedState(control, value)
					};

					break;
				case "debug_mechanics":
				case "auto_trim":
					return function(entity, value, control) {
						if (entity.pieceInput.controls[control].value == value) value = 0;
						event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:control, currentState:value})
					};
					break;
				case "reset_trim":
					return function(entity, value, control) {
						surfaceController.zeroSurfaceTrimState(entity, "aeilrons");
						surfaceController.zeroSurfaceTrimState(entity, "elevator");
						surfaceController.zeroSurfaceTrimState(entity, "rudder");
					};


					break;
				case "screen_intensity":
					return function(entity, value, control) {
						entity.screenSystem.setMasterIntensity(value);
					};

					break;
				case "hud_intensity":
					return function(entity, value, control) {
						entity.screenSystem.displays.hud.setIntensity(value);
					};

					break;
				case "hdd_intensity":
					return function(entity, value, control) {
						for (var index in entity.screenSystem.displays) {
							if (index != 'hud') entity.screenSystem.displays[index].setIntensity(value);
						}
					};

					break;
				case 'cockpit_lights':
					return function(entity, value, control) {
						entity.lightSystems.cockpit.setMasterIntensity(value);
					};

					break;
				case 'cockpit_mode':
					return function(entity, value, control) {
						entity.lightSystems.cockpit.setMode(value);
					};

					break;
				case 'formation_lights':
					return function(entity, value, control) {
						entity.lightSystems.formation.setMasterIntensity(value);
					};

					break;
				case 'formation_mode':
					return function(entity, value, control) {
						entity.lightSystems.formation.setMode(value);
					};

					break;
				case 'position_lights':
					return function(entity, value, control) {
						entity.lightSystems.position.setMasterIntensity(value);
					};

					break;
				case 'sound_channel':
					return function(entity, value, control) {
						console.log("Sound Channel Level: ", entity, value, control)
					};

					break;
				case 'position_mode':
					return function(entity, value, control) {
						entity.lightSystems.position.setMode(value);
					};

					break;
				case 'taxi_lights':
					return function(entity, value, control) {
						entity.lightSystems.taxi.setMasterIntensity(value);
					};

					break;
				case 'taxi_mode':
					return function(entity, value, control) {
						entity.lightSystems.taxi.setMode(value);
					};

					break;
				case 'collision_lights':
					return function(entity, value, control) {
						entity.lightSystems.collision.setMasterIntensity(value);
					};

					break;
				case 'collision_mode':
					return function(entity, value, control) {
						entity.lightSystems.collision.setMode(value);
					};
					break;
				default:
					return function(entity, value, control) {
						if (entity.pieceInput.readControlValue(control) == 1) value = 0;
						event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:control, currentState:value})
					};
					break;
			}
		};

		return {
			getControlUpdateCallback:getControlUpdateCallback
		}
	});
