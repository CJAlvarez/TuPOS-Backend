# Changelog - TuPOS Admin
En este archivo se documentan los cambios más relevantes del proyecto TuPOS Admin Backend. Los registros están redactados para personas; la entrada más reciente aparece primero.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y el proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Tipos de cambios: Added, Changed, Deprecated, Removed, Fixed, Security.

Este documento recopila nuevas funcionalidades, mejoras, correcciones de errores y notas de seguridad que afectan al backend.

## [v26.0.5] 2026-04-23
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