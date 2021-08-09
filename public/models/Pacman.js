import { DIRECTIONS } from "../consts.js"
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
        this.verticalMoveCycle = 0
        this.horizontalMoveCycle = 0
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
        ctx.translate(this.x + radius + this.horizontalMoveCycle, this.y + radius + this.verticalMoveCycle)
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
        ctx.translate(-this.x - radius - this.horizontalMoveCycle, -this.y - radius - this.verticalMoveCycle)

        ctx.beginPath();
        ctx.arc(this.x + radius + this.horizontalMoveCycle, this.y + radius + this.verticalMoveCycle, radius, (Math.PI / 180) * this.mouthOpenValue, (Math.PI / 180) * (360 - this.mouthOpenValue));

        ctx.lineTo(this.x + radius + this.horizontalMoveCycle, this.y + radius + this.verticalMoveCycle);
        ctx.fillStyle = this.isPoweredUp ? 'white' : this.color;
        ctx.fill();
    }
}

export default Pacman;