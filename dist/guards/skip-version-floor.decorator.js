"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipVersionFloor = exports.SKIP_VERSION_FLOOR = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_VERSION_FLOOR = 'skipVersionFloor';
const SkipVersionFloor = () => (0, common_1.SetMetadata)(exports.SKIP_VERSION_FLOOR, true);
exports.SkipVersionFloor = SkipVersionFloor;
//# sourceMappingURL=skip-version-floor.decorator.js.map