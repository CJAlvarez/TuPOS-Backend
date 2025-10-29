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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_entity_1 = require("./user.entity");
const client_entity_1 = require("./client.entity");
const admin_entity_1 = require("./admin.entity");
let Profile = class Profile extends sequelize_typescript_1.Model {
    id_profile;
    id_user;
    user;
    client;
    admin;
    firstname;
    lastname;
    id_gender;
    id_country;
    phone;
    address;
    identification;
    image;
    created_at;
    updated_at;
};
exports.Profile = Profile;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Profile.prototype, "id_profile", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_entity_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Profile.prototype, "id_user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_entity_1.User, 'id_user'),
    __metadata("design:type", user_entity_1.User)
], Profile.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => client_entity_1.Client, 'id_user'),
    __metadata("design:type", client_entity_1.Client)
], Profile.prototype, "client", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => admin_entity_1.Admin, 'id_user'),
    __metadata("design:type", admin_entity_1.Admin)
], Profile.prototype, "admin", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Profile.prototype, "firstname", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Profile.prototype, "lastname", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Profile.prototype, "id_gender", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Profile.prototype, "id_country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Profile.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Profile.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Profile.prototype, "identification", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Profile.prototype, "image", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.NOW),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], Profile.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], Profile.prototype, "updated_at", void 0);
exports.Profile = Profile = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'profiles', timestamps: false })
], Profile);
//# sourceMappingURL=profile.entity.js.map