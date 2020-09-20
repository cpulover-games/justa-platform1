import Player from './elements/Player';
import PlayGameScene from './scenes/PlayGameScene';

export default class Collision {
    static setup(scene: PlayGameScene) {
        // check availabilities of game elements (attributes) in scene
        if (scene.platforms && scene.player && scene.spikes) {
            // add collision and overlapping between elements
            scene.physics.add.collider(scene.player, scene.spikes, this.playerHitsSpike, undefined, scene)
            scene.physics.add.collider(scene.player, scene.platforms)
        }
    }

    /* HANDLERS */
    static playerHitsSpike(thePlayer: Phaser.GameObjects.GameObject, theSpike: Phaser.GameObjects.GameObject) {
        // cast types
        const player = thePlayer as Player
        player.reset()
    }
}