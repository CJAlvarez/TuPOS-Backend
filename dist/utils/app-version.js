"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNKNOWN_VERSION = exports.VERSION_PATTERN = void 0;
exports.readOwnVersion = readOwnVersion;
exports.parseVersion = parseVersion;
exports.compareVersions = compareVersions;
exports.isBehind = isBehind;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
exports.VERSION_PATTERN = /^\d{1,9}(\.\d{1,9})*$/;
exports.UNKNOWN_VERSION = '0.0.0';
const logger = new common_1.Logger('AppVersion');
function readOwnVersion() {
    const candidates = [
        path.join(__dirname, '..', '..', 'package.json'),
        path.join(__dirname, '..', 'package.json'),
        path.join(process.cwd(), 'package.json'),
    ];
    for (const candidate of candidates) {
        try {
            const raw = fs.readFileSync(candidate, 'utf8');
            const parsed = JSON.parse(raw);
            if (parsed.version && exports.VERSION_PATTERN.test(parsed.version)) {
                return parsed.version;
            }
        }
        catch {
        }
    }
    logger.error(`No se pudo leer la versión del package.json; se reporta ${exports.UNKNOWN_VERSION}.`);
    return exports.UNKNOWN_VERSION;
}
function parseVersion(value) {
    if (typeof value !== 'string')
        return null;
    const trimmed = value.trim();
    if (!exports.VERSION_PATTERN.test(trimmed))
        return null;
    return trimmed.split('.').map((part) => Number(part));
}
function compareVersions(a, b) {
    const left = parseVersion(a);
    const right = parseVersion(b);
    if (!left || !right)
        return null;
    const length = Math.max(left.length, right.length);
    for (let i = 0; i < length; i++) {
        const delta = (left[i] ?? 0) - (right[i] ?? 0);
        if (delta !== 0)
            return delta < 0 ? -1 : 1;
    }
    return 0;
}
function isBehind(client, required) {
    return compareVersions(client, required) === -1;
}
//# sourceMappingURL=app-version.js.map