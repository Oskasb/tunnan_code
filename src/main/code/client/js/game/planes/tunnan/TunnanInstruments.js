"use strict";

define(function() {

    var curves = {
        climb:[[-1000, -10], [-18, -9],[-5, -5],[5, 5], [18, 9], [1000, 10]]
    };

    return {
        INSTRUMENTS:{
            horizon:        {boneName:'horizon',        sample:'rotVec',    axisAmp:[[2, 0.0025], [1, 0], [2,-0.021]]},
            gyro_roll:      {boneName:'gyro_horizon',   sample:'rollAng',   axisAmp:1},
            gyro_horizon:   {boneName:'gyro_roll',      sample:'rotVec',    axisAmp:[[2, 0.0], [1, 0], [2,-0.032]]},
            engine_rpm:     {boneName:'engine_rpm',     sample:'rpm',       axisAmp:-Math.PI*1.8},
            exhaust_temp:   {boneName:'exhaust_temp',   sample:'temp',      axisAmp:-Math.PI*90.45},
            accelerometer:  {boneName:'accelerometer',  sample:'g',         axisAmp:-5},
            turn_quality:   {boneName:'turn_quality',   sample:'acc',       axisAmp:[[0, 0], [0, 7.25], [0, 0]]},
            roll_indicator: {boneName:'roll_indicator', sample:'rollAng',   axisAmp:-1},
            gyro_compass:   {boneName:'gyro_compass',   sample:'xyHeading', axisAmp:1},
            mag_compass:    {boneName:'mag_compass',    sample:'xyHeading', axisAmp:-1},
            gyro_steer:     {boneName:'gyro_steer',     sample:'xyHeading', axisAmp:1.4},
            climb_indicator:{boneName:'climb_indicator',sample:'climbRate', curve:curves.climb, axisAmp:-0.315},
            speed_indicator:{boneName:'speed_indicator',sample:'speed',     axisAmp:-3.14 *0.006},
            alt_outer:      {boneName:'alt_outer',      sample:'altitude',  axisAmp:-31.4 *0.0001},
            alt_inner:      {boneName:'alt_inner',      sample:'altitude',  axisAmp:-3.14 *0.0001}
        }
    }
});