"use strict";

var gameUtil;

require(["application/AnalyticsWrapper", "application/Client", "3d/GooController"], function(analytics, Client, GooController) {
	var client = new Client();
    client.initiateClient(new GooController());
});
