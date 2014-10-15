"use strict";

define(["io/Receive"], function(receive) {

    var nrSentRequests = 0;
    var ongoingRequests = {};

    var getNewRequestId = function() {
        nrSentRequests += 1;
        return "requestId_"+nrSentRequests;
    };

    var sendRequest = function(packet, successcallback, failCallback) {
        packet.packetId = getNewRequestId();
    //    if (packet.auth) packet.auth.header = makeBaseAuth(packet.auth.username, packet.auth.password);
        sendXHR(packet, successcallback, failCallback);
    };

    var sendXHR = function(packet, successcallback, failCallback) {
        var packetId = packet.packetId;

        var body = "";

        var request = new XMLHttpRequest();
        request.packet = packet;

        var asynch = true;
    //    if (packet.contentType == 'application/x-www-form-urlencoded') asynch = false;


        request.open(packet.type, packet.url, asynch);
        if (packet.responseType) request.responseType = packet.responseType;

        if (packet.contentType == 'application/json') {
            body = JSON.stringify(packet.body);
            request.setRequestHeader("Content-Type", packet.contentType);
        }

        if (packet.contentType == 'application/x-www-form-urlencoded') {
            body = packet.params;
            request.setRequestHeader("Content-Type", packet.contentType);

        //    request.setRequestHeader("Content-length", packet.params.length);
        //    request.setRequestHeader("Connection", "close");
        }

        if (packet.auth) request.setRequestHeader('Authorization', packet.auth.header);

        request.onreadystatechange = function() {
            if (request.readyState == 4) {

                receive.handleResponse(request.response, request.packet);
            }
        };

        request.onError = function() {
            alert("XHR Error! "+request.packet.packetId)
        };

        request.send(body);
        ongoingRequests[packetId] = request;
    };

    return {
        sendRequest:sendRequest
    }

});