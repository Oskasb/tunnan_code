define([
	"application/EventManager",
	"sound/MasterTrack",
	"sound/EffectTrack"
] ,function(
	event,
	MasterTrack,
	EffectTrack
	) {
    "use strict";

    var MixTrack = function(id, is3dSource, settingGain, settingFxSend, context) {
        this.channelId = id;
        this.is3dSource = is3dSource;
        this.context = context;
        this.fxSend = settingFxSend.getProcessedValue();
		this.fxConnected = false;
		this.auxSendGain;
        this.channelGain = 1;
        this.tuneLevel = settingGain.getProcessedValue();
        this.wireTrack();
        this.defaultMix();
		this.settingGain = settingGain;
		this.settingFxSend = settingFxSend;

		var tuneGain = function() {
			this.tuneGain()
		}.bind(this);

		var tuneFx = function(value) {
			this.tuneFxSend(value)
		}.bind(this);


		this.settingGain.addOnChangeCallback(tuneGain);
		this.settingFxSend.addOnChangeCallback(tuneFx);
		tuneGain();
		tuneFx();
    };

    MixTrack.prototype.wireTrack = function() {
        this.gainNode = this.context.createGain();

        this.filterNode = this.context.createBiquadFilter();
        this.filterNode.connect(this.gainNode);

        MasterTrack.connectTrack(this.gainNode);

		this.setupFxSend();

    };

	MixTrack.prototype.setupFxSend = function() {
		this.auxSendGain = this.context.createGain();
		this.gainNode.connect(this.auxSendGain);
		this.connectFxSend()
	};

	MixTrack.prototype.connectFxSend = function() {
		this.auxSendGain.gain.value = this.fxSend;
		if (this.fxSend) {
			if (!this.fxConnected) {
				console.log("Connect to FX: ", this.channelId)
				EffectTrack.connectTrackToFx(this.auxSendGain);
			}
			this.fxConnected = true;
		} else {
			if (this.fxConnected) {
				console.log("Disconnect FX: ", this.channelId)
				this.auxSendGain.disconnect();
			}
			this.fxConnected = false;
		}
	};


	MixTrack.prototype.defaultMix = function() {
        this.setFilterQValue(0.00001, 0);
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
        this.setFilterQValue(1*amount, 0.0001);
    };

    MixTrack.prototype.tuneFilterFreq = function(amount) {
        this.setFilterFreqValue(20000*amount, 0.01);
    };

    MixTrack.prototype.tuneGain = function() {
	//	console.log("tuneGain: ", this.channelId, this.settingGain.getProcessedValue())
        this.setTrackGain(this.channelGain * this.settingGain.getProcessedValue(), 0.01);
    };

	MixTrack.prototype.tuneFxSend = function() {
	//	console.log("FxSend: ", this.channelId, this.settingFxSend.getProcessedValue());
		this.fxSend = this.settingFxSend.getProcessedValue();
		this.connectFxSend();
	};

    MixTrack.prototype.setChannelGain = function(gain) {
        this.channelGain = gain;
        this.tuneGain(1);
    };

    MixTrack.prototype.getChannelGain = function() {
        return this.channelGain;
    };

    return MixTrack;
});
