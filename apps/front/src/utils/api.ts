import { Play, PlayerType } from '@knucklebones/common'

export type Method = 'GET' | 'POST'

export async function init(
  roomKey: string,
  playerId: string,
  playerType: PlayerType = 'human',
  includeDisplayName: boolean = true
) {
  let queryParams = '?difficulty=hard'

  if (includeDisplayName && 'displayName' in localStorage) {
    queryParams = queryParams.concat(`&displayName=${localStorage.displayName}`)
  }

  const path = `/${roomKey}/${playerId}/init/${playerType}${queryParams}`

  return await sendApiRequest(path, 'POST')
}

export async function rematch(roomKey: string, playerId: string) {
  const path = `/${roomKey}/${playerId}/rematch`
  return await sendApiRequest(path, 'POST')
}

export async function play(roomKey: string, playerId: string, play: Play) {
  const path = `/${roomKey}/${playerId}/play/${play.column}/${play.value}`
  return await sendApiRequest(path, 'POST')
}

export async function displayName(
  roomKey: string,
  playerId: string,
  displayName: string
) {
  const path = `/${roomKey}/${playerId}/displayName/${displayName}`
  return await sendApiRequest(path, 'POST')
}

async function sendApiRequest(path: string, method: Method, body?: any) {
  const headers = {
    Accept: 'application/json',
    ...(body !== undefined && { 'Content-Type': 'application/json' })
  }

  return await fetch(`${import.meta.env.VITE_WORKER_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) })
  })
    .then(async (resp) => {
      if (!resp.ok) {
        throw new Error(
          `[${resp.status}:${resp.statusText}] There was an error while doing a network call. Please try again.`
        )
      }
    })
    .catch(() => {
      throw new Error(
        'There was an error while doing a network call. Please try again.'
      )
    })
}
