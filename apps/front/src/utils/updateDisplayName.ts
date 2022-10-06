export async function updateDisplayName(
  roomKey: string,
  clientId: string,
  displayName: string
) {
  return await fetch(
    `${import.meta.env.VITE_WORKER_URL}/${roomKey}/${clientId}/displayName`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ displayName })
    }
  )
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(
          `[${resp.status}:${resp.statusText}] There was en error while updating the display name.`
        )
      }
    })
    .catch(() => {
      throw new Error('Error while updating the display name.')
    })
}
