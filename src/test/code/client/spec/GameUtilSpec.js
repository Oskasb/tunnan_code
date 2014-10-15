

define([
    "game/GameUtil"
],
    function (
        GameUtil
        ) {

        describe("Verify misc orientation utils", function() {
            it("Expects angles from sourceposrot to targetpos to be decent", function() {
                expect(GameUtil.determineYAngleFromPosAndRotToPos([0, 0, 0], [0, 0, 0], [0, 0, 1])).toEqual(0);
                expect(GameUtil.determineYAngleFromPosAndRotToPos([0, 0, 0], [0, 0, 0], [1, 0, 0])).toEqual(Math.PI*0.5);
                expect(GameUtil.determineYAngleFromPosAndRotToPos([0, 0, 0], [0, Math.PI*0.5, 0], [0, 1, 0])).toEqual(-Math.PI*0.5);
                expect(GameUtil.determineYAngleFromPosAndRotToPos([0, 0, 0], [0, 0, 0], [1, 0, 1])).toEqual(Math.PI*0.25);
                expect(GameUtil.determineYAngleFromPosAndRotToPos([0, 0, 0], [0, Math.PI*0.5, 0], [1, 0, 1])).toEqual(-Math.PI*0.25);
             });

        });



    });


