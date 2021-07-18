import { BLOCK_SIZE, PLAYER_SPEED_DIVIDER, DIRECTIONS, ENTITIES, MASTER_MAP_LAYOUT, SLAVE_MAP_LAYOUT } from "../consts.js"
import Player from "./Player.js"

/**
 * Pacman object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class Pacman extends Player {
    constructor(x, y, color, id) {
        super(x, y, color, id)

        this.isPoweredUp = false
        // variables used for pacman mouth animation
        this.mouthOpenValue = 40
        this.mouthPosition = -1
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        if (this.mouthOpenValue <= 0)
            this.mouthPosition = 1; // positive for mouth opening
        else if (this.mouthOpenValue >= 40)
            this.mouthPosition = -1; // negative for mouth closing

        this.mouthOpenValue += (5 * this.mouthPosition); // subtract when closing add when opening

        // radius is size / 2 so that diameter is equal to block size
        let radius = this.size / 2
        ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform before drawing

        // set canvas to pacman center and rotate based on currently faced direction
        ctx.translate(this.x + radius, this.y + radius)
        switch (this.facing) {
            case DIRECTIONS.RIGHT:
                ctx.rotate(0 * Math.PI / 180);
                break;
            case DIRECTIONS.DOWN:
                ctx.rotate(90 * Math.PI / 180);
                break;
            case DIRECTIONS.LEFT:
                ctx.rotate(180 * Math.PI / 180);
                break;
            case DIRECTIONS.UP:
                ctx.rotate(270 * Math.PI / 180);
                break;
        }

        // set canvas back to correct coordinates before drawing
        ctx.translate(-this.x - radius, -this.y - radius)

        ctx.beginPath();
        ctx.arc(this.x + radius, this.y + radius, radius, (Math.PI / 180) * this.mouthOpenValue, (Math.PI / 180) * (360 - this.mouthOpenValue));

        ctx.lineTo(this.x + radius, this.y + radius);
        ctx.fillStyle = this.isPoweredUp ? 'white' : this.color;
        ctx.fill();
    }

    /**
     * Update position method -> update player position based on current direction and player speed
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

            // Only allow direction change if next block is not wall
            if (newDir == DIRECTIONS.UP && above !== ENTITIES.WALL && above !== ENTITIES.GHOSTLAIR_DOOR) {
                this.direction = DIRECTIONS.UP;
                this.facing = DIRECTIONS.UP
            } else if (newDir == DIRECTIONS.DOWN && below !== ENTITIES.WALL && below !== ENTITIES.GHOSTLAIR_DOOR) {
                this.direction = DIRECTIONS.DOWN;
                this.facing = DIRECTIONS.DOWN
            } else if (newDir == DIRECTIONS.LEFT && left !== ENTITIES.WALL && left !== ENTITIES.GHOSTLAIR_DOOR) {
                this.direction = DIRECTIONS.LEFT
                this.facing = DIRECTIONS.LEFT
            } else if (newDir == DIRECTIONS.RIGHT && right !== ENTITIES.WALL && right !== ENTITIES.GHOSTLAIR_DOOR) {
                this.direction = DIRECTIONS.RIGHT
                this.facing = DIRECTIONS.RIGHT
            } else if (
                (this.direction == DIRECTIONS.UP && (above == ENTITIES.WALL || above == ENTITIES.GHOSTLAIR_DOOR)) ||
                (this.direction == DIRECTIONS.DOWN && (below == ENTITIES.WALL || below == ENTITIES.GHOSTLAIR_DOOR)) ||
                (this.direction == DIRECTIONS.LEFT && (left == ENTITIES.WALL || left == ENTITIES.GHOSTLAIR_DOOR)) ||
                (this.direction == DIRECTIONS.RIGHT && (right == ENTITIES.WALL || right == ENTITIES.GHOSTLAIR_DOOR))
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
}

export default Pacman;