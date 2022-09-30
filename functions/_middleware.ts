import sentryPlugin from '@cloudflare/pages-plugin-sentry'
import { Env } from './types/env'

export const onRequest: PagesFunction<Env> = (context) => {
  return sentryPlugin({ dsn: context.env.SENTRY_DSN })(context)
}
