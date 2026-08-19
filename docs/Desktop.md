# Desktop (Electron) — estado actual

Convivencia con la web:

| | Web | Desktop |
| --- | --- | --- |
| Cómo corre | `npm run dev` / `docker compose up` | `npm run desktop:dev` / `desktop:start` |
| `.env` | sí (servidor / desarrollo) | **nunca en la PC destino** |
| API | Express en `PORT` (Docker/local) | Express in-process, `127.0.0.1` puerto dinámico |
| DB | `SQLITE_DB_PATH` o `backend/data/trivia.db` | `%APPDATA%\TriviaUruguayMeats\data\trivia.db` |
| Entrega | Docker | **Setup.exe** (NSIS x64) |

## Scripts

```bash
npm run desktop:dev      # desarrollo (Express + SQLite + dist). DevTools
npm run desktop:build    # compila frontend + backend + electron
npm run desktop:dist     # genera Setup.exe en dist/electron/
npm run desktop:smoke    # persistencia + single instance
```

## Entrega al cliente

```text
1. Descargar Setup.exe
2. Doble click
3. Si Windows muestra una advertencia: Más información → Ejecutar de todas formas
4. Esperar instalación
5. Abrir desde el acceso directo
```

El instalador **no está firmado**. SmartScreen puede mostrar “Windows protegió tu PC”. Eso no bloquea el uso.

Admin staff: `Ctrl+Shift+A` → `/admin`. Usuario `admin` / password `admin` (temporal).

## SQLite

Instalado (NSIS): `%APPDATA%\TriviaUruguayMeats\data\trivia.db`  
macOS (dev): `~/Library/Application Support/TriviaUruguayMeats/data/trivia.db`

No va a Program Files ni al asar. Reinstalar **no** borra AppData (`deleteAppDataOnUninstall: false`).

Al cerrar: `PRAGMA wal_checkpoint(TRUNCATE)` y `db.close()`.

## Packaging (desde macOS)

`better-sqlite3` 13 incluye prebuild `win32-x64.node`. `npm run desktop:dist` en Mac genera un Setup.exe válido sin compile cruzado.

Icono: no hay `.ico` propio; Windows usa el icono default de Electron.

## Native module (dev)

`desktop:rebuild-native` recompila better-sqlite3 para el ABI de Electron en la máquina de desarrollo. Después, `npm run dev:api` puede necesitar `npm rebuild better-sqlite3 --prefix backend` para volver al ABI de Node.
