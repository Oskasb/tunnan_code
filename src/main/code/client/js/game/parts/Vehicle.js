"use strict";

define(['game/world/PhysicalWorld',
    "application/EventManager",
    "3d/GooJointAnimator"],
    function(physicalWorld,
             event,

             GooJointAnimator
        ) {

        var Vehicle = function(id) {
			this.id = id;
        };

		Vehicle.prototype.attachGooEntity = function(gooEntity) {
			if (this.entity.geometries[0]) this.entity.geometries[0].removeFromWorld();
			this.entity.geometries[0] = gooEntity;
			this.entity.geometries[0].addToWorld();

			GooJointAnimator.printClipInitialTransform(this.entity);

			this.entity.spatial.velocity.data[2] = 0.3*(Math.random()-0.5);
			this.entity.spatial.velocity.data[0] = 0.3*(Math.random()-0.5);
			this.vehicleReady(this.entity);
		};


		Vehicle.prototype.attachEntity = function(entity, data) {
			this.entity = entity;
			this.entity.pieceData = data;
			this.entity.combat.hitPoints = data.hitPoints;


			this.entity.pieceData = data;
			physicalWorld.registerPhysicalEntity(this.entity);

			this.entity.combat.destroyed = function(entity) {};

			var visualEntityReady = function(gooEntity) {
				this.attachGooEntity(gooEntity);
			}.bind(this);

			console.log("Build Piece: ", this.entity.pieceData);
			event.fireEvent(event.list().BUILD_GOO_GAMEPIECE, {projPath:this.entity.pieceData.gooProjectUrl, modelPath:this.entity.pieceData.modelPath, callback:visualEntityReady});
		};

		Vehicle.prototype.applyPieceData = function(data, vehicleReady) {
			this.vehicleReady = vehicleReady;
			var entityAddedCallback = function(entity) {

				this.attachEntity(entity, data);
			}.bind(this);
			event.fireEvent(event.list().ADD_GAME_ENTITY, {entityId:this.id, callback:entityAddedCallback});
		};


        return Vehicle;
    });