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


        var MusicState = function(initTime, data, musicPlayer) {
            this.musicPlayer = musicPlayer;
            this.initTime = initTime;
            this.data=data;
            this.active = false;
        };

        MusicState.prototype.getInitAfterTime = function() {
            return this.initTime + this.data.init.delay;
        };

        MusicState.prototype.getActivateAfterTime = function() {
            return this.initTime + this.data.active.delay;
        };

        MusicState.prototype.triggerInitMusicState = function() {
            if (this.data.init.soundName) {
                this.musicPlayer.playMusic(this.data.init.soundName, 0);
            }

        };

        MusicState.prototype.triggerActiveState = function() {
            this.active = true;
            this.musicPlayer.playMusic(this.data.active.soundName, this.data.active.fadeIn);
        };

        MusicState.prototype.endMusicState = function() {
            if (this.active) {
                var exitDelay = 0;
                if (this.data.exit) {
                    exitDelay += this.data.exit.delay;
                }
                var player = this.musicPlayer;
                var soundName = this.data.active.soundName;
                var fadeTime = this.data.active.fadeOut
                setTimeout(function() {
                    player.stopMusic(soundName, fadeTime);
                }, exitDelay * 1000);

            }

        };


        var configs = [{
            "id":"main_menu",
            "data":{
                "init":{"delay":1, "soundName":"ENGINE_START"},
                "active":{"delay":2, "soundName":"MUSIC_BLIPPIT"}
            }
        }];

        var MusicPlayer = function() {
            this.currentSong = null;
            this.muted = false;
            this.totalTime = 0;
            this.transitionQueue = [];
            this.currentMusicState = null;
            this.configs = {};
            this.loadConfigs();
            this.setupEventListener();
        };


        MusicPlayer.prototype.loadConfigs = function() {


            var applyConfig = function(srcKey, config) {
                console.log("Music data:", srcKey, config)
                for (var i = 0; i < config.length; i++) {
                    this.configs[config[i].id] = config[i].data;
                }
            }.bind(this);

            PipelineAPI.subscribeToCategoryKey('music_states', 'game_music', applyConfig);
        };

        MusicPlayer.prototype.playMusic = function(soundName, fadeTime) {
            if (this.currentSong == soundName) return;
            if (!soundName && this.currentSong) soundName = this.currentSong;
            this.currentSong = soundName;

            var _this = this;

            var playCallback = function(soundData) {
                _this.playingSoundData = soundData;
            };

            if(!this.muted && soundName){
                event.fireEvent(event.list().ONESHOT_SOUND, {soundData:event.sound()[soundName], playId:'music_'+soundName, fadeTime:fadeTime, callback:playCallback});
            }
        };

        MusicPlayer.prototype.stopMusic = function(soundName, fadeTime) {
            if (!soundName) {
                return;
            }
         //   SoundHandler.stop(soundName);
			event.fireEvent(event.list().STOP_SOUND, {playId:'music_'+soundName, fadeTime:fadeTime});
            this.currentSong = null;
        };

        MusicPlayer.prototype.mute = function(){
            if (this.currentSong){
        //        SoundHandler.stop(this.currentSong);
            }
            this.muted = true;
        };
        MusicPlayer.prototype.unMute = function(){
            this.muted = false;
            if (this.currentSong){
        //        SoundHandler.play(this.currentSong);
            }
        };

        MusicPlayer.prototype.transitToState = function(state) {

            if (this.currentMusicState) {
                this.currentMusicState.endMusicState();
            }

            if (this.configs[state]) {
                this.transitionQueue.push(new MusicState(this.totalTime, this.configs[state], this));
            } else {
                console.log("no music state config for state:", state);
                this.currentMusicState = null;
            }


        };

        MusicPlayer.prototype.getNextInLine = function() {
            for (var i = 0; i < this.transitionQueue.length; i++) {
                if (this.totalTime > this.transitionQueue[i].getInitAfterTime()) {
                    return this.transitionQueue.splice(i, 1)[0];
                }
            }
        };

        MusicPlayer.prototype.processTimeUpdate = function() {
            var next = this.getNextInLine();

            if (next) {
                if (this.currentMusicState) {
                    this.currentMusicState.endMusicState();
                }
                this.currentMusicState = next;
                this.currentMusicState.triggerInitMusicState();
            }

            if (this.currentMusicState) {
                if(!this.currentMusicState.active) {
                    if (this.totalTime > this.currentMusicState.getActivateAfterTime()) {
                        this.currentMusicState.triggerActiveState();
                    }
                }
            }

        };


        MusicPlayer.prototype.updateMusicPlayer = function(tpf) {
            this.totalTime += tpf;
            this.processTimeUpdate();
        };

        MusicPlayer.prototype.setupEventListener = function() {

            var _this = this;

            var enterMusicState = function(eArgs) {
                _this.transitToState(eArgs.musicState);
            };


            SystemBus.addListener('enterMusicState', enterMusicState)

        };

        return MusicPlayer;

    });

