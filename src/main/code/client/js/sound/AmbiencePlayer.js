define(
    [
        'data_pipeline/PipelineAPI',
        'goo/entities/SystemBus',
        'application/EventManager'
    ],
    function(
        PipelineAPI,
        SystemBus,
        event
    ) {


        var AmbientState = function(initTime, data, ambiencePlayer) {
            this.ambiencePlayer = ambiencePlayer;
            this.initTime = initTime;
            this.data=data;
            this.active = false;
        };

        AmbientState.prototype.getInitAfterTime = function() {
            return this.initTime + this.data.init.delay;
        };

        AmbientState.prototype.getActivateAfterTime = function() {
            return this.initTime + this.data.active.delay;
        };

        AmbientState.prototype.triggerInitAmbientState = function() {
            this.ambiencePlayer.playAmbience(this.data.init.soundName);
        };

        AmbientState.prototype.triggerActiveState = function() {
            this.active = true;
            this.ambiencePlayer.playAmbience(this.data.active.soundName);
        };

        AmbientState.prototype.endAmbientState = function() {
            if (!this.active) {
                this.ambiencePlayer.stopAmbience(this.data.init.soundName);
            }
            this.ambiencePlayer.playAmbience(this.data.active.soundName);
        };



        var AmbiencePlayer = function() {
            this.currentAmbience = null;
            this.muted = false;
            this.totalTime = 0;
            this.transitionQueue = [];
            this.currentAmbientState = null;
            this.configs = {};
            this.loadConfigs();
            this.setupEventListener();
        };


        AmbiencePlayer.prototype.loadConfigs = function() {

            var applyConfig = function(srcKey, data) {
                console.log("Ambience data:", srcKey, data)
                for (var i = 0; i < data.length; i++) {
                    this.configs[data[i].id] = data[i];
                }
            }.bind(this);

            PipelineAPI.subscribeToCategoryKey('ambience_states', 'game_ambience', applyConfig);
        };

        AmbiencePlayer.prototype.playAmbience = function(soundName) {
            if (this.currentAmbience == soundName) return;
            if (!soundName && this.currentAmbience) soundName = this.currentAmbience;
            this.currentAmbience = soundName;

            var _this = this;

            var playCallback = function(soundData) {
                _this.playingSoundData = soundData;
            };



            if(!this.muted && soundName){
                //    SoundHandler.play(soundName);

                event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound()[soundName], playId:'ambient_'+soundName, callback:playCallback});

            }
        };

        AmbiencePlayer.prototype.stopAmbience = function(soundName) {
            if (!soundName && this.currentAmbience) soundName = this.currentAmbience;
            //   SoundHandler.stop(soundName);
            this.currentAmbience = null;
        };

        AmbiencePlayer.prototype.mute = function(){
            if (this.currentAmbience){
                //        SoundHandler.stop(this.currentAmbience);
            }
            this.muted = true;
        };
        AmbiencePlayer.prototype.unMute = function(){
            this.muted = false;
            if (this.currentAmbience){
                //        SoundHandler.play(this.currentAmbience);
            }
        };

        AmbiencePlayer.prototype.transitToState = function(state) {
            this.transitionQueue.push(new AmbientState(this.totalTime, this.configs[state], this));
            if (this.currentAmbientState) {
                this.currentAmbientState.endAmbientState();
            }
        };

        AmbiencePlayer.prototype.getNextInLine = function() {
            for (var i = 0; i < this.transitionQueue.length; i++) {
                if (this.totalTime > this.transitionQueue[i].getInitAfterTime()) {
                    return this.transitionQueue.splice(i, 1)[0];
                }
            }
        };

        AmbiencePlayer.prototype.processTimeUpdate = function() {
            var next = this.getNextInLine();

            if (next) {
                if (this.currentAmbientState) {
                    this.currentAmbientState.endAmbientState();
                }
                this.currentAmbientState = next;
                this.currentAmbientState.triggerInitAmbientState();
            }

            if (this.currentAmbientState) {
                if(!this.currentAmbientState.active) {
                    if (this.totalTime > this.currentAmbientState.getActivateAfterTime()) {
                        this.currentAmbientState.triggerActiveState();
                    }
                }
            }

        };


        AmbiencePlayer.prototype.updateAmbiencePlayer = function(tpf) {
            this.totalTime += tpf;
            this.processTimeUpdate();
        };

        AmbiencePlayer.prototype.setupEventListener = function() {

            var _this = this;

            var enterAmbientState = function(eArgs) {
                _this.transitToState(eArgs.ambientState);
            };


            SystemBus.addListener('enterAmbientState', enterAmbientState)

        };

        return AmbiencePlayer;

    });

