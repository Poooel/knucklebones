export async function initializeGame(roomKey: string, clientId: string) {
  return await fetch(`/api/${roomKey}/init?clientId=${clientId}`).then(
    (resp) => {
      if (!resp.ok) {
        throw new Error(
          `[${resp.status}:${resp.statusText}] Initializing the room ${roomKey} has failed.`
        )
      }
    }
  )
}
