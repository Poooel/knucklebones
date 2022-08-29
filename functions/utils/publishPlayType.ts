export interface PublishPlayBody {
  room: string
  play: Play
  clientId: string
}

export interface Play {
  x: number
  y: number
  value: number
}
