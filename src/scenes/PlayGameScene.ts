import OutlineEffectLayer from 'phaser3-rex-plugins/plugins/outlineeffectlayer-plugin.js';

import { SCENE, TEXTURE, TILESET, TILEMAP, ANIM } from '../constants/KEY'
import Phaser from 'phaser'
import Collision from '~/Collision'
import Player from '~/elements/Player'
import Control from '~/Control'
import ScoreLabel from '~/elements/ScoreLabel'

export default class PlayGameScene extends Phaser.Scene {
    private _gameOver?: string
    private _backgroud?: Phaser.GameObjects.Image
    private _player?: Player
    private _map?: Phaser.Tilemaps.Tilemap
    private _tileset?: Phaser.Tilemaps.Tileset
    private _platforms?: Phaser.Tilemaps.StaticTilemapLayer
    private _spikes?: Phaser.Physics.Arcade.Group
    private _ports?: Phaser.Physics.Arcade.Group
    private _coins?: Phaser.Physics.Arcade.Group
    private _scoreLabel?: ScoreLabel

    private copyingCoin: boolean = false
    private coinShadow?: Phaser.GameObjects.Image
    private cointTemplate?: Phaser.GameObjects.Image
    private pointer?: Phaser.Input.Pointer
    private effectLayer?: OutlineEffectLayer

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

        this.load.plugin('rexoutlineeffectlayerplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexoutlineeffectlayerplugin.min.js', true)
    }

    create() {
        console.log(this.game.device.os)

        this._backgroud = this.createBackgroud()
        this._map = this.createMap()
        this._platforms = this.createPlatforms()
        this._spikes = this.createEntityGroup('spikes', TEXTURE.SPIKE)
        this._ports = this.createEntityGroup('ports', TEXTURE.PORT)
        this._coins = this.createEntityGroup('coins', TEXTURE.COIN)
        this._player = new Player(this)
        this._scoreLabel = new ScoreLabel(this, 0)
        this.coinShadow = this.add.image(-100, -100, TEXTURE.COIN).setOrigin(0.5).setAlpha(0.5)
        this.pointer = this.input.activePointer;

        // template images
        // this.add.image(34, 479, TEXTURE.COIN)
        // this.add.image(96, 469, TEXTURE.SPIKE).setScale(0.7, 0.8)

        // this.effectLayer = this.add.rexOutlineEffectLayer({
        //     knockout: true,
        //     outlineColor: 0xff0000,
        //     thickness: 3
        // })
        //     .setDepth(1);

        /* EVENTS */
        this.input.on('pointerdown', (pointer) => {
            var touchX = pointer.x;
            var touchY = pointer.y;
            console.log(`touchX: ${touchX} -  touchY: ${touchY}`)

            if (this.copyingCoin && !this.insideCoinTemplate(touchX, touchY) && touchY < 369) { //TODO: exclude when click the coin template
                const newCoint = this.coins?.create(touchX - 22, touchY - 17, TEXTURE.COIN).setOrigin(0, 0) as Phaser.Physics.Arcade.Image
                this.enableDrag(newCoint)
            } else if (this.insideCoinTemplate(touchX, touchY)) {
                this.copyingCoin = true
            } else if (this.insideCancelTemplate(touchX, touchY)) {
                this.cancelCopy()
            }
        });

        this.game.events.on('blur',()=> {
            console.log("Window is blurred")
            this.scene.pause()
        })
        this.game.events.on('focus',()=> {
            console.log("Window is focused")
            this.scene.resume()
        })       


        Collision.setup(this)
    }

    insideCoinTemplate(x: number, y: number) {
        if (x > 2 && x < 62 && y > 449 && y < 506) {
            return true
        } else {
            return false
        }
    }

    insideCancelTemplate(x: number, y: number) {
        if (x > 578 && x < 635 && y > 449 && y < 506) {
            return true
        } else {
            return false
        }
    }

    cancelCopy() {
        this.copyingCoin = false
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

                this.enableDrag(entity)
            }

        });
        return entityGroup
    }

    enableDrag(entity: Phaser.Physics.Arcade.Image) {
        let originalX
        let originalY
        entity.setInteractive({ draggable: true, useHandCursor: true  })
            .on('dragstart', function (pointer: Phaser.Input.Pointer, dragX, dragY) {
                // ...
                originalX = entity.x
                originalY = entity.y
            })
            .on('drag', function (pointer: Phaser.Input.Pointer, dragX, dragY) {
                entity.setPosition(dragX, dragY)
                if (pointer.position.y > 369) {
                    entity.setTint(0xff0000)
                } else {
                    entity.clearTint()
                }
            })
            .on('dragend', function (pointer: Phaser.Input.Pointer, dragX, dragY, dropped) {
                // ...
                if (pointer.position.y > 369) {
                    entity.setPosition(originalX, originalY)
                    entity.clearTint()
                } 
            })
    }

    update() {
        Control.setup(this, this.player)

        if (this.copyingCoin && this.pointer) {
            if (this.pointer.position.y < 369) {
                this.coinShadow?.setPosition(this.pointer?.position.x, this.pointer?.position.y).setAlpha(0.5)
            } else {
                this.coinShadow?.setAlpha(0)
            }
        }

        // game over
        if (this._gameOver == 'Win') {
            this._gameOver='' // clear state in case restarting from game over scene
            this.scene.start(SCENE.GAME_OVER, { text: 'You win', score: this.scoreLabel?.score }) // pass data to next scene
        }
    }

    /* GETTERS - SETTERS */
    set gameOver(state: string) {
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
    get ports() {
        return this._ports
    }
    get coins() {
        return this._coins
    }
    get scoreLabel() {
        return this._scoreLabel
    }
}