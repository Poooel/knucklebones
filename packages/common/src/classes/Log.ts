import { type ILog } from '../interfaces'

export class Log {
  private static lastTimestamp: number = 0

  content: string
  timestamp: number

  constructor(content: string, timestamp?: number) {
    this.content = content
    this.timestamp = timestamp ?? this.getTimestamp()
  }

  private getTimestamp(): number {
    const timestamp = Math.max(Date.now(), Log.lastTimestamp + 1)
    Log.lastTimestamp = timestamp
    return timestamp
  }

  static fromJson(log: ILog) {
    return new Log(log.content, log.timestamp)
  }

  toJson(): ILog {
    return {
      content: this.content,
      timestamp: this.timestamp
    }
  }
}
