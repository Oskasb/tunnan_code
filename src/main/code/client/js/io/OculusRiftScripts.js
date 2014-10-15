"use strict";

define([
	'goo/renderer/Material',
	'goo/renderer/pass/Composer',
	'goo/renderer/pass/FullscreenUtil',
	'goo/renderer/pass/RenderTarget',
	'goo/renderer/Camera',
	'goo/math/Vector3',
	'goo/util/ArrayUtil'
], function(
		Material,
		Composer,
		FullscreenUtil,
		RenderTarget,
		Camera,
		Vector3,
		ArrayUtil
	) {

	var RiftRenderScript = function() {
		this.parameters = [{
			key: 'boost3D',
			name: 'Boost 3D Effect',
			type: 'float',
			control: 'slider',
			'default': 1,
			min: 1,
			max: 20
		}];
	};

	RiftRenderScript.prototype.setup = function(goo) {
		this.goo = goo;
		this.world = goo.world;
		this.pass = new RiftRenderPass(this, goo);
		this.active = false;
	};

	RiftRenderScript.prototype.updateConfig = function(config) {
		this.pass.updateConfig(config);
	};

	RiftRenderScript.prototype.cleanup = function(goo) {
		if (this.hasPreEffect(goo)) {
			PassSwitcher.switchBack(this, goo);
		}
	};

	RiftRenderScript.prototype.update = function() {
			if (this.hasPreEffect()) {
				PassSwitcher.switchBack(this, this.goo);
			}
			PassSwitcher.switchPass(this.pass, this, this.goo);
			console.log('mee');
	};

	RiftRenderScript.prototype.hasPreEffect = function(goo) {
		var renderSystem = this.world.getSystem('RenderSystem');
		if (renderSystem.composers.length === 0) return false;
	//	if (renderSystem.composers[0].passes[0] instanceof goo.RenderPass) return false;
		return true;
	};

		(function(global) {
			var originalPass = null;
			var originalComposer = null;
			var addedPass = null;

			var PassSwitcher = {
				switchPass: function(pass, ctx, goo) {
					console.log("Switch Pass", pass, ctx, goo);
					addedPass = pass;
					var renderSystem = ctx.world.getSystem('RenderSystem');
					// Get or create composer
					var composer
					if (renderSystem.composers.length) {
						composer = renderSystem.composers[0];
						originalPass = composer.passes.shift();
						pass.renderToScreen = false;
					} else {
						originalComposer = composer = new Composer();
						renderSystem.composers.push(composer);
						pass.renderToScreen = true;
					}
					// Add the post effect
					composer.passes.unshift(pass);
					if (composer.size) {
						if (pass.updateSize instanceof Function) {
							pass.updateSize(composer.size, ctx.world.gooRunner.renderer);
						}
						pass.viewportSize = composer.size;
					}
				},
				switchBack: function(ctx, goo) {
					var renderSystem = ctx.world.getSystem('RenderSystem');
					if (originalComposer) {
						originalComposer.destroy(ctx.world.gooRunner.renderer)
						// If we created a post effect chain, remove it
						ArrayUtil.remove(renderSystem.composers, originalComposer);
					} else {
						// Otherwise, remove the post effect and put back the outpass
						var composer = renderSystem.composers[0];
						ArrayUtil.remove(composer.passes, addedPass);
						composer.passes.unshift(originalPass);
					}
				}
			};
			global.PassSwitcher = PassSwitcher;
		}(window));


		'use strict';
		(function() {
			function RiftRenderPass(ctx, goo) {
				this.goo = goo;
				this.ctx = ctx;

				this.camera = new Camera();
				this.fullscreenCamera = FullscreenUtil.camera;
				this.renderToScreen = false;
				this.clear = true;
				this.enabled = true;
				this.needsSwap = true;
				this.eyeOffset = 0.4;
				this.fov = 100;


				// Create composit
				this.material = new Material('Composit material', riftShader);

				// Create eye targets
				this.updateSize({ width: 16, height: 9});
				this.offsetVector = new Vector3();


				this.renderable = {
					meshData: FullscreenUtil.quad,
					materials: [this.material]
				};

				// get the renderlist
				this.renderList = ctx.world.getSystem('RenderSystem').renderList;
				this.setup(ctx, goo);
			}

			RiftRenderPass.prototype.setup = function(args) {
				this.boost = 1 // args.boost3D || 1;
			};
			RiftRenderPass.prototype.destroy = function (renderer) {
				this.leftTarget.destroy(renderer.context);
				this.rightTarget.destroy(renderer.context);
				this.leftTarget = null;
				this.rightTarget = null;
			};

			RiftRenderPass.prototype.updateConfig = function (config) {
				var uniforms = this.material.uniforms;
				uniforms.distortion = config.distortionK;
				uniforms.aberration = config.chromAbParameter;
				uniforms.lensCenterOffset = [
					config.lensSeparationDistance / config.hScreenSize - 0.5,
					0
				];
				this.fov = config.FOV;
				this.eyeOffset = config.interpupillaryDistance * this.boost;


				var r = -1.0 - (4 * (config.hScreenSize/4 - config.lensSeparationDistance/2) / config.hScreenSize);
				var distScale = (config.distortionK[0] +
					config.distortionK[1] * Math.pow(r,2) +
					config.distortionK[2] * Math.pow(r,4) +
					config.distortionK[3] * Math.pow(r,6));
				uniforms.scale = [
					1 / distScale,
					1 / distScale
				]
			};



			RiftRenderPass.prototype.updateSize = function(size, renderer) {
				this.material.uniforms.scaleIn = [
					size.width * 0.5 / size.height,
					1
				];
				if (!this.leftTarget) {
					var size = 1024;
					this.leftTarget = new RenderTarget(size, size);
					this.rightTarget = new RenderTarget(size, size);
				}
			};

			RiftRenderPass.prototype.render = function (
				renderer,
				writeBuffer,
				readBuffer,
				delta,
				maskActive,
				camera,
				lights,
				clearColor
				) {
				camera = camera || this.goo.Renderer.mainCamera;
				if (!camera) { return; }
				this.camera.copy(camera);
				this.camera.setFrustumPerspective(this.fov, 1);
				lights = lights || [];
				var renderList = this.renderList;

				// Left eye
				this.offsetVector.setv(this.camera._left).scale(this.eyeOffset);
				this.camera.translation.addv(this.offsetVector);
				this.camera.update();
				renderer.render(renderList, this.camera, lights, this.leftTarget, this.clear);

				// Right eye
				this.offsetVector.scale(2);
				this.camera.translation.subv(this.offsetVector);
				this.camera.update();
				renderer.render(renderList, this.camera, lights, this.rightTarget, this.clear);

				// Composit
				this.material.setTexture('LEFT_TEX', this.leftTarget);
				this.material.setTexture('RIGHT_TEX', this.rightTarget);
				if (this.renderToScreen) {
					renderer.render(this.renderable, this.fullscreenCamera, [], null, this.clear);
				} else {
					renderer.render(this.renderable, this.fullscreenCamera, [], writeBuffer, this.clear);
				}
			};

			RiftRenderPass.parameters = [{
				key: 'eyeDistance',
				type: 'float',
				min: 0.0,
				max: 0.4,
				'default': 0.1,
				control: 'slider'
			}]

			var riftShader = {
				attributes : {
					vertexPosition : 'POSITION',
					vertexUV0 : 'TEXCOORD0'
				},
				uniforms : {
					viewMatrix: 'VIEW_MATRIX',
					projectionMatrix: 'PROJECTION_MATRIX',
					worldMatrix: 'WORLD_MATRIX',
					leftTex: 'LEFT_TEX',
					rightTex: 'RIGHT_TEX',
					lensCenterOffset: [0, 0],
					distortion: [1, 0.22, 0.24, 0],
					aberration: [0.996, -0.004, 1.014, 0],
					scaleIn: [1,1],
					scale: [0.8,0.8]
				},
				vshader: [
					'attribute vec3 vertexPosition;',
					'attribute vec2 vertexUV0;',

					'uniform mat4 viewMatrix;',
					'uniform mat4 projectionMatrix;',
					'uniform mat4 worldMatrix;',

					'varying vec2 vUv;',
					'void main() {',
					'vUv = vertexUV0;',
					'gl_Position = projectionMatrix * viewMatrix * worldMatrix * vec4( vertexPosition, 1.0 );',
					'}'
				].join('\n'),
				fshader: [
					'uniform sampler2D leftTex;',
					'uniform sampler2D rightTex;',

					'uniform vec2 scaleIn;',
					'uniform vec2 scale;',
					'uniform vec2 lensCenterOffset;',
					'uniform vec4 distortion;',
					'uniform vec4 aberration;',

					'varying vec2 vUv;',

					'vec2 distort(vec2 texCoords, vec2 ab) {',
					// 'vec2 lensOffset = vUv.x > 0.5 ? lensCenterOffset: -lensCenterOffset;',
					'vec2 lensCoords = ((texCoords * 2.0 - 1.0) - lensCenterOffset) * scaleIn;',

					'float rSq = dot(lensCoords, lensCoords);',
					'vec4 r = vec4(1.0, rSq, rSq*rSq, rSq*rSq*rSq);',

					'vec2 newCoords = lensCoords * dot(ab, r.xy) * dot(distortion, r);',
					'return ((newCoords * scale + lensCenterOffset) + 1.0) / 2.0;',
					'}',

					'void main() {',
					'vec2 coord = vUv;',
					'if (vUv.x > 0.5) {', // Right eye
					'coord.x = 1.0 - coord.x;',
					'}',
					'coord.x *= 2.0;',

					'vec2 blue = distort(coord, aberration.zw);',
					'if (!all(equal(clamp(blue, vec2(0.0), vec2(1.0)), blue))) {',
					'discard;',
					'}',

					'vec2 red = distort(coord, aberration.xy);',
					'vec2 green = distort(coord, vec2(1.0, 0.0));',
					'gl_FragColor.a = 1.0;',
					'if (vUv.x > 0.5) {',
					'red.x = 1.0 - red.x;',
					'green.x = 1.0 - green.x;',
					'blue.x = 1.0 - blue.x;',

					'gl_FragColor.r = texture2D(rightTex, red).r;',
					'gl_FragColor.g = texture2D(rightTex, green).g;',
					'gl_FragColor.b = texture2D(rightTex, blue).b;',
					'} else {',
					'gl_FragColor.r = texture2D(leftTex, red).r;',
					'gl_FragColor.g = texture2D(leftTex, green).g;',
					'gl_FragColor.b = texture2D(leftTex, blue).b;',
					'}',
					'}'
				].join('\n')
			};

			window.RiftRenderPass = RiftRenderPass;
		}());

	return {
		RiftRenderScript:RiftRenderScript
	}

});