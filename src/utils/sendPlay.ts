import { Play } from '../../shared-types/play'

export async function sendPlay(roomKey: string, play: Play) {
  return await fetch(`/api/${roomKey}/play`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(play)
  }).then((resp) => {
    if (!resp.ok) {
      throw new Error(
        `[${resp.status}:${
          resp.statusText
        }] Sending play to room ${roomKey} has failed ${JSON.stringify(play)}.`
      )
    }
  })
}
