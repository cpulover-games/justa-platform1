import Phaser from 'phaser'
import OutlineEffectLayerPlugin from 'phaser3-rex-plugins/plugins/outlineeffectlayer-plugin.js';


import PlayGameScene from './scenes/PlayGameScene'
import GameOverScene from './scenes/GameOverScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 64 * 10, // tile width * width
	height: 64 * 8, // tile height * height
	scene: [PlayGameScene, GameOverScene],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
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



