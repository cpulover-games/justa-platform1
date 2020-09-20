import { SCENE, TEXTURE, TILESET, TILEMAP, ANIM } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'
import Player from '~/elements/Player'
import Control from '~/Control'


export default class PlayGameScene extends Phaser.Scene {
    private _gameOver: boolean = false
    private _backgroud?: Phaser.GameObjects.Image
    private _player?: Player
    private _map?: Phaser.Tilemaps.Tilemap
    private _tileset?: Phaser.Tilemaps.Tileset
    private _platforms?: Phaser.Tilemaps.StaticTilemapLayer
    private _spikes?: Phaser.Physics.Arcade.Group
    private _ports?: Phaser.Physics.Arcade.Group
    private _coins?: Phaser.Physics.Arcade.Group

    constructor() {
        super(SCENE.LEVEL1)
    }

    preload() {
        this.load.image(TEXTURE.BACKGROUND, 'assets/images/background.png')
        this.load.image(TEXTURE.SPIKE, 'assets/images/spike.png')
        this.load.image(TEXTURE.PORT, 'assets/images/port.png')
        this.load.image(TEXTURE.COIN, 'assets/images/coin.png')
        this.load.atlas(TEXTURE.PLAYER, 'assets/images/kenney_player.png', 'assets/images/kenney_player_atlas.json')

        // tileset
        this.load.image(TILESET.PLATFORM, 'assets/tilesets/platformPack_tilesheet.png')
        // tilemap
        this.load.tilemapTiledJSON(TILEMAP.LEVEL1, 'assets/tilemaps/level1.json')
    }

    create() {
        this._backgroud = this.createBackgroud()
        this._map = this.createMap()
        this._platforms = this.createPlatforms()
        this._spikes = this.createEntityGroup('spikes', TEXTURE.SPIKE)
        this._ports=this.createEntityGroup('ports', TEXTURE.PORT)
        this._coins=this.createEntityGroup('coins', TEXTURE.COIN)
        this._player = new Player(this)

        Collision.setup(this)
    }

    createBackgroud() {
        const background: Phaser.GameObjects.Image = this.add.image(0, 0, TEXTURE.BACKGROUND).setOrigin(0, 0)
        background.setScale(1, 0.6)
        return background
    }

    createMap() {
        const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: TILEMAP.LEVEL1 })
        this._tileset = map.addTilesetImage('platformPack_tilesheet', TILESET.PLATFORM) // tileset name set in Tiled [level1.json]
        return map
    }

    createPlatforms() {
        if (this._tileset) {
            const platforms = this._map?.createStaticLayer('platforms', this._tileset, 0, 0) // layer name set in Tiled [level1.json]
            platforms?.setCollisionByExclusion([-1], true)
            return platforms
        }
    }

    createEntityGroup(layerName: string, texture: string) {
        // Create a sprite group for all entitiess, set common properties to ensure that
        // sprites in the group don't move via gravity or by player collisions
        const entityGroup: Phaser.Physics.Arcade.Group = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Let's get the entity objects, these are NOT sprites
        const entityObjects = this._map?.getObjectLayer(layerName)['objects'] as Phaser.Types.Tilemaps.TiledObject[]

        // Now we create entitys in our sprite group for each object in our map
        entityObjects.forEach(entityObject => {
            // Add new entitys to our sprite group, change the start y position to meet the platform 
            if (entityObject.y && entityObject.height && entityObject.x) {
                const entity = entityGroup.create(entityObject.x, entityObject.y - entityObject.height, texture).setOrigin(0, 0) as Phaser.Physics.Arcade.Image
                // reduce collision size
                // to keep the bounding box correctly encompassing the entitys we add an offset that matches the height reduction
                entity.body.setSize(entity.width, entity.height - 20).setOffset(0, 20)
            }

        });
        return entityGroup
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
    get platforms() {
        return this._platforms
    }
    get player() {
        return this._player
    }
    get spikes() {
        return this._spikes
    }
    get ports(){
        return this._ports
    }
    get coins(){
        return this._coins
    }
}