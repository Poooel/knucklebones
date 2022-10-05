export async function rematch(roomKey: string, clientId: string) {
  return await fetch(
    `${import.meta.env.VITE_WORKER_URL}/${roomKey}/${clientId}/rematch`,
    { method: 'post' }
  ).then((resp) => {
    if (!resp.ok) {
      throw new Error(`[${resp.status}:${resp.statusText}] Rematch has failed.`)
    }
  })
}
