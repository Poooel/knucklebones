// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
export { CounterTs } from './counter'

export default {
  async fetch(request: Request, env: Env) {
    try {
      return await handleRequest(request, env)
    } catch (e) {
      return new Response(`${e}`)
    }
  }
}

async function handleRequest(request: Request, env: Env) {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')
  if (!name) {
    return new Response(
      'Select a Durable Object to contact by using' +
        ' the `name` URL query string parameter. e.g. ?name=A'
    )
  }

  // Every unique ID refers to an individual instance of the Counter class that
  // has its own state. `idFromName()` always returns the same ID when given the
  // same string as input (and called on the same class), but never the same
  // ID for two different strings (or for different classes).
  const id = env.COUNTER.idFromName(name)

  // Construct the stub for the Durable Object using the ID. A stub is a
  // client object used to send messages to the Durable Object.
  const obj = env.COUNTER.get(id)

  // Send a request to the Durable Object, then await its response.
  const resp = await obj.fetch(request.url)
  const count = parseInt(await resp.text())
  const wasOdd = count % 2 === 0 ? 'is odd' : 'is even'

  return new Response(`Durable Object '${name}' ${count} ${wasOdd}`)
}

interface Env {
  COUNTER: DurableObjectNamespace
}
