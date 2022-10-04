import { Play } from '@knucklebones/common'

export async function sendPlay(roomKey: string, play: Play) {
  return await fetch(`${import.meta.env.VITE_WORKER_URL}/${roomKey}/play`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(play)
  })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(
          `[${resp.status}:${
            resp.statusText
          }] Sending play to room ${roomKey} has failed ${JSON.stringify(
            play
          )}.`
        )
      }
    })
    .catch(() => {
      throw new Error('Error while sending play.')
    })
}
