import { SCENE, TEXTURE, TILESET, TILEMAP } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'

export default class PlayGameScene extends Phaser.Scene {
    private _gameOver: boolean = false
    private _player?: Phaser.Physics.Arcade.Sprite
    private _cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
        super(SCENE.LEVEL1)
    }

    preload() {
        this.load.image(TEXTURE.BACKGROUND, 'assets/images/background.png')
        this.load.image(TEXTURE.SPIKE, 'assets/images/spike.png')
        this.load.atlas(TEXTURE.PLAYER, 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json')

        // tileset
        this.load.image(TILESET.PLATFORM, 'assets/tilesets/platformPack_tilesheet.png')
        // tilemap
        this.load.tilemapTiledJSON(TILEMAP.LEVEL1, 'assets/tilemaps/level1.json')
    }

    create() {
        const background: Phaser.GameObjects.Image = this.add.image(0, 0, TEXTURE.BACKGROUND).setOrigin(0, 0)
        background.setScale(2, 0.8)

        const map = this.make.tilemap({ key: TILEMAP.LEVEL1 })
        const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('platformPack_tilesheet', TILESET.PLATFORM)
        const platforms = map.createStaticLayer('platforms', tileset, 0, 200)
        platforms.setCollisionByExclusion([-1], true)


        this._player = this.physics.add.sprite(50, 300, TEXTURE.PLAYER)
        this._player.setCollideWorldBounds(true)
        this._player.setBounce(0.1)
        this._player.setGravity(0, 1000)
        this.physics.add.collider(this._player, platforms)

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'robo_player_0' }],
            frameRate: 10,
        })
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'robo_player_1' }],
            frameRate: 10,
        })
        this._cursors = this.input.keyboard.createCursorKeys();

        Collision.setup(this)
    }

    update() {
        // controls
        // Control the player with left or right keys
        if (this._cursors?.left?.isDown) {
            this._player?.setVelocityX(-200);
            if (this._player?.body.touching.down) {
                this._player?.play('walk', true);
            }
        } else if (this._cursors?.right?.isDown) {
            this._player?.setVelocityX(200);
            if (this._player?.body.blocked.down) {
                this._player?.play('walk', true);
            }
        } else {
            // If no keys are pressed, the player keeps still
            this._player?.setVelocityX(0);
            // Only show the idle animation if the player is footed
            // If this is not included, the player would look idle while jumping
            if (this._player?.body.blocked.down) {
                this._player?.play('idle', true);
            }
        }

        // Player can jump while walking any direction by pressing the space bar
        // or the 'UP' arrow
        if ((this._cursors?.space?.isDown || this._cursors?.up?.isDown) && this._player?.body.blocked.down) {
            this._player?.setVelocityY(-550);
            this._player?.play('jump', true);
        }

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
    get player() {
        return this._player
    }
}