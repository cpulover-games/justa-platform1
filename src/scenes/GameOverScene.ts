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
            // use unary + operator to convert string to number
            const sceneWidth = +this.game.config.width
            const sceneHeight = +this.game.config.height
            // origin 0.5 to center text
            this.add.text(sceneWidth / 2, sceneHeight / 2 - 50, this._text, { fontSize: 70, fontStyle: 'bold' }).setOrigin(0.5)
            this.add.text(sceneWidth / 2, sceneHeight / 2, 'Score: ' + this._score, { fontSize: 35 }).setOrigin(0.5)

            const restartButton: Phaser.GameObjects.Text = this.add.text(sceneWidth / 2, sceneHeight / 2 + 80, 'Play again', { fontSize: 35 }).setOrigin(0.5)
            restartButton.setInteractive({ useHandCursor: true })
                .on('pointerover', () => restartButton.setColor('red'))
                .on('pointerout', () => restartButton.setColor('white'))
                .on('pointerdown', () => {
                    this.registry.destroy()
                    this.scene.start('playGame', { currentLevel: 1, score: 0, lives: 3})
                })
        }
    }
}