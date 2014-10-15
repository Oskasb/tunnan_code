define([
    'goo/renderer/Material',
    'goo/renderer/Camera',
    'goo/math/Vector3',
    'goo/renderer/TextureCreator',
    'goo/renderer/Texture',
    'goo/renderer/MeshData',
    'goo/renderer/Shader',
    'goo/renderer/light/DirectionalLight',
    'goo/util/CanvasUtils',
    'goo/util/Ajax',
    'goo/noise/Noise',
    'goo/noise/ValueNoise',
	'goo/addons/terrainpack/TerrainSurface',
    'goo/renderer/shaders/ShaderBuilder',
    'goo/renderer/shaders/ShaderFragment',
    'goo/entities/EntityUtils',
    'goo/scriptpack/WorldFittedTerrainScript',
    'goo/renderer/shaders/ShaderLib',
    '3d/addons/Vegetation',
    '3d/addons/Forrest',
    'goo/util/rsvp',
    'physics/PhysicalWorld',
    '3d/Colorer'

],
    /** @lends */
        function(
        Material,
        Camera,
        Vector3,
        TextureCreator,
        Texture,
        MeshData,
        Shader,
        DirectionalLight,
        CanvasUtils,
        Ajax,
        Noise,
        ValueNoise,
        TerrainSurface,
        ShaderBuilder,
        ShaderFragment,
        EntityUtils,
        WorldFittedTerrainScript,
        ShaderLib,
        Vegetation,
        Forrest,
        RSVP,
        PhysicalWorld,
        Colorer
        ) {
        "use strict";

        function Terrain() {
            this.material = null;
            this.paintable = null;
            this.colorTx = null;
        }

        var resourcePath = 'resources/images/terrain';
        var rockTile = 'resources/images/tiles/striperock.png';
        var grassTile = 'resources/images/tiles/grass.png';
        var slabsTile = 'resources/images/tiles/darkrock.png';
        var mudTile = 'resources/images/tiles/mud.png';
        var detailTile = 'resources/images/tiles/detail.png';
        var cracksTile = 'resources/images/tiles/crackstile.png';
        var rockTileN = 'resources/images/tiles/striperock.png';
        var grassTileN = 'resources/images/tiles/grass.png';
        var slabsTileN = 'resources/images/tiles/slabs.png';
        var mudTileN = 'resources/images/tiles/mud.png';

        Terrain.prototype.buildCanvasTexture = function(texturePath, callback) {


            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            var img = new Image();

            console.log("MAKE TERRAIN MATERIAL", texturePath)

            var canvasMaterial = function(cnv) {
                var diff = new Texture( canvas, null, cnv.width, cnv.height);
                callback(diff, img, canvas);
            };

            img.onload = function(){
                console.log("TERRAIN MATERIAL IMAGE LOADED", img)
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.dataReady = true;
                canvasMaterial(canvas)
            };
            img.src = texturePath;
        };

        Terrain.prototype.init = function(goo, heightDataUrl, dims, ws, colorTxUrl, terrainReadyCB) {
            var promise = new RSVP.Promise();

            var canvasUtils = new CanvasUtils();


        //    this.buildCanvasTexture(colorTxUrl);

            canvasUtils.loadCanvasFromPath(heightDataUrl, function(canvas) {

                var matrix = canvasUtils.getMatrixFromCanvas(canvas);
                this._buildMesh(goo, resourcePath, matrix, dims, 128, 128, colorTxUrl, terrainReadyCB);

                // promise.resolve();

            //    var ws = new WorldFittedTerrainScript();
                var terrainData1 = ws.addHeightData(matrix, dims);

           //     var vegetationPromise = new Vegetation().init(goo, ws, dims, resourcePath);
           //     var forrestPromise = new Forrest().init(goo, ws, resourcePath);
            //    , forrestPromise
            //  RSVP.all().then(function() {
                    promise.resolve();
           //   });
            }.bind(this));

            return promise;
        };

        Terrain.prototype.getPaintable = function() {
            return this.paintable;
        };

        Terrain.prototype._buildMesh = function(goo, resourcePath, matrix, dim, widthPoints, lengthPoints, colorTxUrl, terrainReadyCB) {

        //    PhysicalWorld.addHeightmap(resourcePath, matrix, dim, widthPoints, lengthPoints);



            var xw = dim.maxX - dim.minX;
            var yw = dim.maxY - dim.minY;
            var zw = dim.maxZ - dim.minZ;

            var meshData = new TerrainSurface(matrix, xw, yw, zw);
            var material = new Material(terrainShader, 'Terrain');

            PhysicalWorld.addPhysicalWorldMesh(meshData, dim.minX, dim.minY, dim.minZ);

            material.uniforms.materialAmbient = [0.0, 0.0, 0.0, 1.0];
            material.uniforms.materialDiffuse = [1.5, 1.5, 1.5, 1.0];
        //    material.uniforms.materialSpecularPower = 0.01;
        //    material.uniforms.materialSpecular = [12.4, 12.4, 12.4, 1];

			                                                            LOAD
            var texturenorm = new TextureCreator().loadTexture2D(resourcePath + '/start_norm.png');
            material.setTexture('NORMAL_MAP2', texturenorm);

            var anisotropy = 4;
            var grass1 = new TextureCreator().loadTexture2D(grassTile, {
                anisotropy: anisotropy
            });
            var slabs = new TextureCreator().loadTexture2D(slabsTile, {
                anisotropy: anisotropy
            });
            var mud = new TextureCreator().loadTexture2D(mudTile, {
                anisotropy: anisotropy
            });
            var stone = new TextureCreator().loadTexture2D(rockTile, {
                anisotropy: anisotropy
            });
            var detail = new TextureCreator().loadTexture2D(detailTile, {
                anisotropy: anisotropy
            });

            var cracks = new TextureCreator().loadTexture2D(cracksTile, {
                anisotropy: anisotropy
            });

            var instance = this;

            var callback = function(canvasTx, sourceImage, canvas) {

                instance.paintable = Colorer.registerCanvasTexture("terrain_canvas", canvasTx, sourceImage, canvas);

                material.setTexture('GROUND_MAP1', stone);
                material.setTexture('GROUND_MAP2', slabs);
                material.setTexture('GROUND_MAP3', mud);
                material.setTexture('GROUND_MAP4', grass1);
                material.setTexture('GROUND_MAP5', detail);
                material.setTexture('GROUND_MAP6', cracks);
                material.setTexture('GROUND_MAP7', canvasTx);

                var grass1n = new TextureCreator().loadTexture2D(grassTileN, {
                    anisotropy: anisotropy
                });
                var slabsn = new TextureCreator().loadTexture2D(slabsTileN, {
                    anisotropy: anisotropy
                });
                var mudn = new TextureCreator().loadTexture2D(mudTileN, {
                    anisotropy: anisotropy
                });
                var stonen = new TextureCreator().loadTexture2D(rockTileN, {
                    anisotropy: anisotropy
                });
                material.setTexture('GROUND_MAP1_NORMALS', stonen);
                material.setTexture('GROUND_MAP2_NORMALS', slabsn);
                material.setTexture('GROUND_MAP3_NORMALS', mudn);
                material.setTexture('GROUND_MAP4_NORMALS', grass1n);

                // var material2 = Material.createMaterial(ShaderLib.simpleColored, 'Terrain2');
                // material2.wireframe = true;
                var surfaceEntity = goo.world.createEntity('Terrain', meshData, material);
                surfaceEntity.transformComponent.transform.translation.setd(dim.minX, dim.minY, dim.minZ);
                surfaceEntity.transformComponent.setUpdated();
                surfaceEntity.addToWorld();

                surfaceEntity.meshRendererComponent.cullMode = 'Never';
                terrainReadyCB();
            };

            this.buildCanvasTexture(colorTxUrl, callback);


        };

        var terrainShader = {
            processors: [
                ShaderBuilder.uber.processor,
                ShaderBuilder.light.processor,
                ShaderBuilder.animation.processor
            ],
            attributes: {
                vertexPosition: MeshData.POSITION,
                vertexNormal: MeshData.NORMAL,
                vertexTangent: MeshData.TANGENT,
                vertexColor: MeshData.COLOR,
                vertexUV0: MeshData.TEXCOORD0,
                vertexUV1: MeshData.TEXCOORD1,
                vertexJointIDs: MeshData.JOINTIDS,
                vertexWeights: MeshData.WEIGHTS
            },
            uniforms: {
                viewProjectionMatrix: Shader.VIEW_PROJECTION_MATRIX,
                worldMatrix: Shader.WORLD_MATRIX,
                normalMatrix: Shader.NORMAL_MATRIX,

                cameraTranslation: Shader.CAMERA_TRANSLATION,
                cameraPosition: Shader.CAMERA,
                normalMap2: 'NORMAL_MAP2',
                groundMap1: 'GROUND_MAP1',
                groundMap2: 'GROUND_MAP2',
                groundMap3: 'GROUND_MAP3',
                groundMap4: 'GROUND_MAP4',
                groundMap5: 'GROUND_MAP5',
                groundMap6: 'GROUND_MAP6',
                groundMap7: 'GROUND_MAP7',
                groundMapN1: 'GROUND_MAP1_NORMALS',
                groundMapN2: 'GROUND_MAP2_NORMALS',
                groundMapN3: 'GROUND_MAP3_NORMALS',
                groundMapN4: 'GROUND_MAP4_NORMALS',
                diffuseMap: Shader.DIFFUSE_MAP,
                offsetRepeat: [0, 0, 1, 1],
                normalMap: Shader.NORMAL_MAP,
                normalMultiplier: 1.0,
                specularMap: Shader.SPECULAR_MAP,
                emissiveMap: Shader.EMISSIVE_MAP,
                aoMap: Shader.AO_MAP,
                lightMap: Shader.LIGHT_MAP,
                environmentCube: 'ENVIRONMENT_CUBE',
                environmentSphere: 'ENVIRONMENT_SPHERE',
                reflectionMap: 'REFLECTION_MAP',
                transparencyMap: 'TRANSPARENCY_MAP',
                opacity: 1.0,
                reflectivity: 0.0,
                refractivity: 0.0,
                etaRatio: 0.0,
                fresnel: 0.0,
                discardThreshold: -0.01,
                fogSettings: [0, 10000],
                fogColor: [1, 1, 1],
                shadowDarkness: 0.5
            },
            builder: function(shader, shaderInfo) {
                ShaderBuilder.light.builder(shader, shaderInfo);
            },
            vshader: function() {
                return [
                    'attribute vec3 vertexPosition;',

                    '#ifdef NORMAL',
                    'attribute vec3 vertexNormal;',
                    '#endif',
                    '#ifdef TANGENT',
                    'attribute vec4 vertexTangent;',
                    '#endif',
                    '#ifdef COLOR',
                    'attribute vec4 vertexColor;',
                    '#endif',
                    '#ifdef TEXCOORD0',
                    'attribute vec2 vertexUV0;',
                    'uniform vec4 offsetRepeat;',
                    'varying vec2 texCoord0;',
                    '#endif',
                    '#ifdef TEXCOORD1',
                    'attribute vec2 vertexUV1;',
                    'varying vec2 texCoord1;',
                    '#endif',

                    'uniform mat4 viewProjectionMatrix;',
                    'uniform mat4 worldMatrix;',
                    'uniform mat4 normalMatrix;',
                    'uniform vec3 cameraPosition;',
                    'uniform vec3 cameraTranslation;',

                    'varying vec3 vWorldPos;',
                    'varying vec3 viewPosition;',
                    '#ifdef NORMAL',
                    'varying vec3 normal;',
                    '#endif',
                    '#ifdef TANGENT',
                    'varying vec3 binormal;',
                    'varying vec3 tangent;',
                    '#endif',
                    '#ifdef COLOR',
                    'varying vec4 color;',
                    '#endif',

                    'varying float noise;',
                    'varying float noise2;',

                    ShaderBuilder.light.prevertex,

                    'void main(void) {',
                    'mat4 wMatrix = worldMatrix;',
                    '#ifdef NORMAL',
                    'mat4 nMatrix = normalMatrix;',
                    '#endif',

                    // 'float height = texture2D(heightMap, vertexUV0).r * 50.0;',
                    // 'vec4 worldPos = wMatrix * vec4(vertexPosition.x, height, vertexPosition.z, 1.0);',
                    'vec4 worldPos = wMatrix * vec4(vertexPosition, 1.0);',
                    'vWorldPos = worldPos.xyz;',
                    'gl_Position = viewProjectionMatrix * worldPos;',

                 //   'viewPosition = cameraPosition - worldPos.xyz;',

                    'viewPosition = worldPos.xyz;',

                    '#ifdef NORMAL',
                    '	normal = normalize((nMatrix * vec4(vertexNormal, 0.0)).xyz);',
                    '#endif',
                    '#ifdef TANGENT',
                    '	tangent = normalize((nMatrix * vec4(vertexTangent.xyz, 0.0)).xyz);',
                    '	binormal = cross(normal, tangent) * vec3(vertexTangent.w);',
                    '#endif',
                    '#ifdef COLOR',
                    '	color = vertexColor;',
                    '#endif',
                    '#ifdef TEXCOORD0',
                    '	texCoord0 = vertexUV0 * offsetRepeat.zw * 1.0 + offsetRepeat.xy;',
                    '#endif',
                    '#ifdef TEXCOORD1',
                    '	texCoord1 = vertexUV1;',
                    '#endif',

                    ShaderBuilder.light.vertex,

                    'noise = (sin(texCoord0.x * 9450.0) + sin(texCoord0.y * 9450.0))*0.25+0.5;',
                    //  * (sin(texCoord0.x * 1450.0) + sin(texCoord0.y * 1450.0))*0.25+0.5;',
                    'noise2 = 0.0;',
                    '}'
                ].join('\n');
            },
            fshader: function() {
                return [
                    'uniform sampler2D normalMap2;',

                    'uniform sampler2D groundMap1;',
                    'uniform sampler2D groundMap2;',
                    'uniform sampler2D groundMap3;',
                    'uniform sampler2D groundMap4;',
                    'uniform sampler2D groundMap5;',
                    'uniform sampler2D groundMap6;',
                    'uniform sampler2D groundMap7;',
                    'uniform sampler2D groundMapN1;',
                    'uniform sampler2D groundMapN2;',
                    'uniform sampler2D groundMapN3;',
                    'uniform sampler2D groundMapN4;',

                    // '#ifdef NORMAL_MAP',
                    // 'uniform sampler2D normalMap;',
                    // 'uniform float normalMultiplier;',
                    // '#endif',
                    '#ifdef SPECULAR_MAP',
                    'uniform sampler2D specularMap;',
                    '#endif',

                    '#ifdef FOG',
                    'uniform vec2 fogSettings;',
                    'uniform vec3 fogColor;',
                    '#endif',

                    'varying vec3 vWorldPos;',
                    'varying vec3 viewPosition;',
                    '#ifdef NORMAL',
                    'varying vec3 normal;',
                    '#endif',
                    '#ifdef TANGENT',
                    'varying vec3 binormal;',
                    'varying vec3 tangent;',
                    '#endif',
                    '#ifdef TEXCOORD0',
                    'varying vec2 texCoord0;',
                    '#endif',
                    '#ifdef TEXCOORD1',
                    'varying vec2 texCoord1; //Use for lightmap',
                    '#endif',

                    'varying float noise;',
                    'varying float noise2;',

                    ShaderBuilder.light.prefragment,
                    ShaderFragment.noise2d,

                    'void main(void)',
                    '{',
                    'vec4 final_color = vec4(1.0);',

                    // procedural texturing calc

                    'vec2 coord  = texCoord0 * vec2(16.0);',
                    'vec2 coord1 = texCoord0 * vec2(40.0);',
                    'vec2 coord2 = texCoord0 * vec2(78.5);',
                    'vec2 coord3 = texCoord0 * vec2(124.0);',
                    'vec2 coord4 = texCoord0 * vec2(420.0);',
                    'vec2 coord5 = texCoord0 * vec2(1124.0);',

                    'vec3 landNormal = (texture2D(normalMap2, texCoord0).xyz * vec3(2.0) - vec3(1.0)).xzy;',
                    'landNormal.y = 0.5;',
                    'landNormal = normalize(landNormal);',
                    'vec3 landTangent = vec3(1.0, 0.0, 0.0);',
                    'vec3 landBinormal = cross(landNormal, landTangent);',
                    'mat3 tangentToWorld = mat3(landTangent, landBinormal, landNormal);',

                    'float slope = clamp(1.0 - dot(landNormal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);',
                    'slope = smoothstep(0.0, 0.5, slope);',

                    'const float NMUL = 1.2;',
                    // 'const float FADEMUL = 0.1;',

                    'vec3 mountainN = texture2D(groundMapN1, coord1).xyz * vec3(1.0) - vec3(1.0);', 'mountainN.z = NMUL;',
                    'vec3 n1 = texture2D(groundMapN2, coord2).xyz * vec3(0.5) - vec3(1.0);', 'n1.z = NMUL;',
                    'vec3 n2 = texture2D(groundMapN3, coord3).xyz * vec3(2.0) - vec3(1.0);', 'n2.z = NMUL;',
                    // 'vec3 n3 = texture2D(groundMapN3, coord).xyz * vec3(2.0) - vec3(1.0);', 'n3.z = NMUL;',


                    'vec3 tangentNormal = mix(n1, n2, smoothstep(0.0, 1.0, noise));',
                    // 'tangentNormal = mix(tangentNormal, n3, smoothstep(0.5, 1.0, noise2));',
                    'tangentNormal = mix(tangentNormal, mountainN, slope);',

                    'vec3 worldNormal = (tangentToWorld * tangentNormal);',
                    'vec3 N = normalize(worldNormal);',
                //    'N.z = -N.z;',

                    // 'N = normalize(landNormal);',

                    'vec4 mountain = texture2D(groundMap1, coord1);',
                    'vec4 g1 = texture2D(groundMap2, coord2);',
                    'vec4 g2 = texture2D(groundMap3, coord3);',
                    'vec4 g3 = texture2D(groundMap4, coord4);',
                    'vec4 detail = texture2D(groundMap5, coord);',
                    'vec4 detail2 = texture2D(groundMap6, coord5);',
                    'vec4 colors = texture2D(groundMap7, texCoord0);',
                    // 'vec4 tex1 = texture2D(groundMap1, coord);',
                    // 'vec4 tex2 = texture2D(groundMap1, coord2);',
                    // 'vec4 g1 = mix(tex1, tex2, min(length(viewPosition) * FADEMUL, 1.0));',

                    // 'tex1 = texture2D(groundMap2, coord);',
                    // 'tex2 = texture2D(groundMap2, coord2);',
                    // 'vec4 g2 = mix(tex1, tex2, min(length(viewPosition) * FADEMUL, 1.0));',

                    // 'tex1 = texture2D(groundMap3, coord);',
                    // 'tex2 = texture2D(groundMap3, coord2);',
                    // 'vec4 g3 = mix(tex1, tex2, min(length(viewPosition) * FADEMUL, 1.0));',

                    // 'tex1 = texture2D(groundMap4, coord);',
                    // 'tex2 = texture2D(groundMap4, coord2);',
                    // 'vec4 mountain = mix(tex1, tex2, min(length(viewPosition) * FADEMUL, 1.0));',


                    'final_color = mix(mountain, g1, clamp(((landNormal.y+noise*0.6)*1.2) - 0.7, 0.0, 1.0));',
                    //   'final_color = g2;',
                    // 'final_color = mix(final_color, g3, smoothstep(0.5, 1.0, noise2));',

                 //   'slope = clamp(dot(tangentNormal, vec3(0.0, 1.0, 0.0)), 0.0, 1.0);',

                //    'slope = smoothstep(0.0, 1.0, slope);',

                    'final_color = mix(final_color, g2, clamp(((landNormal.y-noise*0.13)*16.2) - 10.6, 0.0, 1.0));',

                    'final_color = mix(final_color, g3, clamp((landNormal.y*31.0-noise*6.1) - 21.0, 0.0, 1.0));',
                    'final_color = mix(final_color, colors, colors.a);',
                    'final_color = mix(final_color, detail, detail.a * final_color.r );',
                    'final_color = mix(final_color, detail2, detail2.a * (final_color.r - (final_color.r * final_color.g * final_color.b)));',
                    // 'final_color = vec4(mountain);',
                    // 'final_color = vec4(1.0);',
                    // 'final_color = vec4(slope);',

                    ShaderBuilder.light.fragment,

                    // 'final_color = vec4(N, 1.0);',

                    // 'final_color.rgb += totalSpecular;',
                    // 'final_color.a += min(length(totalSpecular), 1.0);',

                    '#ifdef FOG',
                    'float d = pow(smoothstep(fogSettings.x, fogSettings.y, length(viewPosition)), 1.0);',
                    'final_color.rgb = mix(final_color.rgb, fogColor, d);',
                    '#endif',

                    'gl_FragColor = final_color;',
                    '}'
                ].join('\n');
            }
        };

        return Terrain;
    });