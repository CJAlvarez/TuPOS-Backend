"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppKeySecurity = AppKeySecurity;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function AppKeySecurity() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('app-key'));
}
//# sourceMappingURL=app-key-security.decorator.js.map