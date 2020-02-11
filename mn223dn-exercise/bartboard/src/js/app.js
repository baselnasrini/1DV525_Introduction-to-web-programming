import { BartBoard } from './bart-board.js'

let bb1 = document.createElement('bart-board')
bb1.setAttribute('text', 'This is not good')
document.querySelector('#board').appendChild(bb1)
