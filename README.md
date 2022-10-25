<p align="center">
  <a href="https://knucklebones.io" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./.github/logo-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="./.github/logo-light.svg">
      <img alt="Knucklebones" src="./.github/logo-light.svg" width="350" height="70" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  The Knucklebones dice game in <a href="https://www.cultofthelamb.com/" target="_blank">Cult of the Lamb</a>.
</p>

---

You can find the game at [knucklebones.io](https://knucklebones.io/).

The frontend is built with: [React](https://reactjs.org/), [Vite](https://vitejs.dev/) & [Tailwind CSS](https://tailwindcss.com/).

The backend is built with: [Cloudflare Workers](https://developers.cloudflare.com/workers/) & [Durable Objects](https://developers.cloudflare.com/workers/runtime-apis/durable-objects/)

The frontend is hosted with [Cloudflare Pages](https://developers.cloudflare.com/pages/) while the backend is a Cloudflare Worker.

All of it is written with [TypeScript](https://www.typescriptlang.org/).

## Repository structure

We use [Turborepo](https://turbo.build/) to manage our monorepo.

The `apps` directory contains the React application (`front`) and the Cloudflare Worker (`worker`) (along with the definition of the Durable Object).

The `packages` directory contains code that's shared between the React application and Cloudflare worker.
