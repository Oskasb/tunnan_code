"use strict";

define(["application/EventManager"], function(event) {

    var pressedButtons = [0, 0]

    var handleElementMouseEvent = function(eventType, button) {
         var mouseAction = [0, 0]
         switch (button) {
             case "RIGHT":
                  switch (eventType) {
                      case "mousedown":
                          pressedButtons[1] = 1;
                          mouseAction = pressedButtons;
                      break;
                      case "mouseup":
                          pressedButtons[1] = 0;
                          mouseAction = pressedButtons;
                      break;
                      case "mouseout":
                      //    InputSetterGetter.stopDrag();
                      break;
                      case "click":
                      break;
                  }
             break;
             case "LEFT":
                  switch (eventType) {
                      case "mousedown":
                          pressedButtons[0] = 1;
                          mouseAction = pressedButtons;
                      break;
                      case "mouseup":
                          pressedButtons[0] = 0;
                          mouseAction = pressedButtons;
                      break;
                      case "click":
                          if (pressedButtons[1] == 0) {
                      //        CORE.network.trafficHandler.requestDataFromServer(["action", "select", null])
                      //        CORE.input.selectionHandler.removeCurrentWorldSelections();
                          }
                      break;
                  }
             break;
             case "MIDDLE":
                  switch (eventType) {
                      case "mousedown":
                          mouseAction = [1, 1];
                      break;
                      case "mouseup":
                          mouseAction = [0, 0];
                      break;
                      case "click":
                      break;
                  }
             break;
         }
    //    playerMovementInput.setMouseAction(mouseAction, inputSettersGetters.getMouseXY())
        return mouseAction;
    };


    var handleMouseEvt = function(evt) {
        var clickType = 'LEFT';
        //  if (evt.type!=sTestEventType) console.log(evt.type);
        if (evt.which) {
            if (evt.which==3) clickType='RIGHT';
            if (evt.which==2) clickType='MIDDLE';
        } else if (evt.button) {
            if (evt.button==2) clickType='RIGHT';
            if (evt.button==4) clickType='MIDDLE';
        }
        return handleElementMouseEvent(evt.type, clickType)
    };

    var setElementClickFunction = function(element, mouseCallback) {
    //    alert("Set Click, "+element.id)
    //  var sTestEventType='mousedown';
        function handleMouseEvent(e) {
            e.stopPropagation();
            var evt = (e==null ? event:e);
            mouseCallback(handleMouseEvt(evt))
        };

        element.addEventListener('mouseup', handleMouseEvent);
        element.addEventListener('click', handleMouseEvent);
        element.addEventListener('mousedown', handleMouseEvent);
        element.addEventListener('mouseout', handleMouseEvent);
    };

    return {
        setElementClickFunction:setElementClickFunction
    }
})