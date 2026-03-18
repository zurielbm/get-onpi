# ONPI Desktop

Local-first Electron desktop MVP for building and installing `.onpi` packages for DaVinci Resolve assets.

## Scope

- Make Package
- Install Package
- Installed Packages
- Uninstall tracked packages
- Local JSON settings and install registry

## Stack

- Electron
- TypeScript
- React
- electron-vite
- zod
- adm-zip

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Sample Fixture

```bash
npm run fixture:sample
```

This writes a sample `.onpi` archive to `fixtures/sample-package/cinematic-titles-1.0.0.onpi`.

## Notes

- The MVP only supports current-user installs.
- Package install paths are resolved centrally in `packages/core/resolver/pathResolver.ts`.
- Installed package tracking is stored under the Electron user data directory in `onpi/installed-packages.json`.
- No backend, login, publishing, network sync, or update checks are implemented.
