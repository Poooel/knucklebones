export const jsonResponse = (value, init) =>
  new Response(JSON.stringify(value), {
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init
  })
