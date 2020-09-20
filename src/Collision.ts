import Player from './elements/Player';
import PlayGameScene from './scenes/PlayGameScene';

export default class Collision {
    static setup(scene: PlayGameScene) {
        // check availabilities of game elements (attributes) in scene
        if (scene.platforms && scene.player && scene.spikes && scene.ports && scene.coins) {
            // add collision and overlapping between elements
            scene.physics.add.collider(scene.player, scene.spikes, this.playerHitsSpike, undefined, scene)
            scene.physics.add.overlap(scene.player, scene.ports, this.playerEntersPort, undefined, scene)
            scene.physics.add.overlap(scene.player, scene.coins, this.playerCollectsCoin, undefined, scene)
            scene.physics.add.collider(scene.player, scene.platforms)
        }
    }

    /* HANDLERS */
    static playerHitsSpike(thePlayer: Phaser.GameObjects.GameObject, theSpike: Phaser.GameObjects.GameObject) {
        // cast types
        const player = thePlayer as Player
        player.reset()
    }

    static playerEntersPort(thePlayer: Phaser.GameObjects.GameObject, thePort: Phaser.GameObjects.GameObject) {
        // cast types
        const player = thePlayer as Player
        const port = thePort as Phaser.Physics.Arcade.Image

        if (Math.abs(player.x - port.x) < 1) {
            alert("You win")
            return
        }
    }

    static playerCollectsCoin(thePlayer: Phaser.GameObjects.GameObject, theCoin: Phaser.GameObjects.GameObject) {
        // cast types
        const player = thePlayer as Player
        const coin = theCoin as Phaser.Physics.Arcade.Image

        coin.disableBody(true, true)
    }
}