#!/usr/bin/env node

/**
 * Script para generar módulos NestJS completos siguiendo el patrón de productos
 * Uso: node scripts/generate-module.js <entity-file-path>
 * Ejemplo: node scripts/generate-module.js src/entities/return.entity.ts
 */

const fs = require('fs');
const path = require('path');

// Utilidades
const toPascalCase = (str) => {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

const toCamelCase = (str) => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const pluralize = (str) => {
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies';
  }
  if (str.endsWith('s') || str.endsWith('x') || str.endsWith('ch') || str.endsWith('sh')) {
    return str + 'es';
  }
  return str + 's';
};

// Analizar archivo de entidad
function parseEntityFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extraer nombre de la clase
  const classMatch = content.match(/export class (\w+) extends Model/);
  if (!classMatch) {
    throw new Error('No se pudo encontrar la definición de la clase');
  }
  const entityName = classMatch[1];
  
  // Extraer nombre de la tabla
  const tableMatch = content.match(/tableName:\s*['"](\w+)['"]/);
  const tableName = tableMatch ? tableMatch[1] : toKebabCase(entityName);
  
  // Detectar campos
  const fields = [];
  const fieldRegex = /@Column\([^)]*\)\s+(\w+):\s*([^;]+);/g;
  let match;
  while ((match = fieldRegex.exec(content)) !== null) {
    const [, fieldName, fieldType] = match;
    if (!['id', 'created_at', 'updated_at', 'deleted_at', 'deleted_by', 'disabled_at', 'disabled_by', 'created_by'].includes(fieldName)) {
      fields.push({
        name: fieldName,
        type: fieldType.trim(),
        optional: fieldType.includes('?') || fieldType.includes('null'),
      });
    }
  }
  
  // Detectar si tiene soft delete
  const hasSoftDelete = content.includes('deleted_at') && content.includes('deleted_by');
  
  // Detectar si tiene disabled
  const hasDisabled = content.includes('disabled_at') && content.includes('disabled_by');
  
  // Detectar si tiene created_by
  const hasCreatedBy = content.includes('created_by');
  
  // Detectar campos de búsqueda (string/text)
  const searchableFields = fields.filter(f => 
    f.type.includes('string') || f.type.includes('String') || f.name.includes('name') || f.name.includes('description') || f.name.includes('reason')
  );
  
  return {
    entityName,
    tableName,
    fields,
    hasSoftDelete,
    hasDisabled,
    hasCreatedBy,
    searchableFields,
  };
}

// Generar DTO de creación
function generateCreateDto(entityInfo) {
  const { entityName, fields } = entityInfo;
  const imports = new Set(['IsInt', 'IsOptional']);
  
  const fieldDefinitions = fields.map((field) => {
    let validators = [];
    let typeImport = null;
    
    if (field.type.includes('number') || field.type.includes('Number')) {
      validators.push('@IsInt()');
      imports.add('IsInt');
    } else if (field.type.includes('string') || field.type.includes('String')) {
      validators.push('@IsString()');
      imports.add('IsString');
    } else if (field.type.includes('boolean') || field.type.includes('Boolean')) {
      validators.push('@IsBoolean()');
      imports.add('IsBoolean');
    } else if (field.type.includes('Date')) {
      validators.push('@IsDateString()');
      imports.add('IsDateString');
    } else if (field.type.includes('DECIMAL')) {
      validators.push('@Type(() => Number)');
      validators.push('@IsNumber()');
      imports.add('IsNumber');
      typeImport = 'Type';
    }
    
    if (field.optional) {
      validators.unshift('@IsOptional()');
      imports.add('IsOptional');
    }
    
    const apiProperty = field.optional 
      ? `@ApiProperty({ description: '${field.name}', required: false })`
      : `@ApiProperty({ description: '${field.name}' })`;
    
    return `  ${apiProperty}\n  ${validators.join('\n  ')}\n  ${field.name}${field.optional ? '?' : ''}: ${field.type.replace(/\s*\|\s*null/, '')};`;
  }).join('\n\n');
  
  const validatorImports = Array.from(imports).join(', ');
  const typeTransformerImport = imports.has('IsNumber') ? "import { Type } from 'class-transformer';\n" : '';
  
  return `import { ApiProperty } from '@nestjs/swagger';
import { ${validatorImports} } from 'class-validator';
${typeTransformerImport}
export class Create${entityName}Dto {
${fieldDefinitions}
}
`;
}

