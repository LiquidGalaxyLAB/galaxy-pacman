
var sounds = {}


export default {
    gameStartSoundFinished: false,
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
            onend: () =>  {
                this.gameStartSoundFinished = true
                sounds.siren.play()
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
    play(name) {
        sounds[name].play()
    },
    // play sound only if it is currently not playing (used for sounds that cant be overlayed)
    playUniqueSound(name) {
        if(!sounds[name].playing()) sounds[name].play()
    },
    switchSiren() {
        if(sounds.siren.playing()) {
            sounds.siren.stop()
            sounds.powerSiren.play()
        } else {
            sounds.powerSiren.stop()
            sounds.siren.play()
        }
    },
    log() {
        console.log()
    }
}

