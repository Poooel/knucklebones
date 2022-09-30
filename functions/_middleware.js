import Toucan from 'toucan-js'

const SentryMiddleware = async ({ request, next, env, waitUntil }) => {
  const sentry = new Toucan({
    dsn: env.SENTRY_DSN,
    context: { waitUntil, request }
  })
  try {
    return await next()
  } catch (thrown) {
    sentry.captureException(thrown)
    return new Response(`Error ${thrown}`, {
      status: 500
    })
  }
}

export const onRequest = [SentryMiddleware]
