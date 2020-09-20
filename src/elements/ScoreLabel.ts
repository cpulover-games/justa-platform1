import { SCORE_LABEL } from '../constants/ELEMENT'

import Phaser from 'phaser'

const formatScore = (score: integer) => `Score: ${score}`

export default class ScoreLabel extends Phaser.GameObjects.Text {
    private _score: integer = 0

    constructor(scene: Phaser.Scene, score: integer) {
        super(scene, SCORE_LABEL.X, SCORE_LABEL.Y, formatScore(score), SCORE_LABEL.STYLE)
        this._score = score

        scene.add.existing(this)
    }

    get score() {
        return this._score
    }

    addScore(score: integer) {
        this._score += score
        this.updateLabel()
    }

    updateLabel() {
        this.setText(formatScore(this._score))
    }
}