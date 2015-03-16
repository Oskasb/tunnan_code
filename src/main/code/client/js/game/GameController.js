"use strict";

define(["application/Settings",
		"application/EventManager",
		'goo/entities/SystemBus',
	"gui/CanvasGuiAPI",
	"application/Sequencer",
	"3d/SceneController",
	"game/PieceController",
	"game/EntityController",
	"game/combat/CombatSystem",
	"game/GameUiCallbacks",
	"game/GuiStateTransitionCallbacks",
	'io/PointerInputHandler',
	'gui/GuiWidgetComposer',
	'3d/GooEffectController',
	'data_pipeline/PipelineAPI',
		"sound/MusicPlayer"
],
    function(
		Settings,
		event,
		SystemBus,
             CanvasGuiAPI,
			 Sequencer,
			 SceneController,
			 pieceController,
			 entityController,
			 CombatSystem,
			 GameUiCallbacks,
			 GuiStateTransitionCallbacks,
			 PointerInputHandler,
			 GuiWidgetComposer,
			 GooEffectController,
			 PipelineAPI,
			MusicPlayer
		) {

	    var useDebugGui = true;

	    var ready = false;

		var GameController = function() {
			this.musicPlayer = new MusicPlayer();
			this.sequencer = new Sequencer();
			this.sceneController = new SceneController();
			this.canvasGuiAPI = new CanvasGuiAPI(1024);
		//	this.pointerInputHandler = new PointerInputHandler(this.canvasGuiAPI.getPointerCursor());
			this.guiWidgetComposer = new GuiWidgetComposer();
		};

	    GameController.prototype.tickGui = function(tpf) {
	//	    PipelineAPI.updateDataPipeline(time);
		    if (!ready) return;
		//    this.pointerInputHandler.tickInput(time);
			this.canvasGuiAPI.updateCanvasGui(tpf);
			this.musicPlayer.updateMusicPlayer(tpf);
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

			if (state == "main_menu") {
				SystemBus.emit('enterMusicState', {musicState:'main_menu'})
			}

			if (useDebugGui) {
				this.canvasGuiAPI.attachUiSubstateId('debug_state');
			}

		};

		GameController.prototype.setupGuiStateTransitionCallbacks = function(callbacks) {
			for (var index in callbacks) {
				this.canvasGuiAPI.addGuiStateTransitionCallback(index, callbacks[index])
			}
		};

		GameController.prototype.setupGuiSettingControls = function() {
			var guiApi = this.canvasGuiAPI;
			var setGuiTextureScale = function(value) {
				console.log(" ------------------ GUI", value)
				guiApi.setGuiTextureScale(value);
			}.bind(this);
			Settings.addOnChangeCallback('display_ui_pixel_scale', setGuiTextureScale);
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

				this.setupGuiStateTransitionCallbacks(GuiStateTransitionCallbacks);

				this.setupGuiSettingControls();

				this.setGuiState('load_page');
				event.registerListener(event.list().SET_PLAYER_CONTROLLED_ENTITY, handleSetControlledEntity);
			}.bind(this);

			var fail = function(err) {
				console.log("Gui failed to init: ", err)
			};

			var initGui = function() {
				this.canvasGuiAPI.initCanvasGui(guiRegUrl, camera, GameUiCallbacks.getCallbackMap(), ok, fail);
			}.bind(this);

			if(PipelineAPI.checkReadyState()) {
				Settings.loadSettingConfigs();
				initGui()
			} else {
				PipelineAPI.addReadyCallback(initGui);
			}



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


		GameController.prototype.gameLoadingCompleted = function() {
			GooEffectController.initFxPlayer();
			this.setGuiState('main_menu');
		};

        return GameController

    });
