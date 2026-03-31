# Mahana Tours - Documentación del Backend y Sistema

Este documento resume la arquitectura, configuración y comandos necesarios para arrancar y gestionar el sistema de Mahana Tours en un entorno de desarrollo local, tras la última reestructuración del backend.

## 🚀 Cómo iniciar el sistema localmente

Para arrancar tanto el frontend (web pública + panel de administración) como el servidor backend simultáneamente, **solo necesitas abrir tu terminal en la carpeta principal del proyecto y ejecutar:**

```bash
pnpm dev:full
```

Este comando ejecutará internamente:
1. `pnpm run dev`: Inicia el servidor de desarrollo de Vite (Frontend) en `http://localhost:3000/`.
2. `pnpm run server`: Inicia el servidor de Express (Backend) en `http://127.0.0.1:5001/`.

### 🔑 Acceso al Panel de Administración

Una vez que el sistema esté corriendo con el comando anterior, puedes gestionar los tours y categorías accediendo a:

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Usuario:** `admin`
- **Contraseña:** `123456` *(Esta es la contraseña configurada en la base de datos local predeterminada)*.

Desde el panel podrás ver la lista de tours, editar descripciones, precios y subir nuevas imágenes. Todos los cambios que realices se guardarán en la base de datos y se reflejarán instantáneamente en la web pública.

---

## 🛠️ Resumen de la Arquitectura Implementada

Esta sección documenta los cambios técnicos realizados para estabilizar el sistema en Windows y migrar los datos estáticos a un entorno dinámico y escalable:

### 1. Migración a Base de Datos (SQLite + Drizzle + LibSQL)
- Se reemplazó el uso de datos quemados en código (variables como `ALL_TOURS` y `CATEGORIES`) por consultas en tiempo real a una base de datos SQLite (`sqlite.db`).
- Se utilizó el adaptador `@libsql/client` para resolver problemas de compatibilidad nativa en Windows que presentaba `better-sqlite3`.
- Ambas tablas (`tours` y `categories`) se comunican con el frontend de manera segura exportando sus respectivos tipos desde `schema.ts`.

### 2. Estabilización de Puertos y Red
- **Puerto 5001:** El backend fue movido del puerto 5000 al **5001** para evitar conflictos con el servicio pasivo de Windows "Control de Acceso" que bloqueaba el puerto original.
- **Resolución IPv6:** Se forzó al servidor backend a escuchar estrictamente en la IP local IPv4 (`127.0.0.1`) previniendo fallas de red por resolución fallida a `::1`.
- **Proxy en Vite:** `vite.config.ts` se actualizó para redirigir todas las llamadas al API (`/api/*`) hacia la IP explícita del backend.

### 3. Frontend Dinámico (React Query)
- Las pantallas de catálogo de tours (`Tours.tsx`), detalles de tour único (`TourDetail.tsx`), el inicio (`Home.tsx`) y los yates de lujo (`Botes.tsx`) implementan la librería dinámica `@tanstack/react-query`.
- Esto permite caché inteligente, rápida re-carga de datos al modificar elementos en el panel admin, y una experiencia rápida para los usuarios.

### 4. Corrección de Script de Arranque (pnpm conflict)
- Uno de los mayores bloqueos era que el comando corto `pnpm server` disparaba un servicio interno nativo del propio manejador de paquetes de Node (`pnpm`) el cual se "tragaba" la solicitud y salía con estado de éxito (código 0) sin iniciar nuestro código.
- Se corrigió el archivo `package.json` forzando el comando mediante `pnpm run server`.
