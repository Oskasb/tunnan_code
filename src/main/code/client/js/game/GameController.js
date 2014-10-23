"use strict";

define(["application/EventManager",
	"gui/CanvasGuiAPI",
	"application/Sequencer",
	"3d/SceneController",
	"game/PieceController",
	"game/EntityController",
	"game/combat/CombatSystem",
	"game/GameUiCallbacks",
	'io/PointerInputHandler',
	'gui/GuiWidgetComposer',
	'data_pipeline/PipelineAPI'
],
    function(event,
             CanvasGuiAPI,
			 Sequencer,
			 SceneController,
			 pieceController,
			 entityController,
			 CombatSystem,
			 GameUiCallbacks,
			 PointerInputHandler,
			 GuiWidgetComposer,
			 PipelineAPI
		) {

	    var useDebugGui = true;

	    var ready = false;

		var GameController = function() {

			this.sequencer = new Sequencer();
			this.sceneController = new SceneController();
			this.canvasGuiAPI = new CanvasGuiAPI(1024, true);
		//	this.pointerInputHandler = new PointerInputHandler(this.canvasGuiAPI.getPointerCursor());
			this.guiWidgetComposer = new GuiWidgetComposer();
		};

	    GameController.prototype.tickGui = function(time) {
	//	    PipelineAPI.updateDataPipeline(time);
		    if (!ready) return;
		//    this.pointerInputHandler.tickInput(time);
			this.canvasGuiAPI.updateCanvasGui(time);
	    };

		GameController.prototype.tickGame = function(time) {
			this.sceneController.viewTick(time);
			pieceController.tickEntities(time);
			this.sequencer.tick(time);
        };


		GameController.prototype.setupGame = function() {
			var flushSequencer = function() {
				this.sequencer.flushQueue();
			}.bind(this);

			event.registerListener(event.list().UN_LOAD_3D, flushSequencer);
        };

		GameController.prototype.setGuiState = function(state) {
			this.canvasGuiAPI.setUiToStateId(state);

			if (useDebugGui) {
				this.canvasGuiAPI.attachUiSubstateId('debug_state');
			}

		};

		GameController.prototype.addCanvasGui = function(camera, guiRegUrl) {

			var handleSetControlledEntity = function(e) {
				this.setGuiState('messages_only');
				this.applyPlayerPiece(event.eventArgs(e).entity);

			}.bind(this);

			var ok = function() {
				console.log("Gui init ok!")
				setTimeout(function() {
					ready = true;
				}, 200)

				this.setGuiState('init_app_state');
				event.registerListener(event.list().SET_PLAYER_CONTROLLED_ENTITY, handleSetControlledEntity);
			}.bind(this);

			var fail = function(err) {
				console.log("Gui failed to init: ", err)
			};

			this.canvasGuiAPI.initCanvasGui(guiRegUrl, camera, GameUiCallbacks.getCallbackMap(), ok, fail);
		};

	    GameController.prototype.applyPlayerPiece = function(playerPiece) {
		//    this.pointerInputHandler.setPlayerGamePiece(playerPiece);
		//    this.pointerInputHandler.applyGuiWidgets(this.guiWidgetComposer);

		    var pieceConfigUpdated = function(state) {
			    this.setGuiState(state);



		    }.bind(this);

			if ( playerPiece.pieceData.onScreenInput) {
				pieceConfigUpdated( playerPiece.pieceData.onScreenInput.guiMainStateId);
			}
		    };


        return GameController

    });
