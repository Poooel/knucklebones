// export async function initializeGame(roomKey: string, clientId: string) {
//   return await fetch(
//     `${
//       import.meta.env.VITE_WORKER_URL
//     }/api/${roomKey}/init?clientId=${clientId}`
//   ).then((resp) => {
//     if (!resp.ok) {
//       throw new Error(
//         `[${resp.status}:${resp.statusText}] Initializing the room ${roomKey} has failed.`
//       )
//     }
//   })
// }
export async function initializeGame(roomKey: string, clientId: string) {
  return await fetch(
    `${import.meta.env.VITE_WORKER_URL}/increment?name=pol`
  ).then((resp) => {
    if (!resp.ok) {
      throw new Error(
        `[${resp.status}:${resp.statusText}] Initializing the room ${roomKey} has failed.`
      )
    }
  })
}
