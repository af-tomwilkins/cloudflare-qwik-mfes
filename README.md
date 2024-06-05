# Cloudflare Qwik MFEs

This repository demonstrates the challenges we are facing using Qwik in a Cloudflare micro-frontend (MFE) architecture.

This is a scaled down version of an application using two MFEs - `main` and `body`. `main` is the entry point, and renders the `body` MFE inside of it. Upon serving the application, you'll notice dotted borders are used on container elements to clearly show the boundary between MFEs.

The main challenge is around prefetching where multiple Qwik containers are used. Containers emit a `'qprefetch'` `CustomEvent` with filenames for their bundles, and a global listener forwards them to a Service Worker for prefetching. The problem is that the global listener uses `document.currentScript.closest('[q\\:container]')` to resolve the base, which will always resolve to `main`. This architecture works when a single container is used, but when there are multiple containers, each with a unique base, the listener fails to construct the correct URLs for bundles outside of `main`.

`body` renders a button to interact with. On click, this will render a new component to demonstrate lazy loading (and the lack of prefetching). All `qprefetch` events are logged to the console, which demonstrates that bundles are emitted without a base. In the HTML, the `prefetch-service-worker` script element shows the global listener, which clearly shows how the base is resolved.

In creating this reproduction another bug has been spotted with the Service Worker itself.

This function is taken from [https://github.com/QwikDev/qwik/blob/f6fc2f855a11b541d383bf9b26db399dbb781a5a/packages/qwik/src/prefetch-service-worker/process-message.ts#L150](GitHub)

```ts
export function drainMsgQueue(swState: SWState) {
  if (!swState.$msgQueuePromise$ && swState.$msgQueue$.length) {
    const top = swState.$msgQueue$.shift()!;
    swState.$msgQueuePromise$ = processMessage(swState, top).then(() => {
      drainMsgQueue(swState);
    });
  }
}
```

Messages are only processed when `$msgQueuePromise$` is falsey. Conceptually this is fine, however there is no code that restores it to a falsey value when all messages are processed. The result is that only the first message to the SW is processed.

## Installing

This project uses NPM workspaces. Running `npm i` at the project root will install all dependencies for all MFEs.

Docs for main dependencies:

- [Wrangler](https://developers.cloudflare.com/workers/wrangler/), used to serve the application in a local Cloudflare environment.
- [Qwik](https://qwik.dev/), used to write the application.
- [Vite](https://vitejs.dev/), used to build the application.

## Serving

Both MFEs need to be served to view the full application.

1. Open a terminal in the `/packages/main` directory, and run `npm start`.
1. Open a terminal in the `/packages/body` directory, and run `npm start`.

`main` will serve on [localhost:8080](http://localhost:8080), you can view the full application from here.
`body` will serve inside `main`, but can be viewed in isolation on [localhost:8090](http://localhost:8090).
