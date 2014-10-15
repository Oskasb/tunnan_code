"use strict";

define(["application/EventManager", "io/Requests"],
	function(event, requests) {

		var handleResponse = function(response, packet) {
			//    console.log("response: ", response)
			if (!response) return; // the stop command has no mock response.
			if (packet.action) handleActionResponse(JSON.parse(response), packet);
			if (packet.util)  handleUtilResponse(response, packet);
		};

		var validateJsonString = function(res) {
			try {
				var str = JSON.parse(res);
			} catch (e) {
				return false;
			}
			return str;
		};

		var handleUtilResponse = function(response, packet) {
			switch (packet.util) {
				case requests.utils.LOAD_JSON:



					packet.responseCallback(validateJsonString(response));
					break;
				case requests.utils.LOAD_TEMPLATE:
					templateRepository.storeTemplate(response, packet.params);
					break;
				case requests.utils.LOAD_CONTEXT_SOUND:
					packet.params.callback(packet.params.sound, response);
					break;
				default: alert("Unhandled response from utility packet");
			}
		};


		var handleActionResponse = function(response, packet) {
			switch (packet.action) {
				case requests.game.GAME_INIT:

					event.fireEvent(event.list().GOT_GAME_CONFIGURATION, {gameConfig:response});
					break;

				default: alert("Unhandled game response from action packet");
			}
		};

		return {
			handleResponse:handleResponse
		}

	});