"use strict";

define(["application/EventManager", "game/GameConfiguration"], function(event, gameConfig) {

    var KEY_TO_CONTROL = {
        eject:          {control:"eject",    value:1},
        canopy:         {control:"canopy",   value:1},
        gears:          {control:"gears",    value:1},
        cannons:        {control:"cannons",  value:1},
		missiles:       {control:"missiles", value:1},
        flapsDown:      {control:"flaps",    value:1},
        flapsUp:        {control:"flaps",    value:-1},
        throttleUp:     {control:"throttle", value:1},
        throttleDown:   {control:"throttle", value:-1},
        breaksOn:       {control:"breaks",   value:1},
        breaksOff:      {control:"breaks",   value:-1},
        pitchUp:        {control:"elevator", value:1},
        pitchDown:      {control:"elevator", value:-1},
        trimPitchUp:    {control:"trim_elevator", value:0.3},
        trimPitchDown:  {control:"trim_elevator", value:-0.3},

        rollLeft:       {control:"aeilrons", value:1},
        rollRight:      {control:"aeilrons", value:-1},
        trimRollLeft:   {control:"trim_aeilrons", value:0.3},
        trimRollRight:  {control:"trim_aeilrons", value:-0.3},
        yawLeft:        {control:"rudder",   value:1},
        yawRight:       {control:"rudder",   value:-1},
        trimYawLeft:    {control:"trim_rudder",   value:0.3},
        trimYawRight:   {control:"trim_rudder",   value:-0.3},
        wingSmoke:      {control:"wing_smoke", value:1},

        forward:        {control:"forward",    value:1},
        back:           {control:"back",       value:1},
        turnleft:       {control:"turnleft",   value:1},
        turnright:      {control:"turnright",  value:1},
        strafeModifier: {control:"strafe",     value:1},
        jump:           {control:"jump",       value:1},

        debug_mechanics:{control:"debug_mechanics", value:1},
        debug_physics:  {control:"debug_physics", value:1}

    };

    var keyboardInput = function(control, value) {
        //    console.log("keyboard input: "+moveControl)

        if (value) {
        //    console.log("Fire Control change", control)
            event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:KEY_TO_CONTROL[control].control, value:KEY_TO_CONTROL[control].value})
        } else {
        //    console.log("Cancel Control change", control)
            event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:KEY_TO_CONTROL[control].control})
        }
    };


    var handleKeyBindingUpdate = function(e) {
        keyboardInput(event.eventArgs(e).control, event.eventArgs(e).value);
    };

    event.registerListener(event.list().UPDATE_KEYBINDING, handleKeyBindingUpdate);
    return {}

})