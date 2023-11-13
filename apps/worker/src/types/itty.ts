import { type GameStateDurableObjectProps } from '../durable-objects/GameStateDurableObject'

export type PromisifyPublicFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>>
    : never
}

export interface IttyDurableObjectNamespace<T> {
  get(id: string | DurableObjectId): PromisifyPublicFunctions<T>
}

export interface BaseRequestWithProps extends GameStateDurableObjectProps {
  roomKey: string
  playerId: string
}
