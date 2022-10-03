export interface Env {
  ABLY_SERVER_SIDE_API_KEY: string
  ABLY_CLIENT_SIDE_API_KEY: string
  ABLY_JWT_STORE: KVNamespace
  GAME_STATE: DurableObjectNamespace
}
