# Property API

API NestJS para gestion de usuarios e inmuebles.

## Requisitos

- Node.js
- pnpm
- PostgreSQL

## Configuracion

Crear `.env` basado en `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=property_api
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
```

## Instalacion

```bash
pnpm install
```

## Base de datos

Levantar PostgreSQL:

```bash
docker compose up -d
```

En desarrollo, las migraciones se ejecutan automaticamente al levantar la app.

Tambien puedes correrlas manualmente:

```bash
pnpm run migration:run
```

## Levantar proyecto

```bash
pnpm run start:dev
```

Base URL:

```http
http://localhost:5001/api
```

## Usuarios de prueba

```json
{
  "nombre": "Carlos Perez",
  "email": "carlos.perez@example.com",
  "password": "Password123"
}
```

```json
{
  "nombre": "Maria Gonzalez",
  "email": "maria.gonzalez@example.com",
  "password": "Password321"
}
```

Login:

```http
POST /api/auth/login
```
