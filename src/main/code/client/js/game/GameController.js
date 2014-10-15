"use strict";

define(["application/EventManager",
	"gui/CanvasGuiMain",
	"application/Sequencer",
	"3d/SceneController",
	"game/PieceController",
	"game/EntityController",
	"game/combat/CombatSystem",
	"game/GameUiCallbacks",
	'io/PointerInputHandler',
	'gui/GuiWidgetComposer',
	'data_pipeline/data/ConfigCache'
],
    function(event,
			 CanvasGuiMain,
			 Sequencer,
			 SceneController,
			 pieceController,
			 entityController,
			 CombatSystem,
			 GameUiCallbacks,
			 PointerInputHandler,
			 GuiWidgetComposer,
			 ConfigCache
		) {

	    var useDebugGui = true;
	    var guiRegUrl = 'configs/config_urls.json';
	    var ready = false;

		var GameController = function() {
			this.sequencer = new Sequencer();
			this.sceneController = new SceneController();

			this.pointerInputHandler = new PointerInputHandler();
			this.guiWidgetComposer = new GuiWidgetComposer();
		};

	    GameController.prototype.tickGui = function(time) {
			ConfigCache.tickDataPipeline(time);
		    if (!ready) return
		    this.pointerInputHandler.tickInput(time);
		    if (this.canvasGuiMain) {
			    if (this.canvasGuiMain.canvasGuiState) {
				    this.canvasGuiMain.tickGuiMain(time);
			    }

			}
	    };

		GameController.prototype.tickGame = function(time) {
			this.sequencer.tick(time);
			this.sceneController.viewTick(time);
			pieceController.tickEntities(time);
        };


		GameController.prototype.setupGame = function() {
			var flushSequencer = function() {
				this.sequencer.flushQueue();
			}.bind(this);

			event.registerListener(event.list().UN_LOAD_3D, flushSequencer);
        };

		GameController.prototype.setGuiState = function(state) {
			this.canvasGuiMain.setMainUiState(state);
		};

		GameController.prototype.addCanvasGui = function(camera) {
			this.canvasGuiMain = new CanvasGuiMain();
			var handleSetControlledEntity = function(e) {
				this.applyPlayerPiece(event.eventArgs(e).entity);
				if (useDebugGui) {
					this.canvasGuiMain.canvasGuiState.enableDebugGui();
				}
			}.bind(this);

			var ok = function() {
				setTimeout(function() {
					ready = true;
				}, 200)

				this.canvasGuiMain.initCanvasGui(camera, GameUiCallbacks.getCallbackMap());
				this.canvasGuiMain.setMainUiState('init_app_state');
				event.registerListener(event.list().SET_PLAYER_CONTROLLED_ENTITY, handleSetControlledEntity);
			}.bind(this);

			var fail = function(err) {
				console.log("Gui failed to init: ", err)
			};

			this.canvasGuiMain.loadMasterConfig(guiRegUrl, ok, fail);
		};

	    GameController.prototype.applyPlayerPiece = function(playerPiece) {
		    this.pointerInputHandler.setPlayerGamePiece(playerPiece);
		    this.pointerInputHandler.applyGuiWidgets(this.guiWidgetComposer);

		    var pieceConfigUpdated = function(state) {
			    this.canvasGuiMain.setMainUiState(state);
		    }.bind(this);

			if ( playerPiece.pieceData.onScreenInput) {
				pieceConfigUpdated( playerPiece.pieceData.onScreenInput.guiMainStateId);
			}
		    };


        return GameController

    });
