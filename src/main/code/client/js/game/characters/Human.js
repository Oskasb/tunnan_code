"use strict";

define(['game/GamePiece',
        'game/characters/Character'],
    function(GamePiece,
             Character
    ) {

        var Human = function(id) {
            this.gamePiece = new GamePiece(id);
        };

        Human.prototype.attachCharacter = function(data, pos, readyCallback) {
            this.character = new Character(this.gamePiece, data, pos, readyCallback);
        }

        return Human;
    });