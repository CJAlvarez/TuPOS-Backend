import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppVersionController } from './app-version.controller';
import { AppVersionService } from './app-version.service';

/**
 * `ThrottlerModule.forRoot` is registered here rather than in AppModule, the
 * same way PassbooksModule does it, so the rest of the API keeps behaving
 * exactly as it does today. ThrottlerGuard resolves ThrottlerStorage and
 * THROTTLER_OPTIONS from the module that imports it, so without this local
 * import the guard would fail dependency resolution on the first request.
 *
 * The options differ from the passbooks ones (60/min against 20/min), so Nest
 * builds an independent instance with its own storage.
 */
@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }])],
  controllers: [AppVersionController],
  providers: [AppVersionService],
})
export class AppVersionModule {}
