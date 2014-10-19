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
    "game/controls/TrimController",
	"game/controls/HookController",
    "game/planes/Contrails",
    "game/GameConfiguration",
	'game/controls/ControlStateCallbacks'
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
        weaponsController,
        trimController,
		HookController,
        contrails,
        gameConfig,
		ControlStateCallbacks
		) {

        var systemControllers = {
            auto_trim:trimController,
            engines  :engineController,
            drive    :driveController,
            gears    :gearController,
            canopy   :canopyController,
            seat     :ejectionSeatController,
            breaks   :breaksController,
            weapons  :weaponsController,
			hook	 :HookController
        };


    var addSystemsToEntity = function(gamePiece, systemData, state) {
        gamePiece.systems = {};
		for (var i = 0; i < systemData.length; i++) {
            gamePiece.systems[systemData[i].id] = systemControllers[systemData[i].id].buildSystem(gamePiece, systemData[i], state);

			for (var key in systemData[i].pieceInput) {
				gamePiece.pieceInput.addPieceControl(key, systemData[i].pieceInput[key].value, ControlStateCallbacks.getControlUpdateCallback(key))
			}

        }
    };

    var addSurfacesToEntity = function(entity, surfaceData) {
        entity.surfaces = {};
        for (var i = 0; i < surfaceData.length; i++) {
            console.log("ADD SURFACE: ", surfaceData[i].id, surfaceData[i]);
            entity.surfaces[surfaceData[i].id] = surfaceController.buildSurface(surfaceData[i])
        }
    };

    var buildPieceControls = function(entity, data, landed) {
        var state = 0;
        if (landed) state = 1;
        entity.pieceData = data;

        addSystemsToEntity(entity, data, state);
        addSurfacesToEntity(entity, data.surfaces);

    //    console.log("------>> Build Piece: ", entity)
    };


    var configurePlaneBones = function(entity) {
        var nodes = {};

        var parseNode = function(node) {
            if (!node.getChildren) return;
            var children = node.getChildren();
            for (var i = 0; i < children.length; i++) {
                appendNode(node.children[i])
            }
        };

        var appendNode = function(node) {
            if (node.name) nodes[node.name] = node;
            node.baseRotMatrix = node.getRotMatrix();
            node.basePos = [parseFloat(node.getLocX()), parseFloat(node.getLocY()), parseFloat(node.getLocZ())];
            parseNode(node);
        };

        parseNode(entity.collada);
        entity.pieceData.bones = nodes;
        console.log(nodes)
    };

    var updateAutoTrim = function(gamePiece, time) {

        if (gamePiece.pieceInput.controls['auto_trim'].value) {
            if (!gamePiece.pieceInput.controls["elevator"].update) {
                var pitchTorque = gamePiece.forces.torque[0]* gameConfig.RENDER_SETUP.physicsFPS * time;
                var trimMagnitude =  pitchTorque  * Math.abs(Math.max(0, 1 - (gamePiece.surfaces.elevator.currentState*0.5)));
                surfaceController.applyTrimStateToSurface(gamePiece, trimMagnitude, "elevator");
            //    event.fireEvent(event.list().PLAYER_CONTROL_STATE_UPDATE, {control:"auto_trim", currentState:Math.max(gamePiece.elevator.trimState*15)})
            }
        }
    };

    var applyInputStateToControls = function(gamePiece, time, groundProximity) {
        for (var index in gamePiece.pieceInput.controls) {
            if (gamePiece.pieceInput.controls[index].update) {
				gamePiece.pieceInput.controls[index].onChange(gamePiece, gamePiece.pieceInput.controls[index].value, index);
		//		gamePiece.controls[index].value = gamePiece.pieceInput.controls[index].value;

			}
			if (index == 'auto_trim') {
				updateAutoTrim(gamePiece, time);
			}
			gamePiece.pieceInput.controls[index].update = false;
            if (index == "wing_smoke" && gamePiece.pieceInput.getAppliedState(index) == 1) {
				contrails.puffWingSmoke(gamePiece);
			}
        //    if (gamePiece.controls[index].value != gamePiece.planeInput[index].value) changeControlState(gamePiece, index, gamePiece.planeInput[index].value);


		}

        applyControlStateToPlane(gamePiece, time, groundProximity);
    };


    var applyControlStateToPlane = function(gamePiece, time, groundProximity) {
        surfaceController.processControlState(gamePiece);
        for (var system in gamePiece.systems) {
            systemControllers[system].processControlState(gamePiece, groundProximity)
        }
    };

    return {
        buildPieceControls:buildPieceControls,
        configurePlaneBones:configurePlaneBones,
        applyInputStateToControls:applyInputStateToControls,
		addSurfacesToEntity:addSurfacesToEntity,
		addSystemsToEntity:addSystemsToEntity
    }
});
