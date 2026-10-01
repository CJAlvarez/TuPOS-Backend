# Changelog - TuPOS Admin
En este archivo se documentan los cambios más relevantes del proyecto TuPOS Admin Backend. Los registros están redactados para personas; la entrada más reciente aparece primero.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y el proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Tipos de cambios: Added, Changed, Deprecated, Removed, Fixed, Security.

Este documento recopila nuevas funcionalidades, mejoras, correcciones de errores y notas de seguridad que afectan al backend.

## [v26.2.0] 2026-08-20
### Added
- Se agrega el endpoint público `GET /api/app-version`, que publica la versión del backend, la versión mínima de cliente aceptada y si la actualización es obligatoria. El cliente de escritorio lo consulta para saber si puede seguir operando. Es público a propósito: el frontend lo lee **antes** de que alguien inicie sesión, y un instalador cuya `x-app-key` quedó desfasada es justamente el que necesita enterarse de que debe actualizarse.
- Se agregan las variables de entorno `ADMIN_MIN_VERSION` y `ADMIN_UPDATE_MANDATORY`. Sin configurar, el piso es la propia versión del backend y no se bloquea a nadie, de modo que desplegar una versión nueva no tiene efecto sobre los clientes hasta que alguien suba el piso deliberadamente.
- Se agrega `AppVersionFloorGuard`, que responde HTTP 426 a los clientes que están demostrablemente por debajo del piso cuando la actualización es obligatoria. Es defensa en profundidad detrás del bloqueo del frontend, para los casos en que ese frontend no coopere: una versión anterior al control, una pestaña abierta desde antes de subir el piso, o un cliente modificado. Falla hacia "no bloquear" en cualquier duda.
- Se agrega el decorador `@SkipAppKey()` y la lectura por `Reflector` en `AppKeyGuard`. Hasta ahora no existía ninguna forma de eximir una ruta de la validación de `x-app-key`.
- Se agrega la variable `DB_SYNC` (por defecto `false`) para permitir que Sequelize construya el esquema desde los modelos al levantar una base local vacía. El esquema no se puede reconstruir desde `database/migrations/`, que solo contiene migraciones incrementales.

### Security
- `GET /api/app-version` está limitado a 60 peticiones por minuto y por dirección. El límite se registra dentro de `AppVersionModule`, así que el resto de la API no cambia de comportamiento.
- `ADMIN_UPDATE_MANDATORY` se compara estrictamente contra `'true'`. `'TRUE'`, `'1'` y `'yes'` **no** activan el bloqueo: ante una variable mal escrita, el valor por defecto tiene que ser "no dejar a nadie afuera".

## [v26.1.1] 2026-08-19
### Fixed
- Se corrige `POST /api/auth/first-login`, que rechazaba el formulario del asistente. El frontend envía `multipart/form-data` porque puede llevar un avatar, y el controlador no tenía parser de multipart, por lo que el cuerpo llegaba vacío y la validación respondía "debe ser mayor a 6". Además se alinean los nombres de campo, se persiste el perfil y se devuelve una sesión utilizable.
- Se corrige el ordenamiento de los listados de usuarios y clientes, que aceptaba cualquier columna recibida por parámetro; ahora se valida contra una lista permitida.

### Security
- `UsersService.findAll` excluía `password` pero no `restore_code`, por lo que la respuesta incluía en texto plano el JWT de recuperación de contraseña. Se excluye también ese campo, en usuarios y en clientes.
- Se respeta el borrado lógico en los listados: los registros con `deleted_at` ya no se devuelven.

## [v26.0.5] 2026-05-18
### Added
- Se agrega el campo `id_inventory` (nullable) a `sale_items` para registrar de qué lote de inventario salió cada producto vendido, permitiendo trazabilidad completa.

### Changed
- El servicio `InventoryService.handleStock` ahora filtra el inventario disponible por `id_store`, garantizando que una venta solo consuma stock de la propia tienda.
- Al procesar una devolución, si el `sale_item` tiene `id_inventory`, se restauran las unidades al lote exacto del que salieron. Si no tiene `id_inventory` (FIFO consumió varios lotes), se suman las unidades a cada lote existente del producto en la tienda.

### Security
- Implemented application-layer Row-Level Security (RLS) across all store-scoped modules. Previously, authenticated admins could read or modify records from other stores by guessing row IDs. All `findOne`, `update`, `remove`, and `updateStatus` service methods now receive the caller's `storeId` from `req.internal_store_id` and enforce it in every Sequelize `WHERE` clause.
- Fixed `products.remove()` which used `Op.not: null` instead of `Op.is: null`, causing soft-deletes to silently no-op on valid records.
- `invoice-config.update()` no longer uses a hardcoded `findByPk(1)`; it now resolves the config record by `id_store`.

## [v26.0.4] 2026-04-08
### Added
- Se deja funcional el módulo de Lealtad(Royalty).
- Se agregan los reportes inventory_low_reports, inventory_expiring_reports y daily_sales_reports.

### Changed
- Se cambia el Cron de Jobs a que sólo se ejecute si la variable EXECUTE_JOBS_EVERY existe, esta define cada cuantos minutos se ejecutan los jobs.
- Se cambia el proceso que controla ACTIVE_HOURS, si no se define, no se apaga el proceso.

### Fixed
- Se corrige el mensaje de respuesta al eliminar una entidad.
- Se corrige el query de findAll para que no incluya los deleted.

## [v26.0.3] 2026-04-06
### Changed
- Se definen los campos para caja en los Productos como opcionales.
- Se definen los campos caja y código en los Productos como opcionales.

## [v2.0.2] 2025-10-26
### Added
- Reconstrucción del Sistema

## [v2.0.1] 2025-10-25
### Added
- Reconstrucción del Sistema