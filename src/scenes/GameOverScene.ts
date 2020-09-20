import Phaser from 'phaser'
import { SCENE } from '../constants/KEY'

export default class GameOverScene extends Phaser.Scene {
    private _text?: string

    constructor() {
        super(SCENE.GAME_OVER)
    }

    init(data) { // get data from previous scene
        this._text = data.text
    }

    create() {
        if (this._text) {
            this.add.text(0, 0, this._text, {fontSize: 100})
        }
    }
}