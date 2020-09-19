import { GAME } from './constants/GAME'
import Phaser from 'phaser'

import PlayGameScene from './scenes/PlayGameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: GAME.WIDTH,
	height: GAME.HEIGHT,
	scene: [PlayGameScene],
	physics: {
		default: GAME.PHYSIC_SYSTEM,
		arcade: {
			gravity: { y: GAME.GRAVITY },
			debug: GAME.DEBUG
		}
	}
}

export default new Phaser.Game(config)


