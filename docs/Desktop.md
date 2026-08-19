# Desktop (Electron) — estado actual

Convivencia con la web:

| | Web | Desktop |
| --- | --- | --- |
| Cómo corre | `npm run dev` / `docker compose up` | `npm run desktop:dev` / `desktop:start` |
| `.env` | sí (servidor / desarrollo) | **nunca en la PC destino** |
| API | Express en `PORT` (Docker/local) | Express in-process, `127.0.0.1` puerto dinámico |
| DB | `SQLITE_DB_PATH` o `backend/data/trivia.db` | `app.getPath("userData")/data/trivia.db` |
| Fase | producción Docker | **Fase 2** (Express + SQLite) |

`Setup.exe` / portable **todavía no existen**.

## Scripts

```bash
npm run desktop:build    # frontend + backend + electron + rebuild better-sqlite3
npm run desktop:dev      # stack real (Express+SQLite+dist). DevTools. Requiere dist.
npm run desktop:start    # igual, sin DevTools
npm run desktop:smoke    # health + participant + answers + complete + persistencia
```

UI HMR sigue en `npm run dev:all` (web, dos orígenes). Desktop production/dev de esta fase es **same-origin**: Express sirve `dist/` y `/api/*`.

## SQLite desktop

No se copia `trivia-uruguay` del repo. El primer arranque crea una DB vacía con schema.

macOS (dev): `~/Library/Application Support/TriviaUruguayMeats/data/trivia.db`  
Windows (prod): `%APPDATA%\TriviaUruguayMeats\data\trivia.db`

Override solo para tests: `TRIVIA_USER_DATA`.

## Admin desktop (temporal Fase 2)

Usuario `admin` / password `admin`, inyectados desde Electron (no `.env`). Reemplazar por hash en una fase posterior.

## Acceso staff a `/admin`

No hay botón Admin en la trivia. En la ventana de Electron:

`Ctrl+Shift+A` (en macOS dev también `Cmd+Shift+A`) navega a `/admin` con React Router, usando el origin ya resuelto (`http://127.0.0.1:<puerto>`). El atajo es local a la ventana (`before-input-event`), no un `globalShortcut` de sistema.

El login admin sigue siendo obligatorio. `Volver a trivia` en `/admin` navega a `/`. AttractPage resetea una trivia a medio completar si se vuelve a `/` (comportamiento actual). El atajo en sí no borra el estado.

En desktop, `window.triviaDesktop` fuerza el API al origin actual (`/api`), aunque el `dist` se haya compilado con `VITE_API_BASE_URL` de desarrollo web.

```bash
npm run desktop:staff-shortcut-smoke
```

## Native module

`better-sqlite3` vive en `backend/node_modules`. `desktop:rebuild-native` lo recompila para el ABI de Electron. Después de eso, `npm run dev:api` puede necesitar `npm rebuild better-sqlite3 --prefix backend` para volver al ABI de Node.
