define([
    "game/GameConfiguration",
    "application/EventManager",
	"application/Settings",
    "sound/MasterTrack",
    "sound/EffectTrack",
    "sound/MixTrack"
], function(
    gameConfig,
    event,
	Settings,
    masterTrack,
    effectTrack,
    MixTrack) {
    "use strict";

    var channels = {};

    var tracks = gameConfig.MIX_TRACKS;
    var getTracks = function() {
        return tracks;
    };

    var getTrackMix = function(id) {
        return channels[id].mixTrack;
    };

    var getChannels = function() {
        return channels;
    };

    var addChannel = function(id, spatial, settingGainId, settingFxSendId, context) {

        var mixTrack = new MixTrack(id, spatial, settingGainId, settingFxSendId, context);
        channels[id] = mixTrack;
    };

    var setupMixTracks = function(context) {
        for (var index in tracks) {
            addChannel(tracks[index].id, tracks[index].spatial, tracks[index].settingGain, tracks[index].settingFxSend,  context);
        }
    };

    var setupMixChannels = function(context) {
        effectTrack.setContext(context);
        masterTrack.setContext(context);
        setupMixTracks(context);
    };

    var addSoundToChannel = function(sound, soundData) {
    //    console.log("ADD SOUND TO CHANNEL: ", channels, sound.track.id, soundData);
        channels[sound.track.id].addSourceNode(soundData.gainNode)
    };

    var handleMixChannelValue = function(e) {
        var id = event.eventArgs(e).channelId;
        var valueId = event.eventArgs(e).valueId;
        var amount = event.eventArgs(e).amount;
 //       console.log(id,valueId,amount)
        channels[id][valueId](amount);
    };

    var connectNodeToChannel = function(node, channelId) {
        channels[channelId].addSourceNode(node);
    };

    event.registerListener(event.list().MIX_CHANNEL_VALUE, handleMixChannelValue);

    return {
        getTracks:getTracks,
        connectNodeToChannel:connectNodeToChannel,
        addSoundToChannel:addSoundToChannel,
        setupMixChannels:setupMixChannels,
        getChannels:getChannels
    }
});