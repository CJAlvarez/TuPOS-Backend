"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const update_product_status_dto_1 = require("./dto/update-product-status.dto");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("../entities/product.entity");
const products_service_1 = require("./products.service");
const verify_token_guard_1 = require("../auth/guards/verify-token.guard");
const verify_disabled_user_guard_1 = require("../auth/guards/verify-disabled-user.guard");
const verify_admin_admin_guard_1 = require("../auth/guards/verify-admin-admin.guard");
const get_products_query_dto_1 = require("./dto/get-products-query.dto");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async getProducts(req, query) {
        return this.productsService.findAll(query, req.internal_store_id);
    }
    async getProductsPOS(req, query) {
        return this.productsService.getProductsPOS(query, req.internal_store_id);
    }
    findOne(id) {
        return this.productsService.findOne(Number(id));
    }
    create(req, data) {
        return this.productsService.create(req.internal_user_id, req.internal_store_id, data);
    }
    update(dto) {
        return this.productsService.update(dto);
    }
    remove(req, id) {
        return this.productsService.remove(req.internal_user_id, Number(id));
    }
    updateStatus(req, dto) {
        return this.productsService.updateStatus(req.internal_user_id, dto);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de Productos' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de Productos' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_products_query_dto_1.GetProductsQueryDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('pos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de Productos para POS' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de Productos para POS' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_products_query_dto_1.GetProductsQueryDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductsPOS", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Producto encontrado',
        type: product_entity_1.Product,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un producto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado', type: product_entity_1.Product }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Producto actualizado',
        type: product_entity_1.Product,
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto eliminado' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Habilitar o deshabilitar producto' }),
    (0, swagger_1.ApiBody)({ type: update_product_status_dto_1.UpdateProductStatusDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de producto actualizado' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_product_status_dto_1.UpdateProductStatusDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateStatus", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(verify_token_guard_1.VerifyTokenGuard, verify_disabled_user_guard_1.VerifyDisabledUserGuard, verify_admin_admin_guard_1.VerifyAdminAdminGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map