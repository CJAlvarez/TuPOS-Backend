import { join } from 'path';

/**
 * Root folder for user-generated files served statically by the API.
 * Resolved from the process working directory so the write path (services)
 * and the read path (static middleware) always point to the same place,
 * both in `nest start` and in `node dist/main`.
 */
export const FILES_ROOT = join(process.cwd(), 'files');

/** Folder holding profile avatars. Exposed at `/files/profile_images/<name>`. */
export const PROFILE_IMAGES_DIR = join(FILES_ROOT, 'profile_images');

/** URL prefix under which FILES_ROOT is served. */
export const FILES_ROUTE_PREFIX = '/files/';
