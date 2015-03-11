"use strict";

define([
	"application/EventManager",
	'io/OculusRiftScripts',
	'goo/math/Quaternion'
], function(
	event,
	OculusRiftScripts,
	Quaternion
	) {

		var OculusRiftInput = function() {
			this.bridge = null;
			this.config = null;
			this.useRiftRendering = false;
		};

		OculusRiftInput.prototype.riftConfig = function(config) {
			this.config = config;
			console.log("Config update: ", config)
		};

		var seeking = false;
		OculusRiftInput.prototype.seekRiftBridge = function() {
			seeking = true;

			var connectBridge = function(ctx, connectedCallback) {

				if (!window.OculusBridge) {
			//		document.getElementById('rift_enabled').innerHTML = "Oculus Rift Bridge not present";
			//		document.getElementById('rift_controller').style.backgroundColor = 'rgb(217, 37, 37)';
			//		document.getElementById('rift_controller').innerHTML = 'No Rift Bridge';
					return false;
				}

				var disconnect = true;

				ctx.orientation = new Quaternion();
				ctx.bridge = new OculusBridge({
					onConnect: function() {
						disconnect = false;
						console.log('connected');
						connectedCallback(ctx.bridge);
					},
					onOrientationUpdate: function(quat) {
						ctx.orientation.setDirect(quat.x, quat.y, quat.z, quat.w);
						event.fireEvent(event.list().OCULUS_RIFT_QUATERNION, {quat:ctx.orientation});

						//	var tc = ctx.entity.transformComponent;
					//	ctx.orientation.toRotationMatrix(tc.transform.rotation);
					//	tc.setUpdated();
					},
					onAccelerationUpdate: function(acc) {
						// Nothing here yet
					},
					onConfigUpdate: function(config) {
						ctx.riftConfig(config);
					}
				});
				ctx.bridge.connect();

				setTimeout(function() {
					if (disconnect) ctx.bridge.disconnect();
				}, 2000)

				return ctx.bridge;
			};




			var cleanup = function(ctx, goo) {
				if (ctx.bridge) {
					ctx.bridge.disconnect()
				}
			};


			var seekOculusRift = function(onDetect) {
				if (!seeking) return;

				var time = new Date().getTime()*0.003;

				var r = Math.round(99 + Math.sin(time)*88);
				var g = Math.round(100 + Math.cos(time)*25);
				var b = Math.round(99 + Math.sin(0.5+time)*44);

		//		document.getElementById('rift_controller').style.backgroundColor = 'rgb(40 , '+g+' , 25)';
		//		document.getElementById('rift_enabled').style.color = 'rgb('+r*2+','+g*2+','+b+')';

				var oRift = connectBridge(this, onDetect);


				//	console.log("Read GP: ", gamePad)
				if (oRift) {
					seeking = false;
					setTimeout(function() {
						document.getElementById('rift_enabled').innerHTML = "Oculus Rift Bridge Detected";
						document.getElementById('rift_enabled').style.color = '#CFC';
					}, 200)
				} else {
					requestAnimationFrame(function() {
						seekOculusRift(onDetect);
					});
				}
			}.bind(this);

			var onDetect = function(oRift) {
				console.log("Oculus Rift Connection Detected", oRift);
				setTimeout(function() {
					document.getElementById('rift_enabled').innerHTML = "Oculus Rift Connection Established";
					document.getElementById('rift_controller').style.backgroundColor = 'rgb(37, 219, 37)';
					document.getElementById('rift_controller').innerHTML = 'Click to Use';
					document.getElementById('rift_enabled').style.color = '#EFE';
				}, 400);

				var enableRift = function(e) {
					if (event.eventArgs(e).controllerType != 'OculusRift') {
						return;
					}
					this.enableRiftMode();
				}.bind(this);
				event.registerListener(event.list().CONFIGURE_CONTROLLER, enableRift);
			}.bind(this);

			seekOculusRift(onDetect);
			setTimeout(function() {
				document.getElementById('rift_controller').style.backgroundColor = 'rgb(137, 100, 37)';
				document.getElementById('rift_controller').innerHTML = 'Connect Rift..';
				document.getElementById('rift_enabled').innerHTML = "Seeking Oculus Rift";
				document.getElementById('rift_enabled').style.color = '#FC7';
			}, 50)

		};

		OculusRiftInput.prototype.enableRiftMode = function() {
			document.getElementById('rift_controller').innerHTML = 'Rift Active';
			document.getElementById('rift_enabled').innerHTML = "Oculus Rift Rendering Enabled";
			console.log("Enable Rift Mode", this)
			this.useRiftRendering = true;
			this.riftRenderScript = new OculusRiftScripts.RiftRenderScript();
			var enableRift = function(e) {
				this.riftRenderScript.setup(event.eventArgs(e).goo);
				this.riftRenderScript.update(event.eventArgs(e).goo);
			}.bind(this);

			event.registerListener(event.list().ENINGE_READY, enableRift);
		};

		OculusRiftInput.prototype.tickRiftInput = function() {

		};



		return OculusRiftInput;

	}
);
