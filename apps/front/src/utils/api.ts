import { Play } from '@knucklebones/common'

export type Method = 'GET' | 'POST'

export async function init(roomKey: string, clientId: string) {
  let queryParams = ''

  if ('displayName' in localStorage) {
    queryParams = `?displayName=${localStorage.displayName}`
  }

  const path = `/${roomKey}/${clientId}/init${queryParams}`

  return await sendApiRequest(path, 'GET')
}

export async function rematch(roomKey: string, clientId: string) {
  const path = `/${roomKey}/${clientId}/rematch`
  return await sendApiRequest(path, 'POST')
}

export async function play(roomKey: string, clientId: string, play: Play) {
  const path = `/${roomKey}/${clientId}/play`
  return await sendApiRequest(path, 'POST', play)
}

export async function displayName(
  roomKey: string,
  clientId: string,
  displayName: string
) {
  const path = `/${roomKey}/${clientId}/displayName`
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
