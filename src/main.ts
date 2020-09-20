import { GAME } from './constants/GAME'
import Phaser from 'phaser'

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
	}
}

export default new Phaser.Game(config)



