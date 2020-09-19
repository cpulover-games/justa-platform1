import { ANIM } from './constants/KEY'
import { PLAYER } from './constants/ELEMENT'
import PlayGameScene from './scenes/PlayGameScene';
import Player from './elements/Player';

export default class Control {
    private static _cursor?: Phaser.Types.Input.Keyboard.CursorKeys
    private static _turningLeft: boolean = false

    static setup(scene: PlayGameScene, player?: Player) {
        this._cursor = scene.input.keyboard.createCursorKeys()

        if (this._cursor?.left?.isDown) {  // left
            this.flipPlayer(player)
            player?.setVelocityX(-PLAYER.SPEED_X)
            if (player?.body.blocked.down) {
                player.anims.play(ANIM.PLAYER_TO_LEFT, true)
            }
        } else if (this._cursor?.right?.isDown) { // right
            this.flipPlayer(player)
            player?.setVelocityX(PLAYER.SPEED_X)
            if (player?.body.blocked.down) {
                player.anims.play(ANIM.PLAYER_TO_RIGHT, true)
            }
        } else { // idle            
            player?.setVelocityX(0)
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (player?.body.blocked.down) {
                player?.anims.play(ANIM.PLAYER_IDLE)
            }
        }

        if ((this._cursor?.space?.isDown || this._cursor?.up?.isDown) && player?.body.blocked.down) { // jump
            player.setVelocityY(-PLAYER.SPEED_Y)
            player.anims.play(ANIM.PLAYER_JUMP, true)
        }
    }

    private static flipPlayer(player?: Player) {
        if (this._cursor?.left?.isDown && !this._turningLeft && player) {
            player.flipX = true
            this._turningLeft = true
        }
        if (this._cursor?.right?.isDown && this._turningLeft && player) {
            player.flipX = false
            this._turningLeft = false
        }
    }
}