define(["application/EventManager", "sound/MasterTrack", "sound/EffectTrack"] ,function(event, MasterTrack, EffectTrack) {
    "use strict";

    var MixTrack = function(id, is3dSource, fxSend, context) {
        this.channelId = id;
        this.is3dSource = is3dSource;
        this.context = context;
        this.fxSend = fxSend;
        this.channelGain = 1;
        this.tuneLevel = 1;
        this.wireTrack();
        this.defaultMix();
    };

    MixTrack.prototype.wireTrack = function() {
        this.gainNode = this.context.createGain();

        this.filterNode = this.context.createBiquadFilter();
        this.filterNode.connect(this.gainNode);

        MasterTrack.connectTrack(this.gainNode);

        if (this.fxSend) {
            var auxSend = this.context.createGain();
            this.gainNode.connect(auxSend);
            auxSend.gain.value = this.fxSend;
            EffectTrack.connectTrackToFx(auxSend)
        }
    };

    MixTrack.prototype.defaultMix = function() {
        this.setTrackGain(1, 0);
        this.setFilterQValue(0.00000001, 0);
        this.setFilterFreqValue(20000, 0);
    };

    MixTrack.prototype.addSourceNode = function(node) {
        node.connect(this.filterNode);
    };

    MixTrack.prototype.setTrackGain = function(gain, time) {
        if (!time) time = 0.5;
        this.gainNode.gain.linearRampToValueAtTime(gain, this.context.currentTime + time);
    };

    MixTrack.prototype.setFilterQValue = function(value, time) {
        if (!time) time = 0.5;
        this.filterNode["Q"].linearRampToValueAtTime(value, time+ this.context.currentTime);
    };

    MixTrack.prototype.getFilterQValue = function() {
        return this.filterNode.Q.value;
    };

    MixTrack.prototype.setFilterFreqValue = function(value, time) {
        if (!time) time = 0.5;
        this.filterNode["frequency"].linearRampToValueAtTime(value, time+ this.context.currentTime);
    };

    MixTrack.prototype.getFilterFreqValue = function() {
        return this.filterNode.frequency.value;
    };

    MixTrack.prototype.tuneFilterQ = function(amount) {
 //       console.log(this.filterNode)
        this.setFilterQValue(1*amount, 0.01);
    };

    MixTrack.prototype.tuneFilterFreq = function(amount) {
        this.setFilterFreqValue(20000*amount, 0.01);
    };

    MixTrack.prototype.tuneGain = function(amount) {
        this.tuneLevel = amount;
        this.setTrackGain(this.channelGain * this.tuneLevel, 0.01);
    };

    MixTrack.prototype.setChannelGain = function(gain) {
        this.channelGain = gain;
        this.setTrackGain(this.channelGain * this.tuneLevel, 0.01);
    };

    MixTrack.prototype.getChannelGain = function() {
        return this.channelGain;
    };

    return MixTrack;
});
