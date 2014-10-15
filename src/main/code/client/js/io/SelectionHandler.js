SelectionHandler = function() {
	this.selectedUiEntities = [];
    this.selectedWorldEntity = [];

};

SelectionHandler.prototype.create3dIndicator = function() {
    this.selectionElement = {}
    this.selectionElement.big = {}
    this.selectionElement.small = {}

    this.selectionElement.big.model = "../resources/collada/indicators/big_wavy.dae"
    this.selectionElement.small.model = "../resources/collada/indicators/big_wavy.dae"

    CORE.scene.addCollada(this.selectionElement.big)
    CORE.scene.addCollada(this.selectionElement.small)


};

SelectionHandler.prototype.selectWorldEntity = function(entity) {
    console.log(entity)
	this.removeCurrentWorldSelections();
	this.setSelectedWorldEntity(entity);
};

SelectionHandler.prototype.removeCurrentWorldSelections = function() {
	for (index in this.selectedWorldEntity) {
		var remove = this.selectedWorldEntity.splice(index, 1);
		this.removeWorldSelectionHighlight(remove[0]);
        CORE.client.currentState.ui.targetUnitFrame.unSubscribeFrame();
	};
};

SelectionHandler.prototype.removeWorldSelectionHighlight = function(entity) {
	entity.isSelected = false;
	var rootElement = entity.ui.parentKey;
    UIROOT.uiElementHandler.removeDivElement(rootElement+"_worldSelect");
};


SelectionHandler.prototype.setSelectedWorldEntity = function(entity) {
    if (entity.loot) {
        CORE.debugSpam.addText("Loot Attempt!")
        var success = CORE.entityInterface.lootController.playerAttemptToLootEntityId(CORE.input.getPlayerId(), entity.id);
        CORE.debugSpam.addText("Loot Result: " +success[0]+", "+ success[1]+"")
        if (success[0] == true) {

            CORE.network.trafficHandler.requestDataFromServer(["action", "open_loot", entity.id])
        }

        return;
    }

	this.selectedWorldEntity.push(entity);
	this.setWorldEntityHighlight(this.selectedWorldEntity);



    if (entity.combat && entity.isSelected != true) {
        CORE.client.currentState.ui.targetUnitFrame.subscribeFrameToEntity(entity);

        CORE.network.trafficHandler.requestDataFromServer(["action", "select", entity.id])
    }

    if (entity == null) {
        CORE.client.currentState.ui.targetUnitFrame.unSubscribeFrame();
        return;
    }

    entity.isSelected = true;
};

SelectionHandler.prototype.setWorldEntityHighlight = function(entities) {
	for (index in entities) {
		var rootElement = entities[index].ui.parentKey;
            UIROOT.uiElementHandler.createDivElement(rootElement, rootElement+"_worldSelect", "", "selected_frame", null)
	}
};

// Super primitive... maybe need fix!
SelectionHandler.prototype.closeSelectedEntity = function(entity) {

    if (entity.callClose) {
        entity.callClose()

    }

	this.removeSelectionFromEntity(entity);
};



SelectionHandler.prototype.acceptSelection = function(entity) {

	entity.callAccept();
	this.removeAllCurrentSelections();
};

SelectionHandler.prototype.singleSelectEntity = function(entity) {
//	CORE.client.currentState.selectEntity(entity); // <-- Funky!! booo
	this.removeAllCurrentSelections();
	this.setSelectedState(entity);
};



SelectionHandler.prototype.setSelectedState = function(entity) {
	entity.isSelected = true;
	this.selectedUiEntities.push(entity);
	this.setHighlight(this.selectedUiEntities);
};

SelectionHandler.prototype.setHighlight = function(entities) {
	for (index in entities) {
		var clickObjects = entities[index].ui.clickObjects;
		for (index in clickObjects) {
			document.getElementById(clickObjects[index].key).style.borderColor = "#cfe";
			document.getElementById(clickObjects[index].key).style.backgroundolor = "#adc";
			document.getElementById(clickObjects[index].key).style.boxShadow = "0px 0px 5px #dfe";

		}
		
	}	
};

SelectionHandler.prototype.removeSelectionFromEntity = function(entity) {
	for (index in this.selectedUiEntities) {
        if (this.selectedUiEntities[index].id == entity.id) {
		    var remove = this.selectedUiEntities.splice(index, 1);
		    this.removeHighlight(remove[0]);
        }
	};
};

SelectionHandler.prototype.removeAllCurrentSelections = function() {
	for (index in this.selectedUiEntities) {
		var remove = this.selectedUiEntities.splice(index, 1);
		this.removeHighlight(remove[0]);
	};
};

SelectionHandler.prototype.removeHighlight = function(entity) {
	entity.isSelected = false;
	var clickObjects = entity.ui.clickObjects;
	for (index in clickObjects) {
		document.getElementById(clickObjects[index].key).style.boxShadow = "0px 0px 0px #000";
		document.getElementById(clickObjects[index].key).style.borderColor = "#000";
		document.getElementById(clickObjects[index].key).className = clickObjects[index].styleClass;
	}
};

SelectionHandler.prototype.tick = function(i, time) {
    if (this.selectedWorldEntity[0]) {
        var pos = CORE.entityInterface.movementController.getPosAndDirOfEntityId(this.selectedWorldEntity[0].id)[0]
        this.selectionElement.big.collada.setLocX(pos[0])
        this.selectionElement.big.collada.setLocY(pos[1])
        this.selectionElement.big.collada.setLocZ(pos[2])
        this.selectionElement.small.collada.setLocX(pos[0])
        this.selectionElement.small.collada.setLocY(pos[1])
        this.selectionElement.small.collada.setLocZ(pos[2])

        this.selectionElement.big.collada.setRotY(time*0.002)
        this.selectionElement.small.collada.setRotY(- time*0.002)

    }




};