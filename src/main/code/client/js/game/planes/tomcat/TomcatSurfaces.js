"use strict";

define(function() {

    return {
        SURFACES: {
            elevator:{
                //   inputBehavior:{release:1, speed:0.1, inputAnim:{bone:"stick", rot:[0.4,0.5,0]}},
                inputBehavior:{release:1, speed:0.01},
                controls: {
                    elevator:{stab_inner_r:-0.5, stab_inner_l:0.5, stick_pitch:0.15}
              //    elevator:{stab_outer_r:0.6, stab_outer_l:0.6},
                },
                speed:0.05
            },

            aeilrons:{
                inputBehavior:{release:1, speed:0.01},
                controls:{
                    aeilrons:{stab_outer_r:0.6, stab_outer_l:0.6, stick_roll:-0.15},
                    spoiler:{spoiler_r:1.5, spoiler_l:-1.5}
                },
                speed:0.05
            },

            rudder:{
                inputBehavior:{release:1, speed:0.01},
                controls: {
                    //    rudder:{rudder:0.8, pedal_left:-0.7, pedal_right:-0.7}
                    rudder:{rudder_l:-0.8, rudder_r:-0.8, pedal_l:0.5, pedal_r:0.5}
                },
                speed:0.05
            },
            flaps:{
                inputBehavior:{release:0, speed:0.1},
                controls: {
                    flaps:{slat_r:-0.5, slat_l:0.5, flap_r:0.8, flap_l:-0.8, flaps_lever:0.6}
                },
                speed:0.008
            },
            breaks:{
                inputBehavior:{release:0, speed:0.1},
                controls: {
                    breaks:{break_top:-1.25, break_bottom:1.05}
                },
                speed:0.01
            },
            wing_sweep:{
                inputBehavior:{release:0, speed:0.08},
                lights:['wing_sweep'],
                controls: {
                    wing_sweep:{pivot_r:-0.84, pivot_l:0.84, canard_r:0.3, canard_l:-0.3}
                },
                speed:0.003
            }
        }
    }
});