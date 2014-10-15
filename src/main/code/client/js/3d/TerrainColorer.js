define([
    'goo/entities/components/MeshDataComponent',
    'goo/entities/components/MeshRendererComponent',
    'goo/renderer/MeshData',
    'goo/renderer/Shader',
    'goo/renderer/Material',
    'goo/renderer/shaders/ShaderLib',
    'goo/renderer/Texture',
    'goo/renderer/TextureCreator'
],
    /** @lends */
        function(
        MeshDataComponent,
        MeshRendererComponent,
        MeshData,
        Shader,
        Material,
        ShaderLib,
        Texture,
        TextureCreator
        ) {
        "use strict";

        var normalsPath = "resources/images/textures/ground_stones_normal.png";

        function makeTerrainMaterial(texturePath, callback) {

            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            var img = new Image();

            console.log("MAKE TERRAIN MATERIAL", texturePath)

            var canvasMaterial = function(cnv) {
                var material = new Material(ShaderLib.uber, "ground_colors");
                var diff = new Texture( canvas, null, cnv.width, cnv.height);
                material.setTexture('DIFFUSE_MAP', diff);

                material.materialState.ambient = [
                    0.0,
                    0.0,
                    0.0,
                    1
                ];
                material.materialState.diffuse = [
                    0.45909090909090909,
                    0.46909090909090909,
                    0.25909090909090909,
                    1
                ];
                material.cullState.frontFace = "CW";
                material.cullState.cullFace = "Back";
                material.cullState.enabled = false;
                //    emissive: materialData.uniforms.materialEmissive,
                material.materialState.specular = [0.02, 0.016, 0.006, 0.5];
                material.materialState.emissive = [0, 0, 0, 1];
                material.materialState.shininess = 4.1;
                console.log("CANVAS MATERIAL LOADED", material)
                callback(material, diff, img, canvas);
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
        }

        return {
            makeTerrainMaterial:makeTerrainMaterial
        };
    });