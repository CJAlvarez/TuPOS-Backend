import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const SKIP_VERSION_FLOOR = 'skipVersionFloor';

/**
 * Exime a una ruta del AppVersionFloorGuard global.
 *
 * Solo tiene un uso legítimo: los endpoints que un cliente demasiado viejo
 * TIENE que poder leer para enterarse de que debe actualizarse. Si
 * `/app-version` devolviera 426, el cliente bloqueado nunca podría descubrir
 * cuál es la versión mínima ni salir del bloqueo.
 */
export const SkipVersionFloor = (): CustomDecorator<string> =>
  SetMetadata(SKIP_VERSION_FLOOR, true);
