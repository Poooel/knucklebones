import { type GameSettings } from '@knucklebones/common'

type Method = 'GET' | 'POST' | 'DELETE'

// À synchroniser avece les types de requêtes côté back
interface IdentificationParams {
  roomKey: string
  playerId: string
}

type InitGameRequestParams = GameSettings
export async function initGame(
  { playerId, roomKey }: IdentificationParams,
  { boType, difficulty, playerType }: InitGameRequestParams
) {
  const urlSearchParams = new URLSearchParams()

  if (playerType === 'ai' && difficulty !== undefined) {
    urlSearchParams.append('difficulty', difficulty)
  } else if ('displayName' in localStorage) {
    urlSearchParams.append('displayName', localStorage.displayName)
  }

  if (boType !== undefined) {
    urlSearchParams.append('boType', String(boType))
  }

  const urlSearchParamsString = urlSearchParams.toString()

  const queryParamsString =
    urlSearchParamsString.length > 0 ? '?' + urlSearchParamsString : ''

  const path = `/${roomKey}/${playerId}/init${queryParamsString}`

  await sendApiRequest(path, 'POST')
}

export async function voteRematch({ playerId, roomKey }: IdentificationParams) {
  const path = `/${roomKey}/${playerId}/rematch`
  await sendApiRequest(path, 'POST')
}

interface PlayRequestParams {
  dice: number
  column: number
}
export async function play(
  { playerId, roomKey }: IdentificationParams,
  { column, dice }: PlayRequestParams
) {
  const path = `/${roomKey}/${playerId}/play/${column}/${dice}`
  await sendApiRequest(path, 'POST')
}
interface UpdateDisplayNameRequestParams {
  displayName: string
}
export async function updateDisplayName(
  { playerId, roomKey }: IdentificationParams,
  { displayName }: UpdateDisplayNameRequestParams
) {
  const path = `/${roomKey}/${playerId}/displayName/${displayName}`
  await sendApiRequest(path, 'POST')
}

export async function deleteDisplayName({
  playerId,
  roomKey
}: IdentificationParams) {
  const path = `/${roomKey}/${playerId}/displayName`
  await sendApiRequest(path, 'DELETE')
}

async function sendApiRequest(path: string, method: Method, body?: any) {
  const headers = {
    Accept: 'application/json',
    ...(body !== undefined && { 'Content-Type': 'application/json' })
  }

  await fetch(`${import.meta.env.VITE_WORKER_URL}${path}`, {
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
