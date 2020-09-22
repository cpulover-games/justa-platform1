import { GAME } from './constants/GAME'
import Phaser from 'phaser'
import OutlineEffectLayerPlugin from 'phaser3-rex-plugins/plugins/outlineeffectlayer-plugin.js';


import PlayGameScene from './scenes/PlayGameScene'
import GameOverScene from './scenes/GameOverScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: GAME.WIDTH,
	height: GAME.HEIGHT,
	scene: [PlayGameScene, GameOverScene],
	physics: {
		default: GAME.PHYSIC_SYSTEM,
		arcade: {
			gravity: { y: GAME.GRAVITY },
			debug: GAME.DEBUG
		}
	},
	plugins: {
        global: [{
            key: 'rexOutlineEffectLayerPlugin',
            plugin: OutlineEffectLayerPlugin,
            start: true
        },
        // ...
        ]
    }
}

export default new Phaser.Game(config)



