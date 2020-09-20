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
        this._score=data.score
    }

    create() {
        if (this._text) {
            this.add.text(0, 0, this._text +'\nScore: '+ this._score, {fontSize: 70})
        }
    }
}