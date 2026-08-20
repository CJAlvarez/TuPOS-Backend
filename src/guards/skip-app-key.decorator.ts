import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const SKIP_APP_KEY = 'skipAppKey';

/**
 * Exime a una ruta (o a un controlador completo) del AppKeyGuard global.
 *
 * Es la única forma de perforar la validación de `x-app-key`. Úsalo solo en
 * endpoints que deban ser públicos por definición y que no expongan datos de
 * negocio ni información del entorno.
 */
export const SkipAppKey = (): CustomDecorator<string> =>
  SetMetadata(SKIP_APP_KEY, true);
