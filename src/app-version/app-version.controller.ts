import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { SkipAppKey } from '../guards/skip-app-key.decorator';
import { SkipVersionFloor } from '../guards/skip-version-floor.decorator';
import { AppVersionInfo, AppVersionService } from './app-version.service';

/**
 * Backend version and admin-client update policy.
 *
 * Public (`@SkipAppKey()`) for the same reason `/health` is, and this is the
 * decorator's third legitimate use after `/health` and `GET /verify`: the
 * frontend reads this BEFORE anyone logs in, and an app key that has drifted
 * between an old installer and the server is precisely the case where the
 * operator needs to be told to update. If this route required the key, that
 * client would get a 404 and never find out.
 *
 * It exposes nothing sensitive: three fields that are already public in
 * practice, since anyone holding a published installer can read its version.
 */
@ApiTags('app-version')
@Controller('app-version')
export class AppVersionController {
  constructor(private readonly service: AppVersionService) {}

  @Get()
  @SkipAppKey()
  // Un cliente por debajo del piso TIENE que poder leer esta ruta: es la única
  // forma de que descubra cuál es la versión mínima y salga del bloqueo.
  @SkipVersionFloor()
  @UseGuards(ThrottlerGuard)
  // 60/min per address rather than passbooks' 20: a whole branch NATs out
  // through a single IP and every machine starts at the same hour, so a lower
  // limit would stop real tills from checking their version.
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @ApiOperation({
    summary:
      'Versión del backend y política de actualización (endpoint público)',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        version: '26.2.1',
        min_version: '26.2.1',
        mandatory_update: false,
      },
    },
  })
  getVersionInfo(): AppVersionInfo {
    return this.service.getVersionInfo();
  }
}
