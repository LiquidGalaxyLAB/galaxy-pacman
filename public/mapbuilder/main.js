import { GRID_WIDTH, GRID_HEIGHT, BLOCK_SIZE } from "../consts.js"

const grid = document.getElementById('grid')
const button = document.getElementById('button')
const classes = [
    { name: "wall", value: 1 },
    { name: "food", value: 2 },
    { name: "powerup", value: 4 },
    { name: "blank", value: 0 },
]

/**
 * Main method -> responsible for creating grid map and adding event listeners
 */
function main() {
    button.addEventListener('click', print)

    grid.style.gridTemplateColumns = `repeat(${GRID_WIDTH}, ${BLOCK_SIZE}px)`

    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
        const block = document.createElement('div')
        block.style.minHeight = `${BLOCK_SIZE}px`
        block.style.minWidth = `${BLOCK_SIZE}px`
        block.className = "wall"
        block.addEventListener('click', updateBlock)
        grid.appendChild(block)
    }
}

/**
 * Update Block method -> responsible updating block based on event object
 * @param {Object} ev js event object
 */
function updateBlock(ev) {
    const className = ev.target.className
    const index = classes.findIndex(c => c.name == className)
    if (index == classes.length - 1) {
        ev.target.className = classes[0].name
    } else {
        ev.target.className = classes[index + 1].name
    }
}

/**
 * Print method -> responsible for printing final map on console
 */
function print() {
    let final = "[[" //first one is for array, second one is for first row
    let col = 0
    Array.from(grid.children).forEach(child => {
        let value = classes.find(c => c.name == child.className).value
        final = final.concat(`${value}, `)

        if (col == GRID_WIDTH - 1) {
            final = final.slice(0, -2) //remove last comma with space (, )
            final = final.concat(`], [`) //close row brackets
            col = 0
        } else {
            col++
        }
    })
    final = final.slice(0, -2) //remove last comma with space (, )
    final = final.concat(']')
    console.log('export const MAP =', final)
    alert('Map generated on console!')
}

// call main function
main()