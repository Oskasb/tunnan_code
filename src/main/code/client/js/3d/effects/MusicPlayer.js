define(
	[
		'3d/effects/SoundHandler'
	],
	function(
		SoundHandler
		) {


		var MusicPlayer = function() {
			this.currentSong = null;
		};


		MusicPlayer.prototype.playMusic = function(soundName) {
			SoundHandler.play(soundName);
			this.currentSong = soundName;
		};

		MusicPlayer.prototype.stopMusic = function(soundName) {
			if (!soundName && this.currentSong) soundName = this.currentSong;
			SoundHandler.stop(soundName);
			this.currentSong = null;
		};

		return MusicPlayer;

	});

