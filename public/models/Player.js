import { BLOCK_SIZE, PLAYER_SPEED_DIVIDER, DIRECTIONS, ENTITIES } from "../consts.js"

/**
 * Player object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class Player {
    constructor(x, y, color) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.relativeX = x
        this.y = y
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
        if (this.relativeX >= 0 && this.relativeX <= width) return true

        return false
    }

    /**
     * Get row and column method
     * @returns {Object} object with attributes 'row' as the index of current row and 'col' as the index of current column
     */
    getRowCol() {
        const row = Math.round(this.y / BLOCK_SIZE)
        let col
        // TODO: Change once starts working on multiplayer
        if(this.relativeX) col = Math.round(this.relativeX / BLOCK_SIZE)
        else col = Math.round(this.x / BLOCK_SIZE)

        return { row, col }
    }

    /**
     * Reset method -> resets player position, direction and facing direction
     */
    reset() {
        this.direction = DIRECTIONS.STOP
        this.facing = DIRECTIONS.RIGHT
        this.x = this.startX;
        this.y = this.startY;
        this.relativeX = this.startX;
    }
}

export default Player;