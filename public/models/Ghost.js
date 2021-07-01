import { BLOCK_SIZE, DIRECTIONS, PLAYER_SPEED_DIVIDER } from "../consts.js"

/**
 * Ghost object
 * @param {number} x indicates object x position
 * @param {number} y indicates object y position
 */
class Ghost {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = BLOCK_SIZE;
        this.direction = DIRECTIONS.STOP; // start stopped
        this.speed = BLOCK_SIZE / PLAYER_SPEED_DIVIDER;
        this.color = "red"
    }

    /**
     * Draw method -> responsible for drawing object on canvas
     * @param {Object} ctx canvas context object
     */
    draw(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform before drawing
        ctx.fillStyle = this.color;

        const headRadius = this.size / 2

        // draw cricle
        ctx.beginPath();
        ctx.arc(this.x + headRadius, this.y + headRadius, headRadius, 0, 2 * Math.PI);
        ctx.fill()

        //draw rectangle for body
        ctx.fillRect(this.x, this.y + headRadius, this.size, headRadius)

        //draw little circles for legs
        const nLegs = 3 // number of legs
        const legRadius = headRadius / nLegs
        ctx.beginPath();
        for(let i = 0; i < nLegs; i++) {
            ctx.arc(this.x + ((2 * i + 1) * legRadius), this.y + (2 * headRadius), legRadius, 0, 2 * Math.PI);
        }
        ctx.fill();

        //draw circles for white of the eyes
        const eyeXOffset = this.size / 3
        const eyeYOffset = this.size / 3
        ctx.fillStyle = "white";
        ctx.beginPath();
        // left eye
        ctx.arc(this.x + eyeXOffset, this.y + eyeYOffset, legRadius, 0, 2 * Math.PI);
        
        //right eye
        ctx.arc(this.x + (2* headRadius) - eyeXOffset, this.y + eyeYOffset, legRadius, 0, 2 * Math.PI);
        ctx.fill();

        //draw circles for black of the eyes
        ctx.fillStyle = "black";
        ctx.beginPath();
        // left eye
        ctx.arc(this.x + eyeXOffset, this.y + eyeYOffset, legRadius / 2, 0, 2 * Math.PI);

        //right eye
        ctx.arc(this.x + (2* headRadius) - eyeXOffset, this.y + eyeYOffset, legRadius / 2, 0, 2 * Math.PI);
        ctx.fill();

    }
}

export default Ghost;