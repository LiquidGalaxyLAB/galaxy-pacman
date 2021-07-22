import {
    BLOCK_SIZE,
    PLAYER_SPEED_DIVIDER,
    DIRECTIONS,
    ENTITIES,
    MASTER_MAP_LAYOUT,
    SLAVE_MAP_LAYOUT,
    PLAYERTYPES,
} from "../consts.js"

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
     * Update position method -> update player position based on current direction input
     * @param {String} newDir new direction from player input
     * @param {Number} screen current screen number
     * @param {Number} nScreens total number of screens
     * @param {Object} player object containing player info like position, screen, current map
     */
    updatePosition(newDir, screen, nScreens, player) {
        this.isPoweredUp = player.isPoweredUp
        this.y = player.y
        let isRightScreen = screen <= (Math.ceil(nScreens / 2)); //true if screen is master or on its right, false if screen is on master's left
        let offsetIndex = isRightScreen ? screen - 1 : ((nScreens + 1) - screen) * -1; //offsetIndex is always negative for screens on left.
        this.x = player.x - (window.innerWidth * offsetIndex)

        switch (this.direction) {
            case DIRECTIONS.UP: // up
                this.moveInterval++
                break;
            case DIRECTIONS.DOWN: // down
                this.moveInterval++
                break;
            case DIRECTIONS.LEFT: // left
                this.moveInterval++
                break;
            case DIRECTIONS.RIGHT: // right
                this.moveInterval++
                break;
        }

        // If player is able to change direction or player is stopped
        if ((this.moveInterval == PLAYER_SPEED_DIVIDER || this.direction == DIRECTIONS.STOP)) {
            this.moveInterval = 0 // reset move interval
            // Get player row and col
            const row = Math.round(this.y / BLOCK_SIZE)
            // Calculate relative x -> player x relative to current screen
            isRightScreen = player.screen <= (Math.ceil(nScreens / 2));
            offsetIndex = isRightScreen ? player.screen - 1 : ((nScreens + 1) - player.screen) * -1;
            let relativeX = Math.abs(player.x - (window.innerWidth * offsetIndex))

            let col = Math.round(relativeX / BLOCK_SIZE)

            // Set map layout according to screen
            const maps = {
                master: MASTER_MAP_LAYOUT,
                slave: SLAVE_MAP_LAYOUT
            }

            // Get player current map layout
            const map = maps[player.currentMap]

            // Get blocks adjacent to player
            const above = map[row - 1][col]
            const below = map[row + 1][col]
            const right = map[row][col + 1]
            const left = map[row][col - 1]

            const forbiddenBlocks = [
                ENTITIES.WALL,
            ]

            //add forbidden blocks for pacman
            if(player.type == PLAYERTYPES.PACMAN) {
                forbiddenBlocks.push(ENTITIES.GHOSTLAIR_DOOR)
            }

            // Only allow direction change if next block is not wall
            if (newDir == DIRECTIONS.UP && !forbiddenBlocks.includes(above)) {
                this.direction = DIRECTIONS.UP;
                this.facing = DIRECTIONS.UP
            } else if (newDir == DIRECTIONS.DOWN && !forbiddenBlocks.includes(below)) {
                this.direction = DIRECTIONS.DOWN;
                this.facing = DIRECTIONS.DOWN
            } else if (newDir == DIRECTIONS.LEFT && !forbiddenBlocks.includes(left)) {
                this.direction = DIRECTIONS.LEFT
                this.facing = DIRECTIONS.LEFT
            } else if (newDir == DIRECTIONS.RIGHT && !forbiddenBlocks.includes(right)) {
                this.direction = DIRECTIONS.RIGHT
                this.facing = DIRECTIONS.RIGHT
            } else if (
                (this.direction == DIRECTIONS.UP && forbiddenBlocks.includes(above)) ||
                (this.direction == DIRECTIONS.DOWN && forbiddenBlocks.includes(below)) ||
                (this.direction == DIRECTIONS.LEFT && forbiddenBlocks.includes(left)) ||
                (this.direction == DIRECTIONS.RIGHT && forbiddenBlocks.includes(right))
            ) {
                // If next block is wall stop player movement
                this.direction = DIRECTIONS.STOP // stop
            }

            switch (this.direction) {
                case DIRECTIONS.UP: // up
                    this.y -= BLOCK_SIZE
                    break;
                case DIRECTIONS.DOWN: // down
                    this.y += BLOCK_SIZE
                    break;
                case DIRECTIONS.LEFT: // left
                    this.x -= BLOCK_SIZE
                    break;
                case DIRECTIONS.RIGHT: // right
                    this.x += BLOCK_SIZE
                    break;
            }
        }
    }

    /**
     * Update fixed position method -> responsible for updating position with relative x based on screen but not allowing position change
     * @param {Number} screen current screen number
     * @param {Number} nScreens total number of screens
     * @param {Object} player object containing player info like position, screen, current map
     */
    updateFixedPosition(screen, nScreens, player) {
        this.isPoweredUp = player.isPoweredUp
        this.y = player.y
        let isRightScreen = screen <= (Math.ceil(nScreens / 2)); //true if screen is master or on its right, false if screen is on master's left
        let offsetIndex = isRightScreen ? screen - 1 : ((nScreens + 1) - screen) * -1; //offsetIndex is always negative for screens on left.
        this.x = player.x - (window.innerWidth * offsetIndex)
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