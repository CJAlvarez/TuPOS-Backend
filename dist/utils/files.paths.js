"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILES_ROUTE_PREFIX = exports.PROFILE_IMAGES_DIR = exports.FILES_ROOT = void 0;
const path_1 = require("path");
exports.FILES_ROOT = (0, path_1.join)(process.cwd(), 'files');
exports.PROFILE_IMAGES_DIR = (0, path_1.join)(exports.FILES_ROOT, 'profile_images');
exports.FILES_ROUTE_PREFIX = '/files/';
//# sourceMappingURL=files.paths.js.map