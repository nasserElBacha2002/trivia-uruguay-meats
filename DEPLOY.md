# Deploy en VPS (OpenCloud) con Docker Compose

Este proyecto queda desplegado con dos contenedores:

- `frontend`: React/Vite build servido por Nginx (puerto público 80).
- `backend`: API Express + SQLite (solo red interna de compose).

La base SQLite persiste en volumen Docker (`trivia_sqlite_data`).

## 1) Requisitos del servidor

- Ubuntu/Debian reciente (o distro compatible con Docker).
- Docker + Docker Compose Plugin:
  - `docker --version`
  - `docker compose version`
- Puertos abiertos en firewall:
  - `80/tcp` (HTTP)
  - `443/tcp` si luego agregás TLS con reverse proxy externo.

## 2) Obtener el código

```bash
git clone <repo-url>
cd trivia-uruguay-meats
```

## 3) Configurar variables de entorno

Copiá y editá:

```bash
cp .env.example .env
```

Variables mínimas a revisar en `.env`:

- `NODE_ENV=production`
- `FRONTEND_PORT=80`
- `PORT=3001`
- `VITE_API_BASE_URL=` (vacío; el frontend ya usa rutas `/api/*`)
- `FRONTEND_ORIGIN=http://<tu-dominio-o-ip>`
- `SQLITE_DB_PATH=/data/trivia.db`
- `ADMIN_USERNAME=<usuario-admin>`
- `ADMIN_PASSWORD=<password-admin>`

> Importante: no commitear `.env`.

## 4) Levantar el sistema

```bash
docker compose up -d --build
```

Ver estado:

```bash
docker compose ps
```

## 5) Logs y diagnóstico

Todos los servicios:

```bash
docker compose logs -f
```

Solo backend:

```bash
docker compose logs -f backend
```

Solo frontend:

```bash
docker compose logs -f frontend
```

## 6) Reiniciar servicios

```bash
docker compose restart
```

O solo uno:

```bash
docker compose restart backend
docker compose restart frontend
```

## 7) Actualizar despliegue (git pull)

```bash
git pull
docker compose up -d --build
```

## 8) Verificación funcional post-deploy

1. Frontend público:
   - `http://<dominio-o-ip>/`
2. Admin:
   - `http://<dominio-o-ip>/admin`
3. API health (proxied):
   - `http://<dominio-o-ip>/api/health`
4. Flujo trivia:
   - idioma → formulario → quiz → resultado.
5. Admin:
   - login, tabla, ver respuestas, exportar Excel.

## 9) Persistencia SQLite

Se usa el volumen Docker:

- `trivia_sqlite_data` montado en `/data` dentro de `backend`.
- DB en `SQLITE_DB_PATH=/data/trivia.db`.

Para verificar volumen:

```bash
docker volume ls | grep trivia_sqlite_data
```

Backup rápido de DB (ejemplo):

```bash
docker compose exec backend sh -lc 'cp /data/trivia.db /data/trivia-backup-$(date +%F-%H%M).db'
```

## 10) Notas de seguridad (manual)

- Configurar TLS (Nginx externo/Caddy/Traefik o cloud LB con certs).
- Usar `ADMIN_PASSWORD` robusta.
- En producción real, migrar auth admin a hash + storage seguro.
- Restringir acceso a `/admin` por IP/VPN si aplica.
