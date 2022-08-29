export const jsonResponse = (value, init: ResponseInit) =>
  new Response(JSON.stringify(value), {
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init
  })
