import { DisplayNameUpdate, Play } from '@knucklebones/common'
import { GameStateStoreProps } from '../durable-objects/gameStateStore'

export type PromisifyPublicFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>>
    : never
}

export interface IttyDurableObjectNamespace<T> {
  get(id: string | DurableObjectId): PromisifyPublicFunctions<T>
}

export interface RequestWithProps extends Request, GameStateStoreProps {
  playerId?: string
  roomKey?: string
  content?: Play | DisplayNameUpdate
  query?: DisplayNameUpdate
}
