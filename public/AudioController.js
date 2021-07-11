
var sounds = {}

export default {
    gameStartSoundFinished: false, // flag for game starting sound finished playing -> indicates player that player can start moving
    /**
     * Load all method -> responsible for loading all playable sounds
     */
    async loadAll() {
        sounds.siren = new Howl({
            src: ['./sounds/siren.wav'],
            loop: true
        });

        sounds.powerSiren = new Howl({
            src: ['./sounds/power_pill.wav'],
            loop: true
        });

        sounds.gameStart = new Howl({
            src: ['./sounds/game_start.wav'],
            onend: () => {
                this.gameStartSoundFinished = true
                sounds.siren.play() // start playing background siren
            }
        });

        sounds.munch = new Howl({
            src: ['./sounds/munch.wav'],
        });

        sounds.death = new Howl({
            src: ['./sounds/death.wav'],
        });

        sounds.eatGhost = new Howl({
            src: ['./sounds/eat_ghost.wav'],
        });
    },
    /**
     * Play method -> responsible for playing sound based on name
     * @param {String} name name of the sound key for object (must be same as defined in loadAll method)
     */
    play(name) {
        sounds[name].play()
    },
    /**
     * Play unique audio method -> play sound only if it is currently not playing (used for sounds that cant be overlayed)
     * @param {String} name name of the sound key for object (must be same as defined in loadAll method)
     */
    playUniqueAudio(name) {
        if (!sounds[name].playing()) sounds[name].play()
    },
    /**
     * Stop method -> responsible for stopping sound based on name
     * @param {String} name name of the sound key for object (must be same as defined in loadAll method)
     */
    stop(name) {
        sounds[name].stop()
    },
    /**
     * Switch Siren method -> switch sirens between default siren and powerup siren
     */
    switchSiren() {
        if (sounds.siren.playing()) {
            sounds.siren.stop()
            sounds.powerSiren.play()
        } else {
            sounds.powerSiren.stop()
            sounds.siren.play()
        }
    },
}

