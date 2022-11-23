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
  console.log('AI is playing...')

  const aiPlay = async () => {
    console.log('Creating AI instance...')

    const ai = new Ai(
      gameState.playerOne,
      gameState.playerTwo,
      gameState.nextPlayer.dice!
    )

    console.log('Getting suggested next move...')

    const nextMove = ai.suggestNextPlay()

    console.log('AI Suggested Next Move: ', nextMove)

    await sleep(getRandomIntInclusive(500, 1000))

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
