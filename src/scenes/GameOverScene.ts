import { GAME } from '../constants/GAME'
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
            this.add.text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 30, this._text, { fontSize: 70, fontStyle: 'bold' }).setOrigin(0.5)
            this.add.text(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 30, 'Score: ' + this._score, { fontSize: 35 }).setOrigin(0.5)
        }
    }
}