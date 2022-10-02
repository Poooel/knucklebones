export async function initializeGame(roomKey: string, clientId: string) {
  return await fetch(
    `${import.meta.env.VITE_WORKER_URL}/api/${roomKey}/${clientId}/init`
  ).then((resp) => {
    if (!resp.ok) {
      throw new Error(
        `[${resp.status}:${resp.statusText}] Initializing the room ${roomKey} has failed.`
      )
    }
  })
}
