# knucklebones

Inspired by the Knucklebones mini game from Cult of the Lamb.

Hosted on [knucklebones.io](https://knucklebones.io/), via CloudFlare pages ([specific deployment for Vite](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/)).

Built with React, Vite, TypeScript, Turbo, Tailwind and Ably (messaging system).

## Folder structure

This repository is a monorepo, and uses `turbo` is used to orchestrate the commands across apps (e.g. `dev` and `build`) in a fast manner, and cache them when needed.

### `apps`

Projects within this folder are applications meant to be run:

- `worker` is running on CloudFlare and serves as the back-end of the application, storing and serving the game state;
- `front` is served by CloudFlare and running on the browser, rendering the game on the client side.

### `packages`

Projects within this folder are libraries, code that is not run directly but used in applications:

- `common` is a set of types and utilities shared across the `apps`.

### Root level

The root level is used for configuration files that are shared across `apps` and `packages`, and a central point for commands via `turbo`.

Configuration files include but are not limited to: `eslint`, `prettier`, `tsconfig` (the base file is imported when needed), `turbo`.

> Note: `devDependencies` should all be installed at the root level, while bundled dependencies should be installed within the project that are using them.

## Development

Install the dependencies with:

```sh
yarn install
```

Be sure that you have a `.dev.vars` file within the `/apps/worker` folder. It must define a value for `ABLY_CLIENT_SIDE_API_KEY` and `ABLY_SERVER_SIDE_API_KEY`, which will be used as an environment variables when running the worker.

Then, to start the apps (page and worker), run:

```sh
yarn dev
```
