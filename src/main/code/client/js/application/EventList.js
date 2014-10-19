"use strict";

define(function() {
    var func = function(){};
    return {
        LOAD_PROGRESS:{type:"LOAD_PROGRESS", eArgs:{started:0, completed:0, errors:0, id:""}},
        LOADING_COMPLETED:{type:"LOADING_COMPLETED", eArgs:{started:0, completed:0, errors:0}},
        LOAD_3D:{type:"LOAD_3D", eArgs:{}},
		UN_LOAD_3D:{type:"UN_LOAD_3D", eArgs:{callback:func}},
        GOO_TICK:{type:"GOO_TICK", eArgs:{tpf:0}},
        LOAD_JSON:{type:"LOAD_JSON", eArgs:{callback:function(){}, url:""}},
		LOAD_GOO_PROJECT:{type:"LOAD_GOO_PROJECT", eArgs:{callback:function(){}, folder:'', projectPath:'', entityIds:[]}},
        LOAD_UI_TEMPLATE:{type:"LOAD_UI_TEMPLATE", eArgs:{templateId:"", callback:func}},
        UNLOAD_UI_TEMPLATE:{type:"UNLOAD_UI_TEMPLATE", eArgs:{templateId:"", callback:func}},
        CLIENT_SETUP_OK:{type:"CLIENT_SETUP_OK", eArgs:{}},
        REGISTER_SPRITE:{type:"REGISTER_SPRITE", eArgs:{elementId:""}},
        GOT_GAME_CONFIGURATION:{type:"GOT_GAME_CONFIGURATION", eArgs:{gameConfig:{}}},
        MENU_NAVIGATE:{type:"MENU_NAVIGATE", eArgs:{destination:"", elementId:""}},

        RENDER_TICK:{type:"RENDER_TICK", eArgs:{frameTime:0, lastFrameDuration:0}},
        POST_UPDATE:{type:"POST_UPDATE", eArgs:{}},
        WINDOW_RESIZED:{type:"WINDOW_RESIZED", eArgs:{}},
        SEQUENCE_CALLBACK:{type:"SEQUENCE_CALLBACK", eArgs:{callback:function(){}, wait:0}},
        ANALYTICS_EVENT:{type:"ANALYTICS_EVENT", eArgs:{category:"", action:"", labels:"", value:0}},


        SET_ELEMENT_TEXT:{type:"SET_ELEMENT_TEXT", eArgs:{elementId:"", data:{}, propertyId:""}},
        LAYOUT_LINES:{type:"LAYOUT_LINES", eArgs:{elementId:"", data:{}}},
        LAYOUT_RADIO_BUTTONS:{type:"LAYOUT_RADIO_BUTTONS", eArgs:{elementId:"", data:{}, property:"", onClick:function(){}}},

        SET_SETTING_INDEX:{type:"SET_SETTING_INDEX", eArgs:{elementId:"", settingId:"", properties:{}}},
        ENABLE_SETTING_VALUE:{type:"ENABLE_SETTING_VALUE", eArgs:{settingId:"", values:{}}},
        REGISTER_SETTING:{type:"REGISTER_SETTING", eArgs:{elementId:"", settingId:"", properties:{}}},

        PAUSE_UPDATES:{type:"PAUSE_UPDATES", eArgs:{}},
        UNPAUSE_UPDATES:{type:"UNPAUSE_UPDATES", eArgs:{}},
        FETCH_TIME:{type:"FETCH_TIME", eArgs:{callback:function(){}}},

        CLIENT_READY:{type:"CLIENT_READY", eArgs:{}},
        ENINGE_READY:{type:"ENINGE_READY", eArgs:{goo:{}}},
        LOADING_ENDED:{type:"LOADING_ENDED", eArgs:{}},
        RESTART_GAME_BOARD:{type:"RESTART_GAME_BOARD", eArgs:{}},
        OPEN_UI_PAGE:{type:"OPEN_UI_PAGE", eArgs:{page:"", parentId:""}},
        CLOSE_OVERLAY:{type:"CLOSE_OVERLAY", eArgs:{elementId:""}},


        TEST_EVENT:{type:"TEST_EVENT", eArgs:{msg:""}},
        START_POINTER_DRAG:{type:"START_POINTER_DRAG", eArgs:{xy:[]}},
        STOP_POINTER_DRAG:{type:"STOP_POINTER_DRAG", eArgs:{xy:[]}},
        START_CAMERA_DRAG:{type:"START_CAMERA_DRAG", eArgs:{xy:[]}},
        STOP_CAMERA_DRAG:{type:"STOP_CAMERA_DRAG", eArgs:{}},
        FETCH_DRAG_DELTA:{type:"FETCH_DRAG_DELTA", eArgs:{callback:function() {}, xy:[]}},



        CLEAR_ALL_VALUE_ELEMENTS:{type:"CLEAR_ALL_VALUE_ELEMENTS", eArgs:{}},
        REGISTER_STATE_LIGHT:{type:"REGISTER_STATE_LIGHT", eArgs:{elementId:"", control:""}},
        REGISTER_STATE_LEVER:{type:"REGISTER_STATE_LEVER", eArgs:{elementId:"", control:""}},
        REGISTER_STATE_VALUE:{type:"REGISTER_STATE_VALUE", eArgs:{elementId:"", value:""}},
		REGISTER_STATE_LEVER_TARGET:{type:"REGISTER_STATE_LEVER_TARGET", eArgs:{elementId:"", control:""}},
        REGISTER_STATE_AXIS:{type:"REGISTER_STATE_AXIS", eArgs:{elementId:"", control:"", axis:""}},
        PLAYER_VALUE_UPDATE:{type:"PLAYER_VALUE_UPDATE", eArgs:{value:"", amount:0}},

        STICK_INPUT:{type:"STICK_INPUT", eArgs:{xy:[]}},
        MOUSE_ACTION:{type:"MOUSE_ACTION", eArgs:{action:[], xy:[]}},
        MOUSE_WHEEL_UPDATE:{type:"MOUSE_WHEEL_UPDATE", eArgs:{delta:0}},
        MOUSE_POSITION_UPDATE:{type:"MOUSE_POSITION_UPDATE", eArgs:{xy:[]}},
        ADD_KEYBINDINGS:{type:"ADD_KEYBINDINGS", eArgs:{bindings:{}}},
        CLEAR_KEYBINDINGS:{type:"CLEAR_KEYBINDINGS", eArgs:{bindings:{}}},
        UPDATE_KEYBINDING:{type:"UPDATE_KEYBINDING", eArgs:{control:"", value:0}},

        POP_SPHERE:{type:"POP_SPHERE", eArgs:{}},
        USE_NEAREST_ENTITY:{type:"USE_NEAREST_ENTITY", eArgs:{}},
        EXIT_CONTROLLED_ENTITY:{type:"EXIT_CONTROLLED_ENTITY", eArgs:{callback:func}},
        PILOT_VEHICLE:{type:"PILOT_VEHICLE", eArgs:{pilot:{}, vehicle:{}, callback:func}},
        SET_PLAYER_CONTROLLED_ENTITY:{type:"SET_PLAYER_CONTROLLED_ENTITY", eArgs:{entity:[], callback:func}},
        PLAYER_MOVE_TO_POINT:{type:"PLAYER_MOVE_TO_POINT", eArgs:{pos:[]}},
        PLAYER_MOVEMENT_INPUT:{type:"PLAYER_MOVEMENT_INPUT", eArgs:{movestate:"", turnSpeed:0}},
        PLAYER_CONTROL_EVENT:{type:"PLAYER_CONTROL_EVENT", eArgs:{control:"", value:0}},



        INIT_PLAYER_CONTROL_STATE:{type:"INIT_PLAYER_CONTROL_STATE", eArgs:{control:"", controlState:0}},

        PLAYER_CONTROL_STATE_UPDATE:{type:"PLAYER_CONTROL_STATE_UPDATE", eArgs:{control:"", currentState:0}},
        SET_CAMERA_TARGET:{type:"SET_CAMERA_TARGET", eArgs:{spatial:{}, geometry:{}, controlScript:""}},
		SET_CAMERA_ANALOGS:{type:"SET_CAMERA_ANALOGS", eArgs:{rotX:0, rotY:0, rotZ:0}},

        SPAWN_PHYSICAL:{type:"SPAWN_PHYSICAL", eArgs:{pos:[], callback:function(){}}},

        UPDATE_ENTITY_SPATIAL:{type:"UPDATE_PLAYER_SPATIAL", eArgs:{entityId:"", spatial:{}}},

		START_SCENARIO_ID:{type:"START_SCENARIO_ID", eArgs:{scenarioId:""}},
        SCENARIO_SELECTED:{type:"SCENARIO_SELECTED", eArgs:{scenario:{}}},
        SCENARIO_LOADED:{type:"SCENARIO_LOADED", eArgs:{callback:func}},
		EXIT_SCENARIO:{type:"EXIT_SCENARIO", eArgs:{}},

        ADD_GAME_ENTITY:{type:"ADD_GAME_ENTITY", eArgs:{entityId:"", type:"", callback:function(){}}},
        FETCH_LEVEL_ENTITY:{type:"FETCH_LEVEL_ENTITY", eArgs:{entityId:"", type:"", pos:[], callback:function(){}}},
        DAMAGE_ENTITY:{type:"DAMAGE_ENTITY", eArgs:{entity:{}, damage:0}},
        REMOVE_GAME_ENTITY:{type:"REMOVE_GAME_ENTITY", eArgs:{entityId:"", callback:function(){}}},

        LOAD_GOO_MESH:{type:"LOAD_GOO_MESH", eArgs:{modelUrl:"", callback:function(){}}},
        LOAD_GOO_SKELETON:{type:"LOAD_GOO_SKELETON", eArgs:{skeletonUrl:"", callback:function(){}}},
        LOAD_GOO_MATERIAL:{type:"LOAD_GOO_MATERIAL", eArgs:{materialUrl:"", callback:function(){}}},
        LOAD_GOO_TEXTURE:{type:"LOAD_GOO_TEXTURE", eArgs:{textureUrl:"", callback:function(){}}},
        LOAD_GOO_SHADER:{type:"LOAD_GOO_SHADER", eArgs:{shaderFiles:{}, shaderId:"", callback:function(){}}},

        REGISTER_GOO_MESH:{type:"REGISTER_GOO_MESH", eArgs:{url:"", mesh:""}},
        REGISTER_GOO_SKELETON:{type:"REGISTER_GOO_SKELETON", eArgs:{url:"", skeleton:""}},
        REGISTER_GOO_MATERIAL:{type:"REGISTER_GOO_MATERIAL", eArgs:{url:"", material:""}},
        REGISTER_GOO_TEXTURE:{type:"REGISTER_GOO_TEXTURE", eArgs:{url:"", texture:{}}},
        REGISTER_GOO_SHADER:{type:"REGISTER_GOO_SHADER", eArgs:{shaderId:"", type:"", data:""}},

        BUILD_GOO_GAMEPIECE:{type:"BUILD_GOO_GAMEPIECE", eArgs:{projPath:"", modelPath:"", callback:function(){}}},
        BUILD_GOO_PRIMITIVE:{type:"BUILD_GOO_PRIMITIVE", eArgs:{parentGooEntity:{}, shape:"", pos:{}, rot:{}, size:{}, color:[], callback:function(){}}},
        BUILD_GOO_PARTICLES:{type:"BUILD_GOO_PARTICLES", eArgs:{parentGooEntity:{}, systemParams:{}, emitFunctions:{}, callback:function(){}}},


        SET_ENVIRONMENT:{type:"SET_ENVIRONMENT", eArgs:{fogColor:[], sunLight:[], ambientLight:[], sunDir:[], skyColor:[], fogDistance:[]}},
        SET_EFFECT_PARAMETER:{type:"SET_EFFECT_PARAMETER", eArgs:{effect:"", parameter:"", value:0}},
        SPLASH_WATER:{type:"SPLASH_WATER", eArgs:{pos:[], count:0, dir:[]}},
        FLASH_SHOCKWAVE:{type:"FLASH_SHOCKWAVE", eArgs:{pos:[], count:0, dir:[]}},
        FLASH_SPARKS:{type:"FLASH_SPARKS", eArgs:{pos:[], count:0, dir:[]}},
        PUFF_BLACK_SMOKE:{type:"PUFF_BLACK_SMOKE", eArgs:{pos:[], count:0, dir:[]}},
        PUFF_WHITE_SMOKE:{type:"PUFF_WHITE_SMOKE", eArgs:{pos:[], count:0, dir:[]}},
        PUFF_SMALL_WHITE:{type:"PUFF_SMALL_WHITE", eArgs:{pos:[], count:0, dir:[]}},
        PUFF_RAPID_WHITE:{type:"PUFF_RAPID_WHITE", eArgs:{pos:[], count:0, dir:[]}},
        PUFF_CLOUD_VAPOR:{type:"PUFF_CLOUD_VAPOR", eArgs:{pos:[], count:0, dir:[]}},
        ACROBATIC_SMOKE:{type:"ACROBATIC_SMOKE", eArgs:{pos:[], count:0, dir:[]}},
        FLASH_MUZZLE_FIRE:{type:"FLASH_MUZZLE_FIRE", eArgs:{pos:[], count:0, dir:[]}},
        SPLASH_RINGLET:{type:"SPLASH_RINGLET", eArgs:{pos:[], count:0, dir:[]}},
        SPLASH_FOAM:{type:"SPLASH_FOAM", eArgs:{pos:[], count:0, dir:[]}},

        LOAD_MODEL_URL:{type:"LOAD_MODEL_URL", eArgs:{modelUrl:"", callback:function(){}}},

		ACTIVATE_GOO_ENTITY:{type:"ACTIVATE_GOO_ENTITY", eArgs:{gooEntity:{}, gameEntity:{}}},
		REGISTER_ACTIVE_ENTITY:{type:"REGISTER_ACTIVE_ENTITY", eArgs:{entity:{}}},
        UPDATE_ACTIVE_ENTITIES:{type:"UPDATE_ACTIVE_ENTITIES", eArgs:{frameTime:0}},
		UPDATE_GAMEPIECE_EFFECTS:{type:"UPDATE_GAMEPIECE_EFFECTS", eArgs:{tpf:0}},

        UPDATE_ENVIRONMENT:{type:"UPDATE_ENVIRONMENT", eArgs:{envVars:{}}},

        SPAWN_CLOUDS:{type:"SPAWN_CLOUDS", eArgs:{pos:[], size:[], intensity:0}},

        SLIDE_OVERLAY_UP:{type:"SLIDE_OVERLAY_UP", eArgs:{elementId:""}},
        SLIDE_OVERLAY_IN:{type:"SLIDE_OVERLAY_IN", eArgs:{elementId:""}},


        FETCH_SOUND:{type:"FETCH_SOUND", eArgs:{soundData:{}, callback:func}},
        FETCH_BUFFER:{type:"FETCH_BUFFER", eArgs:{soundData:{}, callback:func}},
        STOP_SOUND:{type:"STOP_SOUND", eArgs:{playId:""}},
        ONESHOT_SOUND:{type:"ONESHOT_SOUND", eArgs:{soundData:{}}},
        START_SOUND_LOOP:{type:"START_SOUND_LOOP", eArgs:{soundData:{}, loopId:"", callback:function(){}}},
        STOP_SOUND_LOOP:{type:"STOP_SOUND_LOOP", eArgs:{loopId:""}},
        SEND_SOUND_TO_REVERB:{type:"SEND_SOUND_TO_REVERB", eArgs:{node:{}}},
        SEND_SOUND_TO_LISTENER:{type:"SEND_SOUND_TO_LISTENER", eArgs:{node:{}}},
        SEND_SOUND_TO_MASTER:{type:"SEND_SOUND_TO_MASTER", eArgs:{node:{}}},
        SEND_SOUND_TO_DESTINATION:{type:"SEND_SOUND_TO_DESTINATION", eArgs:{node:{}}},
        MOVE_AUDIO_LISTENER:{type:"MOVE_AUDIO_LISTENER", eArgs:{pos:[], rot:[], vel:[]}},
        REGISTER_AUDIO_CONTEXT:{type:"REGISTER_AUDIO_CONTEXT", eArgs:{context:{}, model:""}},
        MIX_CHANNEL_VALUE:{type:"MIX_CHANNEL_VALUE", eArgs:{channelId:"", valueId:"", amount:0}},

        ONESHOT_AMBIENT_SOUND:{type:"ONESHOT_AMBIENT_SOUND", eArgs:{soundData:{}, pos:[], vel:[], dir:[]}},
        LOOP_AMBIENT_SOUND:{type:"LOOP_AMBIENT_SOUND", eArgs:{soundData:{}, playId:"", callback:func}},

        UPDATE_FEEDBACK_VALUE:{type:"UPDATE_FEEDBACK_VALUE", eArgs:{elementId:"", number:0, text:""}},


        BROADCAST_VIDEO:{type:"BROADCAST_VIDEO", eArgs:{source:'', channel:''}},
        PLAY_PARTICLE:{type:"PLAY_PARTICLE", eArgs:{effectType:"", duration:0}},
		CONFIGURE_CONTROLLER:{type:"CONFIGURE_CONTROLLER", eArgs:{controllerType:''}},
		OCULUS_RIFT_QUATERNION:{type:"OCULUS_RIFT_QUATERNION", eArgs:{quat:{}}}
    }
});
