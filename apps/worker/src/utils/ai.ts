import { GameState, getRandomIntInclusive, sleep } from '@knucklebones/common'
import { Ai } from '../classes/Ai'
import { play } from '../endpoints'
import { CloudflareEnvironment } from '../types/cloudflareEnvironment'
import { BaseRequestWithProps } from '../types/itty'

export function makeAiPlay(
  gameState: GameState,
  request: BaseRequestWithProps,
  cloudflareEnvironment: CloudflareEnvironment,
  context: ExecutionContext
) {
  const aiPlay = async () => {
    const ai = new Ai(
      gameState.playerOne,
      gameState.playerTwo,
      gameState.nextPlayer.dice!,
      gameState.nextPlayer.difficulty!
    )

    const nextMove = ai.suggestNextPlay()

    const [min, max] =
      process.env.NODE_ENV === 'development' ? [100, 200] : [500, 1000]
    await sleep(getRandomIntInclusive(min, max))

    await play(
      {
        dice: gameState.playerTwo.dice!,
        column: nextMove.column,
        roomKey: request.roomKey,
        playerId: gameState.playerTwo.id,
        GAME_STATE_DURABLE_OBJECT: request.GAME_STATE_DURABLE_OBJECT
      },
      cloudflareEnvironment,
      context
    )
  }

  context.waitUntil(aiPlay())
}
