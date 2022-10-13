export interface CloudflareEnvironment {
  ABLY_SERVER_SIDE_API_KEY: string
  ABLY_CLIENT_SIDE_API_KEY: string
  ABLY_JWT_STORE: KVNamespace
  GAME_STATE_STORE: DurableObjectNamespace
}
