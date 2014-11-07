define([
    'goo/renderer/Material',
    'goo/renderer/Camera',
    'goo/math/Vector3',
    'goo/math/Transform',
    'goo/renderer/TextureCreator',
    'goo/renderer/Texture',
    'goo/renderer/MeshData',
    'goo/renderer/Shader',
    'goo/renderer/light/DirectionalLight',
    'goo/util/CanvasUtils',
    'goo/util/Ajax',
    'goo/util/MeshBuilder',
    'goo/noise/Noise',
    'goo/noise/ValueNoise',
	'goo/addons/terrainpack/TerrainSurface',
    'goo/shapes/Quad',
    'goo/renderer/shaders/ShaderBuilder',
    'goo/util/rsvp'
],

        function(
        Material,
        Camera,
        Vector3,
        Transform,
        TextureCreator,
        Texture,
        MeshData,
        Shader,
        DirectionalLight,
        CanvasUtils,
        Ajax,
        MeshBuilder,
        Noise,
        ValueNoise,
        TerrainSurface,
        Quad,
        ShaderBuilder,
        RSVP
        ) {
        "use strict";


        var resourcePath = window.resourcePath;
        var goo;

        function Vegetation(g00, hmm, terrainData) {
            goo = g00;
            this.terrainData = terrainData;

            var dims = this.terrainData.dimensions;
            var xx = dims.minX + (dims.maxX -  dims.minX)*0.5;
            var zz = dims.minZ + (dims.maxZ -  dims.minZ)*0.5;
            var pos = [xx, dims.minY+1, zz];

            this.canvasData = hmm.getTerrainCanvasDataAtPos(pos);

        }

        Vegetation.prototype.init = function(hmm, checkPos, paintVegPoint) {
            var promise = new RSVP.Promise();

            var dims = this.terrainData.dimensions;

            // var meshData = this.createBase(1.0, 0.5);
            var vegetationList = [];
            for (var i = 0; i < types.length; i++) {
                var meshData = this.createBase(types[i]);
                vegetationList[i] = meshData;
            }

            var startX = 13;
            var startZ = 13;

            var meshBuilder = new MeshBuilder();
            var transform = new Transform();
            var spread = 35.0;
            var count = 60000;
            while (count > 0) {
                var xx = dims.minX + (dims.maxX -  dims.minX)*(Math.random());
                var zz = dims.minZ + (dims.maxZ -  dims.minZ)*(Math.random());
                var pos = [xx, 10, zz];
                var yy = hmm.getHeightAt(pos);
                var norm = hmm.getGroundNormal(pos);
                if (yy === null) {
                    console.log("No height at pos: ", pos)
                    yy = 0;
                }
                if (norm === null) {
                    console.log("Pos outside terrain: ", pos)
                    norm = new Vector3(0,1,0);
                }
                var slope = norm.dot(Vector3.UNIT_Y);

                var rand = ((Math.random()+Math.random()-1)/2.0) + 0.5;
                var vegetationType = Math.floor(rand*vegetationList.length);

                if (yy < 1) {
                    vegetationType = Math.floor(Math.random()*2);

                    if (yy < -1.4) {
                        count--;
                        continue;
                    }
                }

                if (slope < 0.9) {
                //    console.log("Slope less than 0.9")
                    count--;
                    continue;
                }

                if (checkPos(this.canvasData, pos) > 0.3) {
                    count--;
                    continue;
                }


                var size = Math.random() * Math.random() * 3 + 1;
                transform.scale.setd(size, size, size);
                transform.translation.setd(0, 0, 0);
                var angle = Math.random() * Math.PI * 0.5;
                var anglex = Math.sin(angle);
                var anglez = Math.cos(angle);
                transform.lookAt(new Vector3(anglex, 0.0, anglez), norm);

                transform.translation.setd(xx, yy, zz);

                transform.update();

                var meshData = vegetationList[vegetationType];
                meshBuilder.addMeshData(meshData, transform);


                paintVegPoint(pos, size*0.2+0.2*Math.random(), 2+size*2+Math.random()*2)



                count--;
            }
            var meshDatas = meshBuilder.build();

            var material = new Material(vegetationShader, 'vegetation');
            var texture = new TextureCreator().loadTexture2D(resourcePath + 'images/textures/nature1024.png', null, function() {
                promise.resolve();
            });
            material.setTexture('DIFFUSE_MAP', texture);

            material.cullState.enabled = false;
            material.uniforms.discardThreshold = 0.9;
            material.blendState.blending = 'NoBlending';
            material.uniforms.materialAmbient = [0.4, 0.4, 0.4, 1.0];
            material.uniforms.materialSpecular = [0.1, 0.1, 0.01, 1.0];
            material.uniforms.specularIntensity = 0.01;
            material.renderQueue = 2001;
        //    material.ref = false;

            for (var key in meshDatas) {
                var entity = goo.world.createEntity(meshDatas[key], material);

                entity.meshRendererComponent.castShadows = false;
                entity.meshRendererComponent.isReflectable = false;
                entity.meshRendererComponent.receiveShadows = false;
            //    entity.console.log("PARTICLE MESH COMPONENT: ",meshRendererComponent);
                entity.meshRendererComponent.materials.push(material);
            //    entity.setComponent(meshRendererComponent);

                entity.addToWorld();
            }

            return promise;
        };

        var types = [
            { w: 1.4, h: 2.1, tx: 0.004, ty: 0.70,  tw: 0.13,  th: 0.13  },
            { w: 1.4, h: 2.1, tx: 0.004, ty: 0.54,  tw: 0.15,  th: 0.16  },
            { w: 0.5, h: 0.5, tx: 0.02, ty: 0.875, tw: 0.128, th: 0.11  },
            { w: 2.6, h: 4.1, tx: 0.14, ty: 0.73,  tw: 0.19,  th: 0.27  },
            { w: 1.8, h: 1.1, tx: 0.34, ty: 0.79,  tw: 0.33,  th: 0.21  },
            { w: 1.8, h: 1.1, tx: 0.34, ty: 0.79,  tw: 0.33,  th: 0.21  },
            { w: 0.8, h: 0.5, tx: 0.14, ty: 0.59,  tw: 0.28,  th: 0.13  }
        ];

        Vegetation.prototype.createBase = function(type) {
            var meshData = new Quad(type.w, type.h, 1, 1);
            meshData.attributeMap.BASE = MeshData.createAttribute(1, 'Float');
                meshData.rebuildData(meshData.vertexCount, meshData.indexCount, true);
            // meshData.rebuild();

            meshData.getAttributeBuffer(MeshData.TEXCOORD0).set([
                type.tx, type.ty,
                type.tx, type.ty + type.th,
                type.tx + type.tw, type.ty + type.th,
                type.tx + type.tw, type.ty
            ]);

            meshData.getAttributeBuffer('BASE').set([
                0, 1 * type.h, 1 * type.h, 0
            ]);

            var meshBuilder = new MeshBuilder();
            var transform = new Transform();
            // transform.translation.x = (Math.random() * 2.0 - 1.0) * spread;
            transform.translation.y = type.h * 0.5;
            // transform.translation.z = (Math.random() * 2.0 - 1.0) * spread;
            transform.update();

            meshBuilder.addMeshData(meshData, transform);

            transform.setRotationXYZ(0, Math.PI * 0.5, 0);
            transform.update();

            meshBuilder.addMeshData(meshData, transform);

            var meshDatas = meshBuilder.build();

            return meshDatas[0];
        };

        var vegetationShader = {
            processors: [
                ShaderBuilder.light.processor
            ],
            attributes : {
                vertexPosition : MeshData.POSITION,
                vertexNormal : MeshData.NORMAL,
                vertexUV0 : MeshData.TEXCOORD0,
                base : 'BASE'
            },
            uniforms : {
                viewProjectionMatrix : Shader.VIEW_PROJECTION_MATRIX,
                worldMatrix : Shader.WORLD_MATRIX,
                cameraPosition : Shader.CAMERA,
                diffuseMap : Shader.DIFFUSE_MAP,
                discardThreshold: -0.01,
                time : Shader.TIME
            },
            builder: function (shader, shaderInfo) {
                ShaderBuilder.light.builder(shader, shaderInfo);
            },
            vshader: function () {
                return [
                    'attribute vec3 vertexPosition;',
                    'attribute vec3 vertexNormal;',
                    'attribute vec2 vertexUV0;',
                    'attribute float base;',

                    'uniform mat4 viewProjectionMatrix;',
                    'uniform mat4 worldMatrix;',
                    'uniform vec3 cameraPosition;',
                    'uniform float time;',

                    ShaderBuilder.light.prevertex,

                    'varying vec3 normal;',
                    'varying vec3 vWorldPos;',
                    'varying vec3 viewPosition;',
                    'varying vec2 texCoord0;',

                    'void main(void) {',
                    'vec3 swayPos = vertexPosition;',
                    'swayPos.x += sin(time * 0.5 + swayPos.x * 0.4) * base * sin(time * 1.5 + swayPos.y * 0.4) * 0.1 + 0.08;',
                    '	vec4 worldPos = worldMatrix * vec4(swayPos, 1.0);',
                    '	vWorldPos = worldPos.xyz;',
                    '	gl_Position = viewProjectionMatrix * worldPos;',

                    ShaderBuilder.light.vertex,

                    '	normal = (worldMatrix * vec4(vertexNormal, 0.0)).xyz;',
                    '	texCoord0 = vertexUV0;',
                    '	viewPosition = cameraPosition - worldPos.xyz;',
                    '}'//
                ].join('\n');
            },
            fshader: function () {
                return [
                    'uniform sampler2D diffuseMap;',
                    'uniform float discardThreshold;',

                    ShaderBuilder.light.prefragment,

                    'varying vec3 normal;',
                    'varying vec3 vWorldPos;',
                    'varying vec3 viewPosition;',
                    'varying vec2 texCoord0;',

                    'void main(void)',
                    '{',
                    '	vec4 final_color = texture2D(diffuseMap, texCoord0);',
                    'if (final_color.a < discardThreshold) discard;',

                    '	vec3 N = normalize(normal);',

                    ShaderBuilder.light.fragment,

                    '	gl_FragColor = final_color;',
                    '}'//
                ].join('\n');
            }
        };

        return Vegetation;
    });