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
            this.currentTime = 0;
            this.data = data;
            this.active = false;
            this.ending = false;
        };

        AmbientState.prototype.getInitAfterTime = function() {
            return this.initTime + this.data.init.delay;
        };

        AmbientState.prototype.getActivateAfterTime = function() {
            return this.initTime + this.data.loops.delay;
        };

        AmbientState.prototype.triggerInitAmbientState = function() {
            for (var i = 0; i < this.data.init.soundList.length; i++) {
                this.ambiencePlayer.playAmbientOneshot(this.data.init.soundList[i]);
            }
        };

        AmbientState.prototype.triggerActiveState = function() {
            this.active = true;
            for (var i = 0; i < this.data.loops.soundList.length; i++) {
                this.ambiencePlayer.loopAmbience(this.data.loops.soundList[i], this.data.loops.soundList[i]+this.initTime, this.data.loops.fadeIn);
            }
        };

        AmbientState.prototype.endAmbientState = function() {
            if (this.ending) {
                return;
            }
            if (this.active) {

                var exitDelay = 0;
                if (this.data.exit) {
                    exitDelay += this.data.exit.delay;
                }
                var player = this.ambiencePlayer;

                var stopAmb = function(soundName, fadeTime, delay) {
                    setTimeout(function() {
                        player.stopAmbience(soundName, fadeTime);
                    }, delay * 1000);
                };

                for (var i = 0; i < this.data.loops.soundList.length; i++) {
                    stopAmb(this.data.loops.soundList[i]+this.initTime, this.data.loops.fadeOut, exitDelay);
                }
            }
            this.ending = true;
        };

        AmbientState.prototype.progressTime = function(tpf, totalTime) {
            this.currentTime += tpf;

            if (totalTime > this.getActivateAfterTime()) {
                if(!this.active) {
                    this.triggerActiveState();
                }
            }

        };

        var AmbiencePlayer = function() {
            this.currentAmbience = null;
            this.ambientLoops = {};
            this.muted = false;
            this.totalTime = 0;
            this.transitionQueue = [];
            this.currentAmbientState = null;
            this.configs = {};
            this.loadConfigs();
            this.setupEventListener();
        };


        AmbiencePlayer.prototype.loadConfigs = function() {

            var applyConfig = function(srcKey, config) {
                console.log("Ambience data:", srcKey, config)
                for (var i = 0; i < config.length; i++) {
                    this.configs[config[i].id] = config[i].data;
                }
            }.bind(this);

            PipelineAPI.subscribeToCategoryKey('ambience_states', 'game_ambience', applyConfig);
        };

        AmbiencePlayer.prototype.playAmbientOneshot = function(soundName) {
            if(!this.muted && soundName){

                event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound()[soundName]});

            }
        };

        AmbiencePlayer.prototype.loopAmbience = function(soundName, loopId, fadeTime) {
            if (this.ambientLoops[loopId]) {
                console.error("Ambient Loop already playing:", soundName, this.ambientLoops);
                return;
            }

            var _this = this;

            var playCallback = function(soundData) {
                _this.ambientLoops[loopId] = soundData;
            };



            if(!this.muted && soundName){
                //    SoundHandler.play(soundName);
                event.fireEvent(event.list().START_SOUND_LOOP, {soundData:event.sound()[soundName], loopId:loopId, fadeTime:fadeTime, callback:playCallback});

            }
        };

        AmbiencePlayer.prototype.stopAmbience = function(loopId, fadeTime) {
            console.log("Stop Ambient sounds", loopId, fadeTime, this.ambientLoops)
            if (!this.ambientLoops[loopId]) {
                console.error("No loop registered for ", loopId, this.ambientLoops);
                return;
            }

            event.fireEvent(event.list().STOP_SOUND_LOOP, {loopId:loopId, fadeTime:fadeTime});
            delete this.ambientLoops[loopId];

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
            if (this.configs[state]) {
                console.log("transit to ambience state:", state, this.configs);
                this.transitionQueue.push(new AmbientState(this.totalTime, this.configs[state], this));
            } else {
                console.log("no ambience state config for state:", state);
            }

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

        AmbiencePlayer.prototype.processTimeUpdate = function(tpf) {
            var next = this.getNextInLine();

            if (next) {
                if (this.currentAmbientState) {
                    this.currentAmbientState.endAmbientState();
                }
                this.currentAmbientState = next;
                this.currentAmbientState.triggerInitAmbientState();
            }

            if (this.currentAmbientState) {
                this.currentAmbientState.progressTime(tpf, this.totalTime);
                /*
                if(!this.currentAmbientState.active) {
                    if (this.totalTime > this.currentAmbientState.getActivateAfterTime()) {
                        this.currentAmbientState.triggerActiveState();
                    }
                }
                */
            }

        };


        AmbiencePlayer.prototype.updateAmbiencePlayer = function(tpf) {
            this.totalTime += tpf;
            this.processTimeUpdate(tpf);
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

