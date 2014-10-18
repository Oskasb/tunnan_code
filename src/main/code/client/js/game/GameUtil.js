
define(function() {
    var anglePointer;
    var pointAtPoint;

    var determineYAngleFromPosAndRotToPos = function(posS, rotS, posT) {
        var dP = [posT[0]-posS[0], posT[1]-posS[1], posT[2]-posS[2]];
        return Math.atan2(dP[0], dP[2]) - rotS[1]
    };

    var applyRotationToVelocity = function(entity, vel) {
        if (!entity.transformComponent) {
            //    console.log("NO ROT!")
            if (entity.spatial) {
                return entity.spatial.rot.applyPost(vel);
            } else {
                console.log("NO ROTATION MATRIX");
                return vel;
            }
        } else {
            return entity.transformComponent.transform.rotation.applyPost(vel)
        }
    };

	var getInterpolatedInCurveAboveIndex = function(value, curve, index) {
		return curve[index][1] + (value - curve[index][0]) / (curve[index+1][0] - curve[index][0])*(curve[index+1][1]-curve[index][1]);
	};

	var fitValueInCurve = function(value, curve) {
		for (var i = 0; i < curve.length; i++) {
			if (!curve[i+1]) return 0;
			if (curve[i+1][0] > value) return getInterpolatedInCurveAboveIndex(value, curve, i)
		}
		return 0;
	};

	var angleBetweenPoints = function(fromX, fromY, toX, toY) {
		return Math.atan2(toY - fromY, fromX - toX);
	};

	var lineDistance = function(fromX, fromY, toX, toY) {
		return Math.sqrt((fromX - toX)*(fromX - toX) + (fromY - toY)*(fromY - toY));
	};

    return {
        determineYAngleFromPosAndRotToPos:determineYAngleFromPosAndRotToPos,
		angleBetweenPoints:angleBetweenPoints,
		lineDistance:lineDistance,
        applyRotationToVelocity:applyRotationToVelocity,
        fitValueInCurve:fitValueInCurve
    }

});
