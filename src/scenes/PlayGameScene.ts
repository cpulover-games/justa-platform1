import { SCENE, TEXTURE, TILESET, TILEMAP } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'
import Player from '~/elements/Player'
import Control from '~/Control'

export default class PlayGameScene extends Phaser.Scene {
    private _gameOver: boolean = false
    private _player?: Player

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
        background.setScale(1, 0.6)

        const map = this.make.tilemap({ key: TILEMAP.LEVEL1 })
        const tileset: Phaser.Tilemaps.Tileset = map.addTilesetImage('platformPack_tilesheet', TILESET.PLATFORM) // tileset name set in Tiled [level1.json]
        const platforms = map.createStaticLayer('platforms', tileset, -95, 200) // layer name set in Tiled [level1.json]
        platforms.setCollisionByExclusion([-1], true)

        this._player= new Player(this)

        Collision.setup(this)
        this.physics.add.collider(this._player, platforms)
    }

    update() {
        Control.setup(this, this._player)

        // game over
        if (this._gameOver) {
            return
        }
    }

    /* GETTERS - SETTERS */
    set gameOver(state: boolean) {
        this._gameOver = state
    }
}