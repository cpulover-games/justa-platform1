import { SCENE, TEXTURE } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'

export default class PlayGameScene extends Phaser.Scene {
    private _gameOver: boolean = false

    constructor() {
        super(SCENE.PLAY_GAME)
    }

    preload() {
    }

    create() {
        this.add.text(0, 0, "Play game scene")

        Collision.setup(this)
    }

    update() {
        // controls

        // game over
        if (this.gameOver) {
            return
        }
    }

    /* GETTERS - SETTERS */
    get gameOver() {
        return this._gameOver
    }
    set gameOver(state: boolean) {
        this._gameOver = state
    }
}