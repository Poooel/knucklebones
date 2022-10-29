import { GameStateStoreProps } from '../durable-objects/gameStateStore'

export type PromisifyPublicFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>>
    : never
}

export interface IttyDurableObjectNamespace<T> {
  get(id: string | DurableObjectId): PromisifyPublicFunctions<T>
}

export interface BaseRequestWithProps extends GameStateStoreProps {
  roomKey: string
  playerId: string
}
