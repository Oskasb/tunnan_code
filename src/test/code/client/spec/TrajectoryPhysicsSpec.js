

define([
    "physics/TrajectoryPhysics"
],
    function (
        trajectoryPhysics
        ) {

        describe("Distance at Elevation and Velocity", function() {
            it("Expects that zero gives zero", function() {
                expect(trajectoryPhysics.calcDistanceAtElevationAndVelocity(0, 0)).toEqual(0);
                expect(trajectoryPhysics.calcDistanceAtElevationAndVelocity(100, 0)).toEqual(0);
                expect(trajectoryPhysics.calcDistanceAtElevationAndVelocity(100000, 0)).toEqual(0);
                expect(trajectoryPhysics.calcDistanceAtElevationAndVelocity(0, 100)).toEqual(0);
                expect(trajectoryPhysics.calcDistanceAtElevationAndVelocity(0, 100000)).toEqual(0);
            });

            it("Expects some given trajectories elevations and velocities to travel proper distance", function() {
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(1, 10))).toEqual(9);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.5, 1000))).toEqual(0);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.5, 1))).toEqual(0);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.5, 10000))).toEqual(0);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.25, 100))).toEqual(1019);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.25, 200))).toEqual(4077);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.25, 400))).toEqual(16310);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.25, 800))).toEqual(65240);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.125,100))).toEqual(721);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.125,200))).toEqual(2883);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.125,400))).toEqual(11533);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.125,800))).toEqual(46131);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.375,100))).toEqual(721);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.375,200))).toEqual(2883);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.375,400))).toEqual(11533);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationAndVelocity(Math.PI*0.375,800))).toEqual(46131);
            });

            it("Expects some given distance to need proper elevation", function() {
                expect(0.01*Math.round(100*trajectoryPhysics.calcElevationForTrajectory(10, 9, 0))).toEqual(0.54);
                expect(0.01*Math.round(100*trajectoryPhysics.calcElevationForTrajectory(10, 0, 0))).toEqual(0);
                expect(isNaN(0.01*Math.round(100*trajectoryPhysics.calcElevationForTrajectory(10, 90, 0)))).toEqual(true);

                expect(0.1*Math.round(10*trajectoryPhysics.calcElevationForTrajectory(100, 1019, 0))).toEqual(0.1*Math.round(10*Math.PI*0.25));
                expect(0.1*Math.round(10*trajectoryPhysics.calcElevationForTrajectory(200, 4077, 0))).toEqual(0.1*Math.round(10*Math.PI*0.25));
                expect(0.1*Math.round(10*trajectoryPhysics.calcElevationForTrajectory(400, 16300, 0))).toEqual(0.1*Math.round(10*Math.PI*0.25));
                expect(0.1*Math.round(10*trajectoryPhysics.calcElevationForTrajectory(100, 721, 0))).toEqual(0.1*Math.round(10*Math.PI*0.125));
                expect(0.1*Math.round(10*trajectoryPhysics.calcElevationForTrajectory(200, 2883, 0))).toEqual(0.1*Math.round(10*Math.PI*0.125));
                expect(0.1*Math.round(10*trajectoryPhysics.calcElevationForTrajectory(400, 11531, 0))).toEqual(0.1*Math.round(10*Math.PI*0.125));
                expect(0.1*Math.round(10*trajectoryPhysics.calcElevationForTrajectory(800, 46131, 0))).toEqual(0.1*Math.round(10*Math.PI*0.125));
            });

            it("Expects some given trajectory elevations, velocities and height to travel proper distance", function() {
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(1, 10, 0))).toEqual(9);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.5, 1000, 0))).toEqual(0);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.5, 1, 0))).toEqual(0);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.5, 10000, 0))).toEqual(0);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.25, 100, 0))).toEqual(1019);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.25, 200, 0))).toEqual(4077);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.25, 400, 0))).toEqual(16310);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.25, 800, 0))).toEqual(65240);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.125,100, 0))).toEqual(721);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.125,200, 0))).toEqual(2883);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.125,400, 0))).toEqual(11533);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.125,800, 0))).toEqual(46131);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.375,100, 0))).toEqual(721);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.375,200, 0))).toEqual(2883);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.375,400, 0))).toEqual(11533);
                expect(Math.round(trajectoryPhysics.calcDistanceAtElevationVelocityAndHeight(Math.PI*0.375,800, 0))).toEqual(46131);
            });


        });



    });





