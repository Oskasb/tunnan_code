
define(["application/EventManager"], function(event) {

    var inputIsTouch = 'ontouchstart' in document.documentElement;

    var setTouch = function(touch) {
        inputIsTouch = touch;
    };

    var isTouch = function() {
        return inputIsTouch;
    };

    TouchListener = function() {
        this.releaseRange = 20;
    };

    var registerClickableElement = function(element) {
        var clickEvent = new CustomEvent(
            "touchClick",
            {
                detail: {

                },
                bubbles: false,
                cancelable: true
            }
        );

        var startEvent = new CustomEvent(
            "touchstart",
            {
                detail: {

                },
                bubbles: false,
                cancelable: true
            }
        );
        var cancelEvent = new CustomEvent(
            "touchCancel",
            {
                detail: {},
                bubbles: true,
                cancelable: false
            }
        );

        element.addEventListener("touchstart", function(e) {
            e.stopPropagation();
            element.touch = e.touches[0];
            element.active = true;
            text += element.touch.target.id+" "+i+" <br>"

        //    element.dispatchEvent(startEvent);
        }, false);

        element.addEventListener("touchend", function(e) {
            e.stopPropagation();
            var endElem = document.elementFromPoint(element.touch.clientX, element.touch.clientY);
            if (e.srcElement.id == endElem.id) {

                 setTimeout(function() {
                     element.dispatchEvent(clickEvent);
                 }, 10);

                 setTimeout(function() {
            //         element.dispatchEvent(cancelEvent);
                 }, 100);
            } else {
                element.dispatchEvent(cancelEvent);
            }

        }, false);

    };

    var registerPressableElement = function(element) {
        var cancelEvent = new CustomEvent(
            "touchCancel",
            {
                detail: {},
                bubbles: true,
                cancelable: false
            }
        );

        var pressEvent = new CustomEvent(
            "touchPress",
            {
                detail: {},
                bubbles: false,
                cancelable: true
            }
        );


        element.addEventListener("touchstart", function(e) {
                e.stopPropagation();
            var text = ""
            for (var i = 0; i < e.touches.length; i++) {
                if (e.targetTouches[i].target.id == element.id) {
                    e.targetTouches[i].target.active = element.id;
                    e.targetTouches[i].target.dispatchEvent(pressEvent);
                }
            }
            //     debug.log("touchstart "+text)


        }, false);

        element.addEventListener("touchend", function(e) {

    //        var endElem = document.elementFromPoint(element.touch.clientX, element.touch.clientY);
            if (e.srcElement.active == e.srcElement.id) {
                element.dispatchEvent(cancelEvent);
                element.active = null;
            } else {
                //        debug.log("Fire end inactive target")
            }

        }, false);
    };


    var registerMoveableElement = function(element) {
        var cancelEvent = new CustomEvent(
            "moveEnd",
            {
                detail: {},
                bubbles: true,
                cancelable: false
            }
        );

        var pressEvent = new CustomEvent(
            "moveStart",
            {
                detail: {},
                bubbles: false,
                cancelable: true
            }
        );

        var moveEvent = new CustomEvent(
            "touchMove",
            {
                detail: { },
                bubbles: false,
                cancelable: false
            }
        );


        element.addEventListener("touchstart", function(e) {
            //    e.stopPropagation();
            var text = ""
            for (var i = 0; i < e.touches.length; i++) {
                if (e.targetTouches[i].target.id == element.id) {
                    e.targetTouches[i].target.touch = e.targetTouches[i];
                    e.targetTouches[i].target.active = element.id;
                    e.targetTouches[i].target.dispatchEvent(pressEvent);
                }
            }
            //     debug.log("touchstart "+text)

        }, false);

        element.addEventListener("touchmove", function(e) {
            //    var touch = element.touch;
            //   console.log(e)
            //    var targElem = document.elementFromPoint(touch.clientX, touch.clientY);

            for (var i = 0; i < e.touches.length; i++) {
                if (e.targetTouches[i].target.id == element.id) {
                    e.targetTouches[i].target.dispatchEvent(moveEvent);
                }
            }


            /*
             if (targElem.id == element.id) {
             //    debug.log("Still on target!")
             //     debug.log("move steer: x/y "+ element.touch.clientX +" / "+ element.touch.clientY)
             element.dispatchEvent(moveEvent);
             } else {
             element.dispatchEvent(cancelEvent);
             element.active = false;
             console.log("End Touch!")
             debug.log(" --> Not on target!")
             }
             */
        }, false);


        element.addEventListener("touchend", function(e) {

    //        var endElem = document.elementFromPoint(element.touch.clientX, element.touch.clientY);
            /*
            for (var i = 0; i < e.touches.length; i++) {
                if (e.touches[i].target.id == element.id) {
                    e.touches[i].target.dispatchEvent(cancelEvent);
                    element.active = null;
                }
            }

             */

            if (e.srcElement.active == element.id) {
                element.dispatchEvent(cancelEvent);
            } else {
                //        debug.log("Fire end inactive target")
            }

        }, false);
    };

    return {
        isTouch:isTouch,
        registerClickableElement:registerClickableElement
    }
})
