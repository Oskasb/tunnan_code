"use strict";

define(["game/characters/Character",
        'game/characters/CharacterData'],
    function(Character, CharacterData) {

        var buildCharacter = function(id, data, pos) {
            if (!data) data = CharacterData["PILOT"];
            var char = new Character(id, data, pos);
            console.log("BUILD CHARACTER:", char);
            return char;
        };

        return {
            buildCharacter:buildCharacter
        }
    });