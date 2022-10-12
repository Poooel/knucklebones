import { Play } from '@knucklebones/common'

export type Method = 'GET' | 'POST'

export async function init(roomKey: string, playerId: string) {
  let queryParams = ''

  if ('displayName' in localStorage) {
    queryParams = `?displayName=${localStorage.displayName}`
  }

  const path = `/${roomKey}/${playerId}/init${queryParams}`

  return await sendApiRequest(path, 'GET')
}

export async function rematch(roomKey: string, playerId: string) {
  const path = `/${roomKey}/${playerId}/rematch`
  return await sendApiRequest(path, 'POST')
}

export async function play(roomKey: string, playerId: string, play: Play) {
  const path = `/${roomKey}/${playerId}/play`
  return await sendApiRequest(path, 'POST', play)
}

export async function displayName(
  roomKey: string,
  playerId: string,
  displayName: string
) {
  const path = `/${roomKey}/${playerId}/displayName`
  return await sendApiRequest(path, 'POST', { displayName })
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
    .then((resp) => {
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
