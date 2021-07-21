import { BLOCK_SIZE, PLAYER_SPEED_DIVIDER, DIRECTIONS, ENTITIES } from "../consts.js"

/**
 * Player object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class Player {
    constructor(x, y, color, id) {
        this.id = id
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.size = BLOCK_SIZE;
        this.direction = DIRECTIONS.STOP; // start stopped
        this.speed = BLOCK_SIZE / PLAYER_SPEED_DIVIDER;
        this.color = color
        // Move interval is responsible for deciding whether player can or cant change direction (if move interval == player speed divider)
        this.moveInterval = 0
        // variables used for player mouth animation
        this.mouthOpenValue = 40
        this.mouthPosition = -1
        // player currently facing direction
        this.facing = DIRECTIONS.RIGHT
    }

    /**
     * Is player on screen method -> responsible for deciding if player is or is not on screen
     * @returns {Boolean} true if player is on screen, false if player is not on screen
     */
    isPlayerOnScreen() {
        let width = window.innerWidth
        if (this.x >= 0 && this.x <= width) return true

        return false
    }

    /**
     * Get row and column method
     * @returns {Object} object with attributes 'row' as the index of current row and 'col' as the index of current column
     */
    getRowCol() {
        const row = Math.round(this.y / BLOCK_SIZE)
        const col = Math.round(this.x / BLOCK_SIZE)

        return { row, col }
    }

    /**
     * Reset method -> resets player position, direction and facing direction
     * @param {Object} player object containing player info like starting position
     * @param {number} nScreens number of total screens in liquid galaxy
     */
    reset(player, nScreens) {
        this.direction = DIRECTIONS.STOP
        this.facing = DIRECTIONS.RIGHT
        if (player) {
            this.y = player.startY
            let isRightScreen = screen <= (Math.ceil(nScreens / 2)); //true if screen is master or on its right, false if screen is on master's left
            let offsetIndex = isRightScreen ? screen - 1 : ((nScreens + 1) - screen) * -1; //offsetIndex is always negative for screens on left.
            this.x = player.startX - (window.innerWidth * offsetIndex)
        } else {
            this.x = this.startX
            this.y = this.startY
        }

    }
}

export default Player;