// Generar DTO de actualización
function generateUpdateDto(entityInfo) {
  const createDto = generateCreateDto(entityInfo);
  return createDto
    .replace(`Create${entityInfo.entityName}Dto`, `Update${entityInfo.entityName}Dto`)
    .replace(/^(export class Update\w+Dto \{)/, `$1\n  @ApiProperty({ description: 'ID' })\n  @IsInt()\n  id: number;\n`);
}

// Generar DTO de query
function generateQueryDto(entityInfo) {
  const { searchableFields } = entityInfo;
  const hasSearch = searchableFields.length > 0;
  
  return `import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class Get${entityInfo.entityName}sQueryDto {
${hasSearch ? `  @ApiPropertyOptional({ description: 'Palabra de búsqueda' })
  @IsOptional()
  @IsString()
  search_word?: string;

` : ''}  @ApiPropertyOptional({ description: 'Número de registros a omitir' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Límite de registros' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
`;
}

// Generar DTO de status
function generateStatusDto(entityInfo) {
  return `import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean } from 'class-validator';

export class Update${entityInfo.entityName}StatusDto {
  @ApiProperty({ description: 'ID' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Estado activo/inactivo' })
  @IsBoolean()
  enable: boolean;
}
`;
}

// Generar servicio
function generateService(entityInfo) {
  const { entityName, hasSoftDelete, hasDisabled, hasCreatedBy, searchableFields } = entityInfo;
  const entityVar = toCamelCase(entityName);
  const hasSearch = searchableFields.length > 0;
  
  const searchConditions = searchableFields.map(f => `        { ${f.name}: { [Op.like]: \`%\${search_word}%\` } }`).join(',\n');
  
  const searchBlock = hasSearch ? `
    if (search_word) {
      where[Op.or] = [
${searchConditions}
      ];
    }
    ` : '';
  
  const softDeleteWhere = hasSoftDelete ? `
    where.deleted_at = { [Op.is]: null };
    ` : '';
  
  let createSignature, createBody;
  if (hasCreatedBy) {
    createSignature = `create(dto: Create${entityName}Dto, internal_user_id: number)`;
    createBody = `    return this.${entityVar}Model.create({
      ...dto,
      created_by: internal_user_id,
    } as any);`;
  } else {
    createSignature = `create(dto: Create${entityName}Dto)`;
    createBody = `    return this.${entityVar}Model.create({ ...dto } as any);`;
  }
  
  const findOneWhere = hasSoftDelete ? `{
        id,
        deleted_at: { [Op.is]: null },
      }` : '{ id }';
  
  const updateWhere = hasSoftDelete ? `{
          id: dto.id,
          deleted_at: { [Op.is]: null },
        }` : '{ id: dto.id }';
  
  let updateSignature;
  if (hasCreatedBy) {
    updateSignature = `update(dto: Update${entityName}Dto, internal_user_id: number)`;
  } else {
    updateSignature = `update(dto: Update${entityName}Dto)`;
  }
  
  let removeMethod;
  if (hasSoftDelete) {
    removeMethod = `  async remove(internal_user_id: number, id: number): Promise<number> {
    const [affectedRows] = await this.${entityVar}Model.update(
      {
        deleted_at: new Date(),
        deleted_by: internal_user_id,
      } as any,
      {
        where: {
          id,
          deleted_at: { [Op.is]: null },
        },
      },
    );
    return affectedRows;
  }`;
  } else {
    removeMethod = `  async remove(id: number): Promise<number> {
    return this.${entityVar}Model.destroy({ where: { id } });
  }`;
  }
  
  let statusMethod = '';
  if (hasDisabled) {
    statusMethod = `
  async updateStatus(
    internal_user_id: number,
    dto: Update${entityName}StatusDto,
  ): Promise<[number, ${entityName}[]]> {
    return this.${entityVar}Model.update(
      {
        disabled_at: dto.enable ? null : new Date(),
        disabled_by: dto.enable ? null : internal_user_id,
      } as any,
      { where: { id: dto.id }, returning: true },
    );
  }`;
  }
  
  const statusImport = hasDisabled ? `import { Update${entityName}StatusDto } from './dto/update-${toKebabCase(entityName)}-status.dto';` : '';
  
  return `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ${entityName} } from '../entities/${toKebabCase(entityName)}.entity';
import { Create${entityName}Dto } from './dto/create-${toKebabCase(entityName)}.dto';
import { Update${entityName}Dto } from './dto/update-${toKebabCase(entityName)}.dto';
import { Get${entityName}sQueryDto } from './dto/get-${toKebabCase(entityName)}s-query.dto';
${statusImport}
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class ${pluralize(entityName)}Service {
  constructor(
    @InjectModel(${entityName}) private readonly ${entityVar}Model: typeof ${entityName},
    private readonly utilsService: UtilsService,
  ) {}

  async ${createSignature} {
${createBody}
  }

  async findAll(query: Get${entityName}sQueryDto) {
    const { ${hasSearch ? 'search_word, ' : ''}limit = 10, skip = 0 } = query;
    const where: any = {};
    ${searchBlock}${softDeleteWhere}
    const total = await this.${entityVar}Model.count({ where });
    const paginate = this.utilsService.paginate(limit, skip, total, false);
    const rows = await this.${entityVar}Model.findAll({
      where,
      limit: paginate.limit,
      offset: paginate.offset,
      order: [['id', 'DESC']],
    });
    
    return {
      count: total,
      list: rows.map((row) => row.toJSON()),
      skip: paginate.skip,
    };
  }

  async findOne(id: number) {
    const item = await this.${entityVar}Model.findOne({
      where: ${findOneWhere},
    });
    if (!item) throw new NotFoundException('${entityName} not found');
    return item;
  }

  async ${updateSignature} {
    const [affectedRows, [updated]] = await this.${entityVar}Model.update(
      { ...dto },
      {
        where: ${updateWhere},
        returning: true,
      },
    );
    if (!affectedRows) throw new NotFoundException('${entityName} not found');
    return updated;
  }

${removeMethod}
${statusMethod}
}
`;
}

// Generar controlador
function generateController(entityInfo) {
  const { entityName, hasSoftDelete, hasDisabled, hasCreatedBy } = entityInfo;
  const serviceName = `${pluralize(entityName)}Service`;
  const serviceVar = toCamelCase(pluralize(entityName)) + 'Service';
  const resourceName = toKebabCase(pluralize(entityName));
  
  let createParams, createCall;
  if (hasCreatedBy) {
    createParams = `@Body() dto: Create${entityName}Dto, @Req() req`;
    createCall = `this.${serviceVar}.create(dto, req.internal_user_id)`;
  } else {
    createParams = `@Body() dto: Create${entityName}Dto`;
    createCall = `this.${serviceVar}.create(dto)`;
  }
  
  let updateParams, updateCall;
  if (hasCreatedBy) {
    updateParams = `@Body() dto: Update${entityName}Dto, @Req() req`;
    updateCall = `this.${serviceVar}.update(dto, req.internal_user_id)`;
  } else {
    updateParams = `@Body() dto: Update${entityName}Dto`;
    updateCall = `this.${serviceVar}.update(dto)`;
  }
  
  const removeCall = hasSoftDelete ? `this.${serviceVar}.remove(req.internal_user_id, Number(id))` : `this.${serviceVar}.remove(Number(id))`;
  const removeParams = hasSoftDelete ? `@Param('id') id: string, @Req() req` : `@Param('id') id: string`;
  
  let statusEndpoint = '';
  if (hasDisabled) {
    statusEndpoint = `
  @ApiOperation({ summary: 'Cambiar estado' })
  @ApiBody({ type: Update${entityName}StatusDto })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @Put('status')
  async updateStatus(@Body() dto: Update${entityName}StatusDto, @Req() req) {
    return this.${serviceVar}.updateStatus(req.internal_user_id, dto);
  }`;
  }
  
  const statusImport = hasDisabled ? `import { Update${entityName}StatusDto } from './dto/update-${toKebabCase(entityName)}-status.dto';` : '';
  
  return `import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ${serviceName} } from './${resourceName}.service';
import { Create${entityName}Dto } from './dto/create-${toKebabCase(entityName)}.dto';
import { Update${entityName}Dto } from './dto/update-${toKebabCase(entityName)}.dto';
import { Get${entityName}sQueryDto } from './dto/get-${toKebabCase(entityName)}s-query.dto';
${statusImport}
import { VerifyTokenGuard } from 'src/auth/guards/verify-token.guard';
import { VerifyDisabledUserGuard } from 'src/auth/guards/verify-disabled-user.guard';
import { VerifyAdminAdminGuard } from 'src/auth/guards/verify-admin-admin.guard';

@ApiTags('${resourceName}')
@UseGuards(VerifyTokenGuard, VerifyDisabledUserGuard, VerifyAdminAdminGuard)
@Controller('${resourceName}')
export class ${pluralize(entityName)}Controller {
  constructor(private readonly ${serviceVar}: ${serviceName}) {}

  @ApiOperation({ summary: 'Crear registro' })
  @ApiBody({ type: Create${entityName}Dto })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  @Post()
  async create(${createParams}) {
    return ${createCall};
  }

  @ApiOperation({ summary: 'Listar registros' })
  @ApiResponse({ status: 200, description: 'Lista paginada' })
  @Get()
  async findAll(@Request() req, @Query() query: Get${entityName}sQueryDto) {
    return this.${serviceVar}.findAll(query);
  }

  @ApiOperation({ summary: 'Obtener por ID' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.${serviceVar}.findOne(Number(id));
  }

  @ApiOperation({ summary: 'Actualizar registro' })
  @ApiBody({ type: Update${entityName}Dto })
  @ApiResponse({ status: 200, description: 'Registro actualizado' })
  @Put()
  async update(${updateParams}) {
    return ${updateCall};
  }

  @ApiOperation({ summary: 'Eliminar registro${hasSoftDelete ? ' (soft delete)' : ''}' })
  @ApiResponse({ status: 200, description: 'Registro eliminado' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(${removeParams}) {
    return ${removeCall};
  }
${statusEndpoint}
}
`;
}

// Generar módulo
function generateModuleFile(entityInfo) {
  const { entityName } = entityInfo;
  const moduleName = `${pluralize(entityName)}Module`;
  const serviceName = `${pluralize(entityName)}Service`;
  const controllerName = `${pluralize(entityName)}Controller`;
  const resourceName = toKebabCase(pluralize(entityName));
  
  return `import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ${entityName} } from '../entities/${toKebabCase(entityName)}.entity';
import { ${serviceName} } from './${resourceName}.service';
import { ${controllerName} } from './${resourceName}.controller';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    SequelizeModule.forFeature([${entityName}, Admin]),
    AuthModule,
    JobsModule,
    UtilsModule,
  ],
  controllers: [${controllerName}],
  providers: [${serviceName}],
  exports: [${serviceName}],
})
export class ${moduleName} {}
`;
}

// Función principal
function main(entityFilePath) {
  console.log('🚀 Generando módulo NestJS...\n');
  
  // Validar archivo
  if (!fs.existsSync(entityFilePath)) {
    console.error('❌ Error: El archivo de entidad no existe:', entityFilePath);
    process.exit(1);
  }
  
  // Parsear entidad
  console.log('📖 Analizando entidad...');
  const entityInfo = parseEntityFile(entityFilePath);
  console.log(`   ✓ Entidad: ${entityInfo.entityName}`);
  console.log(`   ✓ Tabla: ${entityInfo.tableName}`);
  console.log(`   ✓ Campos: ${entityInfo.fields.length}`);
  console.log(`   ✓ Soft delete: ${entityInfo.hasSoftDelete ? 'Sí' : 'No'}`);
  console.log(`   ✓ Estado: ${entityInfo.hasDisabled ? 'Sí' : 'No'}`);
  
  // Crear estructura de carpetas
  const resourceName = toKebabCase(pluralize(entityInfo.entityName));
  const modulePath = path.join('src', resourceName);
  const dtoPath = path.join(modulePath, 'dto');
  
  console.log(`\n📁 Creando carpetas...`);
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
    console.log(`   ✓ ${modulePath}`);
  }
  if (!fs.existsSync(dtoPath)) {
    fs.mkdirSync(dtoPath, { recursive: true });
    console.log(`   ✓ ${dtoPath}`);
  }
  
  // Generar DTOs
  console.log(`\n📝 Generando DTOs...`);
  const files = [
    { name: `create-${toKebabCase(entityInfo.entityName)}.dto.ts`, content: generateCreateDto(entityInfo) },
    { name: `update-${toKebabCase(entityInfo.entityName)}.dto.ts`, content: generateUpdateDto(entityInfo) },
    { name: `get-${toKebabCase(entityInfo.entityName)}s-query.dto.ts`, content: generateQueryDto(entityInfo) },
  ];
  
  if (entityInfo.hasDisabled) {
    files.push({ name: `update-${toKebabCase(entityInfo.entityName)}-status.dto.ts`, content: generateStatusDto(entityInfo) });
  }
  
  files.forEach(file => {
    const filePath = path.join(dtoPath, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`   ✓ ${file.name}`);
  });
  
  // Generar archivos principales
  console.log(`\n📝 Generando archivos principales...`);
  const mainFiles = [
    { name: `${resourceName}.service.ts`, content: generateService(entityInfo) },
    { name: `${resourceName}.controller.ts`, content: generateController(entityInfo) },
    { name: `${resourceName}.module.ts`, content: generateModuleFile(entityInfo) },
  ];
  
  mainFiles.forEach(file => {
    const filePath = path.join(modulePath, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`   ✓ ${file.name}`);
  });
  
  console.log(`\n✅ Módulo generado exitosamente en: ${modulePath}`);
  console.log(`\n📋 Endpoints generados:`);
  console.log(`   • GET    /${resourceName}`);
  console.log(`   • GET    /${resourceName}/:id`);
  console.log(`   • POST   /${resourceName}`);
  console.log(`   • PUT    /${resourceName}`);
  console.log(`   • DELETE /${resourceName}/:id`);
  if (entityInfo.hasDisabled) {
    console.log(`   • PUT    /${resourceName}/status`);
  }
  
  console.log(`\n💡 No olvides:
   1. Importar ${pluralize(entityInfo.entityName)}Module en app.module.ts
   2. Verificar que los guards existan en src/guards/
   3. Verificar que UtilsModule exista en src/utils/
  `);
}

// Ejecutar
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
Uso: node scripts/generate-module.js <entity-file-path>

Ejemplos:
  node scripts/generate-module.js src/entities/return.entity.ts
  node scripts/generate-module.js src/entities/return-item.entity.ts
  `);
  process.exit(0);
}

main(args[0]);
