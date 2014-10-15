"use strict";

define(function() {

    return {
        LIGHTS:{
            meshData:[{meshEntityName:'lights'}],
            feedback:{off:[0, 301, 4, 4]},
			patterns:[
				[1],
				[0, 0, 0, 0, 0, 0.5, 1, 1, 1, 0.5, 0, 0, 0, 0, 0, 0.5, 1, 1, 1, 0.5, 0],
				[0, 0, 0, 0, 0.1, 1, 0.3, 0.1, 0, 0, 0.1, 1, 0.3, 0.1, 0, 0, 0, 0]
			],
			controls:{
				collision_mode:     {value:-0.5, controlState:0},
				collision_lights:   {value:0.7, controlState:0},
				taxi_mode:          {value:-1, controlState:0},
				taxi_lights:        {value:1, controlState:0},
				position_mode:      {value:0.3, controlState:0},
				position_lights:    {value:0.7, controlState:0},
				formation_mode:     {value:-1, controlState:0},
				formation_lights:   {value:0.4, controlState:0},
				cockpit_mode:       {value:-0.9, controlState:0},
				cockpit_lights:     {value:0.95, controlState:0}
			},
            systems:{
                formation:{
                    formation:{meshData:0, txcoords:    [44,    286,    39, 12]}
                },
                position:{
                    wing_r:{meshData:0, txcoords:       [25,    301,    9, 8]},
					glove_l:{meshData:0, txcoords:      [15,    310,    9, 8]},
                    wing_l:{meshData:0, txcoords:       [25,    310,    9, 8]},
                    glove_r:{meshData:0, txcoords:      [15,    301,    9, 8]},
                    rear_l:{meshData:0, txcoords:       [45,    301,    9, 8]}
                },
                collision:{
                    collision_l:{meshData:0, txcoords:  [35,    310,    9, 8]},
					coll_low_r:{meshData:0, txcoords:   [ 5,    301,    9, 8]},
                    rear_r:{meshData:0, txcoords:       [65,    301,    9, 8]},
					coll_low_l:{meshData:0, txcoords:   [ 5,    310,    9, 8]}
                },
                taxi:{
                    nose:{meshData:0, txcoords:         [45,    310,    9, 8]}
                },
                cockpit:{
                    seam_lock:{meshData:0, txcoords:    [0,     0,      82, 15]},
                    collision: {meshData:0, txcoords:   [0,     16,     82, 15]},
                    hot_trig: {meshData:0, txcoords:    [0,     35,     82, 15]},
                    r_fire: {meshData:0, txcoords:      [0,     53,     65, 17]},
                    l_fire: {meshData:0, txcoords:      [0,     73,     65, 17]},
                    adl_ac: {meshData:0, txcoords:      [0,     92,     78, 14]},
                    landing_chk: {meshData:0, txcoords: [0,     106,    78, 15]},
                    acl_ready: {meshData:0, txcoords:   [0,     123,    78, 15]},
                    ap_cflr:   {meshData:0, txcoords:   [0,     138,    78, 16]},
                    cmd_control: {meshData:0, txcoords: [0,     155,    78, 16]},
                    ten_seconds: {meshData:0, txcoords: [0,     171,    78, 14]},
                    tilt: {meshData:0, txcoords:        [0,     186,    78, 14]},
                    voice: {meshData:0, txcoords:       [0,     202,    78, 14]},
                    blank1: {meshData:0, txcoords:      [0,     217,    78, 14]},
                    blank2: {meshData:0, txcoords:      [0,     232,    78, 14]},
                    ap_hef: {meshData:0, txcoords:      [0,     247,    78, 15]},
                    wave_off: {meshData:0, txcoords:    [81,    92,     78, 14]},
                    wing_sweep: {meshData:0, txcoords:  [81,    106,    78, 15]},
                    reduce_speed: {meshData:0, txcoords:[81,    123,    78, 15]},
                    blank3: {meshData:0, txcoords:      [81,    138,    78, 16]},
                    alt_low: {meshData:0, txcoords:     [81,    155,    78, 16]},
                //    whatsThis: {meshData:0, txcoords:   [86,    180,    78, 14]},

                    hig_rate: {meshData:0, txcoords:    [160,    60,    78, 14]},
                    low_rate: {meshData:0, txcoords:    [160,    80,    41, 16]},
                    cool_on: {meshData:0, txcoords:     [160,    100,    41, 16]},
                    cool_off: {meshData:0, txcoords:    [160,    120,   41, 16]},
                    msl_prep_on: {meshData:0, txcoords: [160,    140,   41, 16]},
                    msl_prep_off: {meshData:0, txcoords:[160,    160,   41, 16]},
                    norm: {meshData:0, txcoords:        [160,    211,   42, 16]},
                    brsit:{meshData:0, txcoords:        [160,    231,   42, 16]},
                    ecm_1: {meshData:0, txcoords:       [204,    59,    20, 11]},
                    ecm_2: {meshData:0, txcoords:       [204,    72,    20, 11]},
                    ecm_3: {meshData:0, txcoords:       [204,    84,    20, 11]},
                    master_caution:{meshData:0, txcoords:[222,   66,    88, 18]},
                    wheels:{meshData:0, txcoords:       [222,   116,    56, 20]},
                    brakes:{meshData:0, txcoords:       [222,   138,    56, 20]},
                    acls_ap:{meshData:0, txcoords:      [222,   162,    56, 20]},
                    nws_enga:{meshData:0, txcoords:     [222,   187,    56, 20]},
                    auto_throt:{meshData:0, txcoords:   [222,   211,    56, 20]},
                    aoa_ind_top:{meshData:0, txcoords:  [281,   113,    20, 22]},
                    aoa_ind_mid:{meshData:0, txcoords:  [281,   136,    20, 22]},
                    aoa_ind_low:{meshData:0, txcoords:  [281,   160,    20, 22]},

                    // Caution Panel:
                    pitch_1:    {meshData:0, txcoords:  [332,   120,    45, 12]},
                    roll_1:     {meshData:0, txcoords:  [377,   120,    45, 12]},
                    yaw_op:     {meshData:0, txcoords:  [422,   120,    45, 12]},
                    xx_1:       {meshData:0, txcoords:  [467,   120,    45, 12]},

                    pitch_2:    {meshData:0, txcoords:  [332,   132,    45, 12]},
                    roll_2:     {meshData:0, txcoords:  [377,   132,    45, 12]},
                    yaw_out:    {meshData:0, txcoords:  [422,   132,    45, 12]},
                    xx_2:       {meshData:0, txcoords:  [467,   132,    45, 12]},

                    x_2:        {meshData:0, txcoords:  [332,   144,    45, 12]},
                    y_2:        {meshData:0, txcoords:  [377,   144,    45, 12]},
                    z_2:        {meshData:0, txcoords:  [422,   144,    45, 12]},
                    yy_1:       {meshData:0, txcoords:  [467,   144,    45, 12]},

                    x_1:        {meshData:0, txcoords:  [332,   156,    45, 12]},
                    y_1:        {meshData:0, txcoords:  [377,   156,    45, 12]},
                    z_1:        {meshData:0, txcoords:  [422,   156,    45, 12]},
                    yy_2:       {meshData:0, txcoords:  [467,   156,    45, 12]},

                    xx_12:      {meshData:0, txcoords:  [332,   167,    45, 11]},
                    yy_12:      {meshData:0, txcoords:  [377,   167,    45, 11]},
                    zz_12:      {meshData:0, txcoords:  [422,   167,    45, 11]},
                    yx_12:      {meshData:0, txcoords:  [467,   167,    45, 11]},

                    xx_22:      {meshData:0, txcoords:  [332,   178,    45, 12]},
                    yy_22:      {meshData:0, txcoords:  [377,   178,    45, 12]},
                    zz_22:      {meshData:0, txcoords:  [422,   178,    45, 12]},
                    yx_22:      {meshData:0, txcoords:  [467,   178,    45, 12]},

                    xx_33:      {meshData:0, txcoords:  [332,   190,    45, 12]},
                    yy_33:      {meshData:0, txcoords:  [377,   190,    45, 12]},
                    zz_33:      {meshData:0, txcoords:  [422,   190,    45, 12]},
                    yx_33:      {meshData:0, txcoords:  [467,   190,    45, 12]},

                    xx_44:      {meshData:0, txcoords:  [332,   202,    45, 12]},
                    yy_44:      {meshData:0, txcoords:  [377,   202,    45, 12]},
                    zz_44:      {meshData:0, txcoords:  [422,   202,    45, 12]},
                    yx_44:      {meshData:0, txcoords:  [467,   202,    45, 12]},

                    xx_55:      {meshData:0, txcoords:  [332,   214,    45, 12]},
                    yy_55:      {meshData:0, txcoords:  [377,   214,    45, 12]},
                    zz_55:      {meshData:0, txcoords:  [422,   214,    45, 12]},
                    yx_55:      {meshData:0, txcoords:  [467,   214,    45, 12]},

                    xx_66:      {meshData:0, txcoords:  [218,   0,    45, 12]},
                    yy_66:      {meshData:0, txcoords:  [263,   0,    45, 12]},
                    zz_66:      {meshData:0, txcoords:  [308,   0,    45, 12]},
                    yx_66:      {meshData:0, txcoords:  [353,   0,    45, 12]},

                    xx_77:      {meshData:0, txcoords:  [218,   12,    45, 12]},
                    yy_77:      {meshData:0, txcoords:  [263,   12,    45, 12]},
                    zz_77:      {meshData:0, txcoords:  [308,   12,    45, 12]},
                    yx_77:      {meshData:0, txcoords:  [353,   12,    45, 12]},

                    xx_88:      {meshData:0, txcoords:  [218,   24,    45, 12]},
                    yy_88:      {meshData:0, txcoords:  [263,   24,    45, 12]},
                    zz_88:      {meshData:0, txcoords:  [308,   24,    45, 12]},
                    yx_88:      {meshData:0, txcoords:  [353,   24,    45, 12]},

                    xx_99:      {meshData:0, txcoords:  [218,   36,    45, 12]},
                    yy_99:      {meshData:0, txcoords:  [263,   36,    45, 12]},
                    zz_99:      {meshData:0, txcoords:  [308,   36,    45, 12]},
                    yx_99:      {meshData:0, txcoords:  [353,   36,    45, 12]}

                },
                engines: {
                    engine_l:  {meshData:0, txcoords:   [6,     319,    19, 15]},
                    engine_r:  {meshData:0, txcoords:   [16,    319,    19, 15]}
                }
            }
        }
    }
});