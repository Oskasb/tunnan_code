"use strict";

define(function() {
    var curves = {
        climb:[[-1000, -10], [-18, -9],[-5, -5],[5, 5], [18, 9], [1000, 10]],
        speed:[[-1000, 0], [0, 0],[500, 2], [1000, 2]],
        acc:[[-4, -1], [0, 0],[9, 2]],
        alt:[[-1000, 0], [0, 0], [12000, 3], [50000, 4]],
        ground:[[-1000, 0], [0, 0], [100, 0.6], [250, 0.9],[400, 1.2],[1000, 1.5],[2000, 1.8], [5000, 2.1],[50000, 2.5]]
    };

    return {
        INSTRUMENTS:{
            horizon:        {sample:'rotVec',           axisAmp:[[2, 0.0025], [1, 0], [2,-0.021]]},
            roll_indicator: {sample:'rollAng',          axisAmp:-1},
            gyro_compass:   {boneName:'compass_2',      sample:'xyHeading', axisAmp:1},
            //    mag_compass:    {boneName:'compass_2',    axisAmp:1},
            turn_quality:   {boneName:'turn_quality',   sample:'acc',       axisAmp:[[0, 30], [0, 0], [0, 0]]},
            accelerometer:  {boneName:'acceleration',   sample:'g',         axisAmp:-1},
            climb_indicator:{boneName:'climb',          sample:'climbRate', curve:curves.climb, axisAmp:-0.315},
            aoa_indicator:  {axisAmp:1},                sample:'aoa',
            ground_alt:     {boneName:'ground_alt',     sample:'altitude',  curve:curves.ground, axisAmp:-1},
            altimeter:      {boneName:'altimeter',      sample:'altitude',  curve:curves.alt, axisAmp:-1},
            ground_speed:   {sample:'speed',     axisAmp:-3.14},
            speed_indicator:{boneName:'airspeed',       sample:'speed',     curve:curves.speed, axisAmp:-3.14},
            gyro_roll:      {boneName:'gyro_roll',      sample:'rollAng',   axisAmp:-1},
            gyro_pitch:     {boneName:'gyro_pitch',     sample:'pitch',     axisAmp:1},
        }
    }
});