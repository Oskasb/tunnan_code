"use strict";

define(["game/characters/Character",
        'game/characters/CharacterData'],
    function(Character, CharacterData) {

        var buildCharacter = function(id, data, pos, charReady) {
            if (!data) data = CharacterData["PILOT"];
           return new Character(id, data, pos, charReady);

        };

        return {
            buildCharacter:buildCharacter
        }
    });