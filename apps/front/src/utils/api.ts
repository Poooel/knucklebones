import { Difficulty, Play, PlayerType } from '@knucklebones/common'

export type Method = 'GET' | 'POST' | 'DELETE'

export async function init(
  roomKey: string,
  playerId: string,
  playerType: PlayerType,
  difficulty?: Difficulty
) {
  const urlSearchParams = new URLSearchParams()

  if (playerType === 'ai' && difficulty !== undefined) {
    urlSearchParams.append('difficulty', difficulty)
  } else if ('displayName' in localStorage) {
    urlSearchParams.append('displayName', localStorage.displayName)
  }

  const urlSearchParamsString = urlSearchParams.toString()

  const queryParamsString =
    urlSearchParamsString.length > 0 ? '?' + urlSearchParamsString : ''

  const path = `/${roomKey}/${playerId}/init${queryParamsString}`

  return await sendApiRequest(path, 'POST')
}

export async function rematch(roomKey: string, playerId: string) {
  const path = `/${roomKey}/${playerId}/rematch`
  return await sendApiRequest(path, 'POST')
}

export async function play(roomKey: string, play: Play) {
  const path = `/${roomKey}/${play.author}/play/${play.column}/${play.dice}`
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

export async function deleteDisplayName(roomKey: string, playerId: string) {
  const path = `/${roomKey}/${playerId}/displayName`
  return await sendApiRequest(path, 'DELETE')
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
