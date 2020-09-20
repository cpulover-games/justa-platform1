import { SCENE, TEXTURE, TILESET, TILEMAP, ANIM } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'
import Player from '~/elements/Player'
import Control from '~/Control'

export default class PlayGameScene extends Phaser.Scene {
    private _gameOver: boolean = false
    private _backgroud?: Phaser.GameObjects.Image
    private _player?: Player
    private _map?:Phaser.Tilemaps.Tilemap
    private _tileset?: Phaser.Tilemaps.Tileset
    private _platforms?:Phaser.Tilemaps.StaticTilemapLayer
    private _spikes?:Phaser.Physics.Arcade.Group

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
        this.load.tilemapTiledJSON(TILEMAP.LEVEL1, 'assets/tilemaps/level2.json')
    }

    create() {   
        this._backgroud=this.createBackgroud()
        this._map=this.createMap()       
        this._platforms=this.createPlatforms()
        this._spikes= this.createSpikes()
        this._player = new Player(this)

        Collision.setup(this)
    }

    createBackgroud(){
        const background: Phaser.GameObjects.Image = this.add.image(0, 0, TEXTURE.BACKGROUND).setOrigin(0, 0)
        background.setScale(1, 0.6)
        return background
    }

    createMap(){
        const map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: TILEMAP.LEVEL1 })
        this._tileset = map.addTilesetImage('platformPack_tilesheet', TILESET.PLATFORM) // tileset name set in Tiled [level1.json]
        return map
    }

    createPlatforms(){
        if(this._tileset){
        const platforms = this._map?.createStaticLayer('platforms', this._tileset, -95, 200) // layer name set in Tiled [level1.json]
        platforms?.setCollisionByExclusion([-1], true)
        return platforms
        } 
    }

    createSpikes(){
        // Create a sprite group for all spikes, set common properties to ensure that
        // sprites in the group don't move via gravity or by player collisions
        const spikes: Phaser.Physics.Arcade.Group = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        // Let's get the spike objects, these are NOT sprites
        const spikeObjects = this._map?.getObjectLayer('spikes')['objects'] as Phaser.Types.Tilemaps.TiledObject[]

        // Now we create spikes in our sprite group for each object in our map
        spikeObjects.forEach(spikeObject => {
            // Add new spikes to our sprite group, change the start y position to meet the platform 
            if (spikeObject.y && spikeObject.height && spikeObject.x) {
                const spike = spikes.create(spikeObject.x - 95, spikeObject.y + 202 - spikeObject.height, TEXTURE.SPIKE).setOrigin(0, -0) as Phaser.Physics.Arcade.Image
                // reduce collision size
                // to keep the bounding box correctly encompassing the spikes we add an offset that matches the height reduction
                spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20)
            }

        });
        return spikes
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
    get platforms(){
        return this._platforms
    }
    get player(){
        return this._player
    }
    get spikes(){
        return this._spikes
    }
}