
import Phaser from 'phaser'

export default class TextLabel extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x:number, y:number, text:string, style) {
        super(scene, x, y, text, style)

        this.setScrollFactor(0) // fixed to camera
        scene.add.existing(this)
    }


    updateLabel() {
        // this.setText(formatScore(this._score))
    }
}