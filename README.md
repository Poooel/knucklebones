# knucklebones

Inspired by the Knucklebones mini game from Cult of the Lamb.

Hosted on [knucklebones.io](https://knucklebones.io/), via CloudFlare pages ([specific deployment for Vite](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/)).

Built with React, Vite, TypeScript, Tailwind and Ably (messaging system).

## Development

Install the dependencies with:

```sh
yarn install
```

Be sure that you have a `.dev.vars` file at the project root. It must define a value for `ABLY_CLIENT_SIDE_API_KEY`, which will be used as an environment variable when running the workers.

Then, to start the pages and workers, run:

```sh
yarn dev
```
