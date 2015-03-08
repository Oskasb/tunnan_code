"use strict";

define(["game/GameConfiguration"],function(gameConfig){

    var TRACKS = gameConfig.MIX_TRACKS;

    return {
        UI_HOVER        :   {folder:"ui"      ,file:"blipp1"         , gain:0.48,  track:TRACKS.ui,      options:{preload:true}},
        UI_ACTIVE       :   {folder:"ui"      ,file:"blipp2"         , gain:0.46,  track:TRACKS.ui,      options:{preload:true}},
        UI_CLICK        :   {folder:"ui"      ,file:"blipp3"         , gain:0.95,  track:TRACKS.ui,      options:{preload:true}},
        UI_OUT          :   {folder:"ui"      ,file:"blipp4"         , gain:0.25,  track:TRACKS.ui,      options:{preload:true}},
        SEATOWN_AMB     :   {folder:"ambient" ,file:"seatown_birds"  , gain:1.45,  track:TRACKS.game,    options:{preload:true}},
        DARK_SUSPENS    :   {folder:"ambient" ,file:"dark_suspens"   , gain:0.85,  track:TRACKS.game,    options:{preload:true}},
        CANNON_20_0     :   {folder:"shots"   ,file:"cannon_0"       , gain:1.11,  track:TRACKS.game,    options:{preload:true,  refDist:18,  rolloff:1.1}},
        CANNON_20_1     :   {folder:"shots"   ,file:"cannon_1"       , gain:1.11,  track:TRACKS.game,    options:{preload:true,  refDist:18,  rolloff:1.1}},
        CANNON_20_2     :   {folder:"shots"   ,file:"cannon_2"       , gain:1.11,  track:TRACKS.game,    options:{preload:true,  refDist:18,  rolloff:1.1}},
        CANNON_20_3     :   {folder:"shots"   ,file:"cannon_3"       , gain:1.11,  track:TRACKS.game,    options:{preload:true,  refDist:18,  rolloff:1.1}},
        MAIN_GUN_0      :   {folder:"shots"   ,file:"main_gun_1"     , gain:0.68,  track:TRACKS.game,    options:{preload:true,  refDist:39,  rolloff:0.3}},
        MAIN_GUN_1      :   {folder:"shots"   ,file:"main_gun_2"     , gain:0.78,  track:TRACKS.game,    options:{preload:true,  refDist:39,  rolloff:0.3}},
        MAIN_GUN_2      :   {folder:"shots"   ,file:"main_gun_3"     , gain:0.98,  track:TRACKS.game,    options:{preload:true,  refDist:39,  rolloff:0.3}},
        AAA_0           :   {folder:"shots"   ,file:"aaa_1"          , gain:0.38,  track:TRACKS.game,    options:{preload:true,  refDist:26,  rolloff:0.5}},
        AAA_1           :   {folder:"shots"   ,file:"aaa_2"          , gain:0.54,  track:TRACKS.game,    options:{preload:true,  refDist:26,  rolloff:0.5}},
        AAA_2           :   {folder:"shots"   ,file:"aaa_3"          , gain:0.68,  track:TRACKS.game,    options:{preload:true,  refDist:26,  rolloff:0.5}},
        BULLET_HIT_0    :   {folder:"hits"    ,file:"cannon_hit_0"   , gain:0.55,  track:TRACKS.game,    options:{preload:true,  refDist:15,  rolloff:0.1}},
        BULLET_HIT_1    :   {folder:"hits"    ,file:"cannon_hit_1"   , gain:0.55,  track:TRACKS.game,    options:{preload:true,  refDist:15,  rolloff:0.1}},
        BULLET_HIT_2    :   {folder:"hits"    ,file:"cannon_hit_2"   , gain:0.55,  track:TRACKS.game,    options:{preload:true,  refDist:25,  rolloff:0.3}},
        BULLET_HIT_3    :   {folder:"hits"    ,file:"cannon_hit_3"   , gain:0.55,  track:TRACKS.game,    options:{preload:true,  refDist:45,  rolloff:0.5}},

        MAIN_HIT_0      :   {folder:"hits"    ,file:"main_hit_0"     , gain:0.58,  track:TRACKS.game,    options:{preload:true,  refDist:36,  rolloff:0.6}},
        MAIN_HIT_1      :   {folder:"hits"    ,file:"main_hit_1"     , gain:0.74,  track:TRACKS.game,    options:{preload:true,  refDist:36,  rolloff:0.6}},
        MAIN_HIT_2      :   {folder:"hits"    ,file:"main_hit_2"     , gain:0.98,  track:TRACKS.game,    options:{preload:true,  refDist:36,  rolloff:0.6}},
        AAA_HIT_0       :   {folder:"hits"    ,file:"aaa_hit_0"      , gain:0.22,  track:TRACKS.game,    options:{preload:true,  refDist:26,  rolloff:0.6}},
        AAA_HIT_1       :   {folder:"hits"    ,file:"aaa_hit_1"      , gain:0.32,  track:TRACKS.game,    options:{preload:true,  refDist:26,  rolloff:0.6}},
        AAA_HIT_2       :   {folder:"hits"    ,file:"aaa_hit_2"      , gain:0.42,  track:TRACKS.game,    options:{preload:true,  refDist:26,  rolloff:0.6}},
        SPLASH_0        :   {folder:"water"   ,file:"splash_0"       , gain:0.41,  track:TRACKS.game,    options:{preload:true,  refDist:6,   rolloff:0.1}},
        SPLASH_1        :   {folder:"water"   ,file:"splash_1"       , gain:0.41,  track:TRACKS.game,    options:{preload:true,  refDist:9,   rolloff:0.2}},
        SPLASH_2        :   {folder:"water"   ,file:"splash_2"       , gain:0.41,  track:TRACKS.game,    options:{preload:true,  refDist:18,   rolloff:0.4}},
        SPLASH_3        :   {folder:"water"   ,file:"splash_3"       , gain:0.41,  track:TRACKS.game,    options:{preload:true,  refDist:26,   rolloff:0.6}},
        ENGINE_START    :   {folder:"jet"     ,file:"jet_start"      , gain:0.5,   track:TRACKS.game,    options:{preload:true,  refDist:32,   rolloff:0.6}},
        ENGINE_STOP     :   {folder:"jet"     ,file:"jetbase_start"  , gain:1.0,   track:TRACKS.game,    options:{preload:true,  refDist:22,   rolloff:0.2}},
        ENGINE_ON       :   {folder:"jet"     ,file:"jet_idle"       , gain:1.0,   track:TRACKS.game,    options:{preload:true,  refDist:22,   rolloff:0.3}},
        ENGINE_GAS      :   {folder:"jet"     ,file:"jet_wide"       , gain:1.0,   track:TRACKS.game,    options:{preload:true,  refDist:12,   rolloff:0.2}},
        ENGINE_TONE     :   {folder:"jet"     ,file:"base_quint"     , gain:1.0,   track:TRACKS.game,    options:{preload:true,  refDist:32,   rolloff:0.7}},
        STEP_ROAD_1     :   {folder:"steps"   ,file:"road_step_1"    , gain:5.46,  track:TRACKS.ambient, options:{preload:false, refDist:4,   rolloff:0.84}},
        STEP_ROAD_2     :   {folder:"steps"   ,file:"road_step_2"    , gain:5.46,  track:TRACKS.ambient, options:{preload:false, refDist:4,   rolloff:0.84}},
        STEP_ROAD_3     :   {folder:"steps"   ,file:"road_step_3"    , gain:5.46,  track:TRACKS.ambient, options:{preload:false, refDist:4,   rolloff:0.84}},
        STEP_ROAD_4     :   {folder:"steps"   ,file:"road_step_4"    , gain:5.46,  track:TRACKS.ambient, options:{preload:false, refDist:4,   rolloff:0.84}},
        STEP_GRAVEL_1   :   {folder:"steps"   ,file:"gravel_step_1"  , gain:10.46, track:TRACKS.ambient, options:{preload:false, refDist:4,   rolloff:0.84}},
        STEP_GRAVEL_2   :   {folder:"steps"   ,file:"gravel_step_2"  , gain:10.46, track:TRACKS.ambient, options:{preload:false, refDist:4,   rolloff:0.84}},
        STEP_GRAVEL_3   :   {folder:"steps"   ,file:"gravel_step_3"  , gain:10.46, track:TRACKS.ambient, options:{preload:false, refDist:4,   rolloff:0.84}},
        FOUNTAIN_LOOP   :   {folder:"water"   ,file:"fountain"       , gain:1,     track:TRACKS.game,    options:{preload:false, refDist:4,   rolloff:0.44}},
        FX_VERB         :   {folder:"fx"      ,file:"AmbMix"         , gain:1,     track:TRACKS.ambient, options:{preload:true,  refDist:4,   rolloff:0.04}}
    }
});