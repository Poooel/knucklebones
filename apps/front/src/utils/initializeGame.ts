export async function initializeGame(roomKey: string, clientId: string) {
  let queryParams = ''

  if ('displayName' in localStorage) {
    queryParams = `?displayName=${localStorage.displayName}`
  }

  return await fetch(
    `${
      import.meta.env.VITE_WORKER_URL
    }/${roomKey}/${clientId}/init${queryParams}`
  ).then((resp) => {
    if (!resp.ok) {
      throw new Error(
        `[${resp.status}:${resp.statusText}] Initializing the room ${roomKey} has failed.`
      )
    }
  })
}
