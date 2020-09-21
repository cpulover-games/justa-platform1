import Player from './elements/Player';
import PlayGameScene from './scenes/PlayGameScene';

export default class Collision {
    static setup(scene: PlayGameScene) {
        // check availabilities of game elements (attributes) in scene
        if (scene.platforms && scene.player && scene.spikes && scene.ports && scene.coins) {
            // add collision and overlapping between elements
            scene.physics.add.collider(scene.player, scene.spikes, this.playerHitsSpike, undefined, scene)
            scene.physics.add.overlap(scene.player, scene.ports,
                function (thePlayer: Phaser.GameObjects.GameObject, thePort: Phaser.GameObjects.GameObject) {
                    Collision.playerEntersPort(thePlayer, thePort, scene)
                }, undefined, scene)
            scene.physics.add.overlap(scene.player, scene.coins, 
                function(thePlayer: Phaser.GameObjects.GameObject, theCoin:Phaser.GameObjects.GameObject){
                    Collision.playerCollectsCoin(thePlayer, theCoin, scene)
                }, undefined, scene)
            scene.physics.add.collider(scene.player, scene.platforms)
        }
    }

    /* HANDLERS */
    static playerHitsSpike(thePlayer: Phaser.GameObjects.GameObject, theSpike: Phaser.GameObjects.GameObject) {
        // cast types
        const player = thePlayer as Player
        player.reset()
    }

    static playerEntersPort(thePlayer: Phaser.GameObjects.GameObject, thePort: Phaser.GameObjects.GameObject, scene: PlayGameScene) {
        // cast types
        const player = thePlayer as Player
        const port = thePort as Phaser.Physics.Arcade.Image
        scene.gameOver = 'Win'
    }

    static playerCollectsCoin(thePlayer: Phaser.GameObjects.GameObject, theCoin: Phaser.GameObjects.GameObject, scene: PlayGameScene) {
        // cast types
        const player = thePlayer as Player
        const coin = theCoin as Phaser.Physics.Arcade.Image

        scene.scoreLabel?.addScore(23)
        coin.disableBody(true, true)
    }
}