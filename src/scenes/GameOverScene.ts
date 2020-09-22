import Phaser from 'phaser'
import { SCENE } from '../constants/KEY'

export default class GameOverScene extends Phaser.Scene {
    private _text?: string
    private _score?: integer

    constructor() {
        super(SCENE.GAME_OVER)
    }

    init(data) { // get data from previous scene
        this._text = data.text
        this._score = data.score
    }

    create() {
        if (this._text) {
            // origin 0.5 to center text, use unary + operator to convert string to number
            this.add.text(+this.game.config.width / 2, +this.game.config.height / 2 - 30, this._text, { fontSize: 70, fontStyle: 'bold' }).setOrigin(0.5)
            this.add.text(+this.game.config.width / 2, +this.game.config.height / 2 + 30, 'Score: ' + this._score, { fontSize: 35 }).setOrigin(0.5)
        }
    }
}