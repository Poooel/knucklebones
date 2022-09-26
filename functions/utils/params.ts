export function getRoomId(params: Params<any>): string {
  let roomKey: string

  if (Array.isArray(params.roomKey)) {
    roomKey = params.roomKey[0]
  } else {
    roomKey = params.roomKey
  }

  return `knucklebones:${roomKey}`
}

export function getClientId(request: Request) {
  const { searchParams } = new URL(request.url)
  return searchParams.get('clientId')
}
