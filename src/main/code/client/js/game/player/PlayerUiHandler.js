"use strict";

define([
    'application/EventManager'
],
    function(
        event
        ) {

        var loadPlayerUi = function(template, callback) {
            console.log("LOAD TEMPLATE: ", template)
            event.fireEvent(event.list().LOAD_UI_TEMPLATE, {templateId:template, callback:callback})
        };

        var unloadPlayerUi = function(template, callback) {
            event.fireEvent(event.list().UNLOAD_UI_TEMPLATE, {templateId:template, callback:callback})
        };

        return {
            loadPlayerUi:loadPlayerUi,
            unloadPlayerUi:unloadPlayerUi
        }
    });
