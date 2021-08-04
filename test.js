import chai from 'chai'
const expect = chai.expect

// Audio controller for testing
const AudioController = {
    play: function (name) {
        // available sounds
        const sounds = {
            siren: '',
            powerSiren: '',
            gameStart: '',
            munch: '',
            death: '',
            eatGhost: ''
        }

        if (sounds[name] == undefined) {
            return 'error'
        }

        return 'ok'
    }
}

/**
 * Is Game Over method -> Check if game is over
 * @param {Array} pacmans array containing pacmans
 * @param {Object} allFoodsEaten object with screen number as key (true if all foods were eaten and false if not all foods have been eaten)
 */
function isGameOver(pacmans, allFoodsEaten) {
    // check if there are still pacman alive
    if (pacmans.length == 0) {
        return true
    }

    // check if all foods were eaten
    const foodsEaten = Object.values(allFoodsEaten)
    // if no screens with available foods are found -> game over (pacman wins)
    if (!foodsEaten.includes(false)) {
        return true
    }

    return false
}

describe('isGameOver method', function () {
    let pacmans, allFoodsEaten

    describe('Game not over', function () {
        it('Has multiple pacmans and multiple screens with foods left', function () {
            pacmans = [{}, {}, {}]
            allFoodsEaten = { 1: true, 2: false, 3: false }
            expect(isGameOver(pacmans, allFoodsEaten)).to.equal(false)
        })

        it('Has only one pacman and multiple screens with foods left', function () {
            pacmans = [{}, {}, {}]
            allFoodsEaten = { 1: true, 2: false, 3: false }
            expect(isGameOver(pacmans, allFoodsEaten)).to.equal(false)
        })

        it('Has only one pacman and one screen with foods left', function () {
            pacmans = [{}, {}, {}]
            allFoodsEaten = { 1: true, 2: true, 3: false }
            expect(isGameOver(pacmans, allFoodsEaten)).to.equal(false)
        })
    })

    describe('Game is Over', function () {
        it('Has multiple pacmans but no foods', function () {
            pacmans = [{}, {}, {}]
            allFoodsEaten = { 1: true, 2: true, 3: true }
            expect(isGameOver(pacmans, allFoodsEaten)).to.equal(true)
        })

        it('Has no pacmans but still has foods', function () {
            pacmans = []
            allFoodsEaten = { 1: true, 2: false, 3: true }
            expect(isGameOver(pacmans, allFoodsEaten)).to.equal(true)
        })

        it('Has no pacmans and no foods', function () {
            pacmans = []
            allFoodsEaten = { 1: true, 2: true, 3: true }
            expect(isGameOver(pacmans, allFoodsEaten)).to.equal(true)
        })
    })
})

/**
 * Check Player Screen Method -> Check/update player screen based on horizontal position
 * @param {Number} x array containing pacmans
 * @param {Number} width screen width
 * @param {Number} nScreens number of screens
 */
function checkPlayerScreen(x, width, nScreens) {
    let screen

    if (x >= 0) {
        screen = Math.floor(x / width) + 1
    } else {
        screen = nScreens - Math.floor(-x / width)
    }

    return screen
}

describe('checkPlayerScreen method', function () {
    let x, width, nScreens

    describe('Screen 1', function () {
        it('3 screens with 1080 width. Player on x 10', function () {
            x = 10
            width = 1080
            nScreens = 3
            expect(checkPlayerScreen(x, width, nScreens)).to.equal(1)
        })

        it('5 screens with 1080 width. Player on x 580', function () {
            x = 580
            width = 1080
            nScreens = 5
            expect(checkPlayerScreen(x, width, nScreens)).to.equal(1)
        })
    })

    describe('Screen 2', function () {
        it('3 screens with 1080 width. Player on x 1672', function () {
            x = 1672
            width = 1080
            nScreens = 3
            expect(checkPlayerScreen(x, width, nScreens)).to.equal(2)
        })

        it('5 screens with 1080 width. Player on x 2050', function () {
            x = 2050
            width = 1080
            nScreens = 5
            expect(checkPlayerScreen(x, width, nScreens)).to.equal(2)
        })
    })

    describe('Screen 3', function () {
        it('3 screens with 1080 width. Player on x -147', function () {
            x = -147
            width = 1080
            nScreens = 3
            expect(checkPlayerScreen(x, width, nScreens)).to.equal(3)
        })

        it('5 screens with 1080 width. Player on x 2568', function () {
            x = 2568
            width = 1080
            nScreens = 5
            expect(checkPlayerScreen(x, width, nScreens)).to.equal(3)
        })
    })
})

/**
 * Play Audio method -> responsible for playing audio based on name
 * @param {String} name name of the audio to be played
 */
function playAudio(name) {
    return AudioController.play(name)
}

describe('playAudio method', function () {
    let audioName
    describe('Sound exists', function () {
        it('Play siren sound', function () {
            audioName = 'siren'
            expect(playAudio(audioName)).to.equal('ok')
        })

        it('Play munch sound', function () {
            audioName = 'munch'
            expect(playAudio(audioName)).to.equal('ok')
        })
    })

    describe("Sound doesn't exist", function () {
        it('Play naruto sound', function () {
            audioName = 'naruto'
            expect(playAudio(audioName)).to.equal('error')
        })

        it('Play sasuke sound', function () {
            audioName = 'sasuke'
            expect(playAudio(audioName)).to.equal('error')
        })
    })
})

