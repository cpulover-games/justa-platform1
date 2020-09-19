import { SCENE, TEXTURE, TILESET, TILEMAP } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'

export default class PlayGameScene extends Phaser.Scene {
    private _gameOver: boolean = false

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


        const player: Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(50, 300, TEXTURE.PLAYER)
        player.setCollideWorldBounds(true)
        player.setBounce(0.1)
        this.physics.add.collider(player, platforms)

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