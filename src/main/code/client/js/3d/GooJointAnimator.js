"use strict";

define([
    'goo/math/Quaternion',
    'goo/math/Matrix4x4',
    'goo/math/Matrix3x3',
    'goo/math/Vector3'
], function(
    Quaternion,
    Matrix4x4,
    Matrix3x3,
    Vector3
    ) {

    var calcQuat = new Quaternion();
    var calcMat3 = new Matrix3x3();
    var calcMat4 = new Matrix4x4();
    var calcVec = new Vector3();

	var entityPoseMap = {};

    var rotateBone = function(bone, dx, dy, dz) {
        calcMat3.copy(bone.sourceMatrix);

        if (dx) calcMat3.rotateX(dx);
        if (dy) calcMat3.rotateY(dy);
        if (dz) calcMat3.rotateZ(dz);
        calcQuat.fromRotationMatrix(calcMat3);

        bone._rotations[0] = calcQuat.data[0];
        bone._rotations[1] = calcQuat.data[1];
        bone._rotations[2] = calcQuat.data[2];
        bone._rotations[3] = calcQuat.data[3];
    };


    var scaleBone = function(bone, scale) {
        bone._scales[0] = scale;
        bone._scales[1] = scale;
        bone._scales[2] = scale;
    };

    var addRotationToBone = function(bone, dx, dy, dz) {
        calcMat3.copy(bone.sourceMatrix);
        calcMat3.rotateX(dx);
        calcMat3.rotateY(dy);
        calcMat3.rotateZ(dz);
        calcQuat.fromRotationMatrix(calcMat3);

        bone._rotations[0] += calcQuat.data[0];
        bone._rotations[1] += calcQuat.data[1];
        bone._rotations[2] += calcQuat.data[2];
        bone._rotations[3] += calcQuat.data[3];
    };


    var translateBone = function(bone, translation) {
    //    console.log(originalTransform.translation.data[1])
        bone._translations[0] = translation[0]+bone.sourceTranslation[0];
        bone._translations[1] = translation[1]+bone.sourceTranslation[1]; // = translation // [originalTransform.translation.data[0] + translation[0], originalTransform.translation.data[1] + translation[1], originalTransform.translation.data[2] + translation[2]]
        bone._translations[2] = translation[2]+bone.sourceTranslation[2];
    };

    var printClipInitialTransform = function(gameEntity) {
		console.log(gameEntity.geometries[0])

		if (entityPoseMap[gameEntity.geometries[0].id]) {
			gameEntity.pieceData.boneMap = entityPoseMap[gameEntity.geometries[0].id].boneMap;
			gameEntity.animationChannels = entityPoseMap[gameEntity.animationChannels[0].id].animationChannels;
			return;
		}

        if (!gameEntity.geometries[0].animationComponent.layers[0]._currentState) {
            alert("No Source Tree loaded yet?")
        }

        gameEntity.pieceData.boneMap = {};
		console.log('Setup bone map', gameEntity.geometries[0].animationComponent.layers[0])
	//	var currentStateId = gameEntity.geometries[0].animationComponent.layers[0]._currentState.id;

        var clip = gameEntity.geometries[0].animationComponent.layers[0]._currentState._sourceTree._clip;
        for (var i = 0; i < clip._channels.length; i++) {
            gameEntity.pieceData.boneMap[clip._channels[i]._jointName] = i;
            clip._channels[i].sourceTranslation = [clip._channels[i]._translations[0], clip._channels[i]._translations[1], clip._channels[i]._translations[2]];
            calcQuat.seta(clip._channels[i]._rotations);
            clip._channels[i].sourceMatrix = calcQuat.toRotationMatrix();
        }

        gameEntity.animationChannels = clip._channels;

		entityPoseMap[gameEntity.geometries[0].id] = {
			animationChannels:clip._channels,
			boneMap:gameEntity.pieceData.boneMap
		};

    };


    var updateEntityBoneRotX = function(entity, boneId, x) {
        var bone = entity.animationChannels[entity.pieceData.boneMap[boneId]];
        if (bone == undefined) console.log("No Bone:", boneId, entity.animationChannels);
        rotateBone(bone, x);
    };

    var setEntityBoneScale = function(entity, boneId, value) {
        var bone = entity.animationChannels[entity.pieceData.boneMap[boneId]];
        if (bone == undefined) console.log("No Bone:", boneId, entity.animationChannels);
        scaleBone(bone, value);
    };

    var updateEntityBoneRotXYZ = function(entity, boneId, x, y, z) {
        var bone = entity.animationChannels[entity.pieceData.boneMap[boneId]];
        if (bone == undefined) console.log("No Bone:", boneId, entity.animationChannels);
        rotateBone(bone, x, y, z);
    };

	var resetEntityAnimationState = function(entity) {
		for (var index in entity.animationChannels) {
			rotateBone(entity.animationChannels[index], 0, 0, 0);
			scaleBone(entity.animationChannels[index], 1);
			translateBone(entity.animationChannels[index], [0, 0, 0]);
		}
	};

    return {
		resetEntityAnimationState:resetEntityAnimationState,
        rotateBone:rotateBone,
        addRotationToBone:addRotationToBone,
        translateBone:translateBone,
        printClipInitialTransform:printClipInitialTransform,
        updateEntityBoneRotX:updateEntityBoneRotX,
        updateEntityBoneRotXYZ:updateEntityBoneRotXYZ,
        setEntityBoneScale:setEntityBoneScale
    }
});