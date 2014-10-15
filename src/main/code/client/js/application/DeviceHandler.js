"use strict";

define(["application/EventManager"],
    function(event) {

        function get_browser(){
            var N=navigator.appName, ua=navigator.userAgent, tem;
            var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
            M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
            return M[0];
        }
        function get_browser_version(){
            var N=navigator.appName, ua=navigator.userAgent, tem;
            var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
            M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
            return M[1];
        }

        var handleResize = function() {
            window.scrollTo(0, 0);
        };

        var handleClientSetupDone = function() {
            document.ontouchmove = function(e) {e.preventDefault()};
        };

        function hasPowerSound() {
            if (get_browser() == "Chrome") return true;
            if (get_browser() == "Firefox") return false;
        }

        event.registerListener(event.list().WINDOW_RESIZED, handleResize);

        return {
            handleClientSetupDone:handleClientSetupDone,
            getBrowser:get_browser,
            hasPowerSound:hasPowerSound,
            getVersion:get_browser_version
        }

    });