import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/** A version string this project produces: `X`, `X.Y`, `X.Y.Z`, … */
export const VERSION_PATTERN = /^\d{1,9}(\.\d{1,9})*$/;

/** Reported when the version cannot be read. Nobody is below `0.0.0`. */
export const UNKNOWN_VERSION = '0.0.0';

const logger = new Logger('AppVersion');

/**
 * Reads this service's own version from its package.json, at runtime.
 *
 * The JSON is deliberately NOT imported. `tsconfig.json` does not enable
 * `resolveJsonModule`, and even with it enabled, importing a file above `src/`
 * would drag the inferred rootDir up to the repository root and the build would
 * emit `dist/src/main.js` — which is not what `start:prod` (`node dist/main`)
 * looks for. `tsconfig.build.json` documents that same trap for `scripts/` and
 * `migrations/`.
 *
 * Candidates, in order:
 *  - development (`nest start`): __dirname = <repo>/src/utils
 *    → ../../package.json, the repository's own.
 *  - production (`node dist/main`): __dirname = <repo>/dist/utils
 *    → ../package.json, the one scripts/create-dist-package.js writes with the
 *      real version.
 *  - the working directory, as a last resort.
 *
 * Never throws. A read failure returns `0.0.0`, so it cannot lock anyone out:
 * no real client version is below that. The error degrades toward "do not
 * block", which is the only safe direction here.
 */
export function readOwnVersion(): string {
  const candidates = [
    path.join(__dirname, '..', '..', 'package.json'),
    path.join(__dirname, '..', 'package.json'),
    path.join(process.cwd(), 'package.json'),
  ];

  for (const candidate of candidates) {
    try {
      const raw = fs.readFileSync(candidate, 'utf8');
      const parsed = JSON.parse(raw) as { version?: string };
      if (parsed.version && VERSION_PATTERN.test(parsed.version)) {
        return parsed.version;
      }
    } catch {
      // Try the next candidate.
    }
  }

  logger.error(
    `No se pudo leer la versión del package.json; se reporta ${UNKNOWN_VERSION}.`,
  );
  return UNKNOWN_VERSION;
}
