# Gbajs3 Next.js

This directory contains a Next.js version of the Gbajs3 web emulator.

## Environment variables

```
NEXT_PUBLIC_GBA_SERVER_LOCATION=https://localhost
NEXT_PUBLIC_GBA_RELEASE_VERSION=dev
```

## Development

```
npm install
npm run dev
```

The `postinstall`, `predev`, and `prebuild` steps copy the mGBA runtime assets
(including `mgba.js`) into `public/wasm` for the runtime loader.

## Standalone

`gbajs3-next` is standalone. You can move it outside the Vite project directory
and it will still work as long as you install dependencies in that folder.

## Production

```
npm run build
npm run start
```
