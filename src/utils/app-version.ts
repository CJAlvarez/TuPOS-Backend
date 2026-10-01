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

/**
 * `'26.10.1'` → `[26, 10, 1]`, or `null` when the input is not a version this
 * project produces.
 *
 * Deliberately strict. An empty string, `undefined`, a proxy's error page or a
 * future `'26.3.0-rc.1'` all return `null`, and every caller treats `null` as
 * "not comparable" and does not block.
 */
export function parseVersion(value: unknown): number[] | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!VERSION_PATTERN.test(trimmed)) return null;
  return trimmed.split('.').map((part) => Number(part));
}

/**
 * Compares two versions segment by segment, NUMERICALLY. Missing segments count
 * as 0, so `'26.2'` and `'26.2.0'` are equal.
 *
 * Numerically and not as text: `'26.10.0'` is GREATER than `'26.9.9'`, which is
 * exactly what a string comparison gets wrong — and whether a client is refused
 * depends on this answer.
 *
 * @returns -1, 0 or 1, or `null` when either side is not comparable.
 */
export function compareVersions(a: unknown, b: unknown): -1 | 0 | 1 | null {
  const left = parseVersion(a);
  const right = parseVersion(b);
  if (!left || !right) return null;

  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) {
    const delta = (left[i] ?? 0) - (right[i] ?? 0);
    if (delta !== 0) return delta < 0 ? -1 : 1;
  }

  return 0;
}

/**
 * `true` only when `client` is DEMONSTRABLY older than `required`.
 *
 * Any doubt — either side missing, or in a format we do not recognize —
 * returns `false`. This is the predicate that can refuse a real till, so its
 * default answer is "do not refuse".
 */
export function isBehind(client: unknown, required: unknown): boolean {
  return compareVersions(client, required) === -1;
}
