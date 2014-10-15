"use strict";

define(["game/GameConfiguration", "application/EventManager", "io/Requests", "io/XhrWrapper"], function(gameConfig, event, requests, xhrWrapper) {

    var restParams;

    var setRestParams = function(params) {
        restParams = params;
    };

    var getRestParams = function() {
        return restParams;
    };

    var gameAction = function() {
        return requests.game;
    };

    var loadJSON = function(url, callback) {
        var packet = makeUtilPacket(requests.utils.LOAD_JSON, {url:url});
        packet.responseCallback = callback;
        xhrWrapper.sendRequest(packet);
    };

    var utilRequest = function(util, params) {
        var packet = makeUtilPacket(util, params);
        xhrWrapper.sendRequest(packet);
    };



    var addParam = function(param, value) {
        return "&"+param+"="+value;
    };

    var gameRequest = function(action, params) {

        var packet = makeGamePacket(action, params);
        if (!packet) return;
        packet.url = gameConfig.CONNECTION.configuration.url;
  //    if (packet.auth) packet.auth = getRestParams().auth;
//  //  console.log("Send Packet: ",packet);
  //    mockConnection.sendRequest(packet);

                 xhrWrapper.sendRequest(packet);

        //       formWrapper.sendRequest(packet);
    };

    var makeGamePacket = function(action, sendData) {
        var packet;
        switch (action) {
            case requests.game.GAME_BET:

                console.log("Send Data: ",sendData)

                var params = gameConfig.CONNECTION.serverMap.gameId+"="+gameConfig.CONNECTION.configuration.gameId;
                params += addParam(gameConfig.CONNECTION.serverMap.authToken, gameConfig.CONNECTION.configuration.authToken);
                params += addParam(gameConfig.CONNECTION.serverMap.actionName, gameConfig.CONNECTION.serverMap.spin);

                params += addParam("betsize", ""+sendData["betsize"]);
                params += addParam("coinvalue", sendData["coinvalue"]);

                params += addParam("sessionid", sendData.sessionId)

                packet = {
                    type:"POST",
                    contentType:"application/x-www-form-urlencoded",
                    //    responseType:'text',
                    params:params
                };

                break;
            case requests.game.GAME_INIT:

                var params = gameConfig.CONNECTION.serverMap.gameId+"="+gameConfig.CONNECTION.configuration.gameId;
                params += addParam(gameConfig.CONNECTION.serverMap.authToken, gameConfig.CONNECTION.configuration.authToken);
                params += addParam(gameConfig.CONNECTION.serverMap.actionName, gameConfig.CONNECTION.serverMap.launch);
            //

                packet = {
                    type:"POST",
                    contentType:"application/x-www-form-urlencoded",
                //    responseType:'text',
                    params:params
                };



            //    packet.body[gameConfig.CONNECTION.serverMap.actionName] = gameConfig.CONNECTION.serverMap.launch;
            //    packet.body[gameConfig.CONNECTION.serverMap.gameId] = gameConfig.CONNECTION.configuration.gameId;
            //    packet.body[gameConfig.CONNECTION.serverMap.authToken] = gameConfig.CONNECTION.configuration.authToken;

                break;
            case requests.game.BET_CONFIRMED:

                var params = gameConfig.CONNECTION.serverMap.gameId+"="+gameConfig.CONNECTION.configuration.gameId;
                params += addParam(gameConfig.CONNECTION.serverMap.authToken, gameConfig.CONNECTION.configuration.authToken);
                params += addParam(gameConfig.CONNECTION.serverMap.actionName, gameConfig.CONNECTION.serverMap.confirm);
                params += addParam("sessionid", params.sessionId)

                packet = {
                    type:"POST",
                    contentType:"application/x-www-form-urlencoded",
                    //    responseType:'text',
                    params:params
                };
                break;
        }
        packet.action = action;
        packet.params = params;
        return packet;
    };

    var makeUtilPacket = function(util, params) {
        var url = params.url;
        switch (util) {
            case requests.utils.LOAD_JSON:
                var packet = {
                    responseType:'application/json',
                    type:"GET",
                    url:url
                };
                break;
            case requests.utils.LOAD_TEMPLATE:
                var packet = {
                    type:"GET",
                    url:url
                };
                break;
            case requests.utils.LOAD_CONTEXT_SOUND:
                var packet = {
                    responseType:'arraybuffer',
                    type:"GET",
                    url:url
                };
                break;

        }
        packet.util = util;
        packet.params = params;
        return packet;
    };

    var handleLoadJson = function(e) {
        loadJSON(event.eventArgs(e).url, event.eventArgs(e).callback)
    };

    event.registerListener(event.list().LOAD_JSON, handleLoadJson)

    return {
        setRestParams:setRestParams,
        gameAction:gameAction,
        gameRequest:gameRequest,
        utilRequest:utilRequest
    }

});