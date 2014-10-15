"use strict";

define(function() {

    return {
        SURFACES:{
            elevator:{
                inputBehavior:{release:1, speed:0.1, inputAnim:{bone:"stick", rot:[0.4,0.5,0]}},
                controls: {
                    elevator:{elevator:0.6}
                },
                speed:0.2
            },

            aeilrons:{
                inputBehavior:{release:1, speed:0.1},
                controls:{
                    aeilrons:{aeilron_right:-0.5, aeilron_left:-0.5}
                },
                speed:0.2
            },

            rudder:{
                inputBehavior:{release:1, speed:0.1},
                controls: {
                    rudder:{rudder:0.8, pedal_left:-0.7, pedal_right:-0.7}
                },
                speed:0.2
            },
            flaps:{
                inputBehavior:{release:0, speed:0.1},
                controls: {
                    flaps:{flap_right:-1.1, flap_left:1.1}
                },
                speed:0.005
            },
            breaks:{
                inputBehavior:{release:0, speed:0.1},
                controls: {
                    breaks:{airbreak_right:-0.65, airbreak_left:0.65}
                },
                speed:0.02
            }
        }
    }
});