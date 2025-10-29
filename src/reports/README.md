# Módulo de Reportería

Este módulo proporciona un sistema completo de reportes para el backend de TuPOS Admin, implementado siguiendo las mejores prácticas de NestJS.

## Características

### Tipos de Reportes

1. **Reportes Preprocesados**: Se ejecutan según una frecuencia configurada y almacenan resultados en caché
2. **Reportes de Cálculo Inmediato**: Se ejecutan en tiempo real cada vez que se solicitan

### Reportes Disponibles

#### Reportes Financieros
- **Tendencia Mensual** (`/reports/monthly-trend`) - Preprocesado (24h)
- **Tendencia Anual** (`/reports/yearly-trend`) - Preprocesado (24h)
- **Ingresos del Día** (`/reports/daily-income`) - Inmediato
- **Egresos del Día** (`/reports/daily-expenses`) - Inmediato

#### Reportes de Clientes
- **Clientes Destacados** (`/reports/top-clients`) - Preprocesado (24h)
- **Cantidad de Clientes** (`/reports/client-count`) - Inmediato
- **Cantidad de Wallets** (`/reports/wallet-count`) - Inmediato
- **Cantidad de Préstamos** (`/reports/loan-count`) - Inmediato

#### Reportes de Transacciones
- **Intereses del Mes** (`/reports/monthly-interests`) - Preprocesado (30 días)
- **Últimas Transacciones** (`/reports/latest-transactions`) - Inmediato
- **Top Transacciones** (`/reports/top-transactions`) - Inmediato

#### Reportes de Facturas
- **Últimas Facturas** (`/reports/latest-invoices`) - Inmediato

## Instalación

### 1. Crear la tabla de reportes

Ejecutar el script SQL ubicado en `scripts/database/001_create_reports_table.sql`:

\`\`\`bash
mysql -u usuario -p database_name < scripts/database/001_create_reports_table.sql
\`\`\`

### 2. Inicializar reportes (Opcional)

Si prefieres inicializar via código TypeScript:

\`\`\`bash
npm run ts-node scripts/initialize-reports.ts
\`\`\`

## Uso

### Ejemplo de llamada a un reporte

\`\`\`typescript
// GET /reports/monthly-trend?startDate=2024-01-01&endDate=2024-12-31
{
  "reportCode": "MONTHLY_TREND",
  "reportName": "Tendencia Mensual",
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "reportType": "PREPROCESSED",
  "data": {
    "months": [
      {
        "month": "2024-01",
        "income": 15000.50,
        "expenses": 8000.25,
        "balance": 7000.25
      }
    ]
  }
}
\`\`\`

### Parámetros de consulta

Todos los reportes aceptan parámetros opcionales de fecha:
- `startDate`: Fecha de inicio (formato YYYY-MM-DD)
- `endDate`: Fecha de fin (formato YYYY-MM-DD)

## Arquitectura

### Entidades
- `Report`: Configuración y caché de reportes

### DTOs
- Separados por categoría (financial, client, transaction, invoice)
- Request y Response DTOs para cada reporte
- Validación con class-validator

### Servicios
- `ReportsService`: Lógica principal de generación de reportes
- `ReportsInitializerService`: Inicialización de reportes en base de datos

### Controlador
- Endpoints REST documentados con Swagger
- Validación automática de parámetros
- Guards de autenticación y autorización

## Seguridad

Todos los endpoints requieren:
- Token de autenticación válido (`VerifyTokenGuard`)
- Usuario no deshabilitado (`VerifyDisabledUserGuard`)
- Permisos de administrador (`VerifyAdminAdminGuard`)

## Cache y Performance

### Reportes Preprocesados
- Se ejecutan solo cuando ha pasado el tiempo de frecuencia configurado
- Resultados almacenados en la tabla `reports.last_results`
- Mejora significativamente el rendimiento para reportes complejos

### Reportes Inmediatos
- Se ejecutan en tiempo real
- Optimizados con consultas SQL eficientes
- Limitación de resultados para evitar sobrecarga

## Desarrollo

### Agregar un nuevo reporte

1. **Definir el enum**:
\`\`\`typescript
// En reports/enums/report.enum.ts
export enum ReportCode {
  // ... códigos existentes
  NEW_REPORT = 'NEW_REPORT',
}
\`\`\`

2. **Crear DTOs**:
\`\`\`typescript
// En reports/dto/new-reports.dto.ts
export class NewReportRequestDto extends BaseReportRequestDto {}
export class NewReportResponseDto extends BaseReportResponseDto {
  declare data: {
    // definir estructura específica
  };
}
\`\`\`

3. **Implementar en el servicio**:
\`\`\`typescript
// En reports/reports.service.ts
async getNewReport(dto: NewReportRequestDto): Promise<NewReportResponseDto> {
  // implementar lógica
}
\`\`\`

4. **Agregar endpoint en el controlador**:
\`\`\`typescript
// En reports/reports.controller.ts
@Get('new-report')
async getNewReport(@Query() dto: NewReportRequestDto) {
  return await this.reportsService.getNewReport(dto);
}
\`\`\`

5. **Agregar a la inicialización**:
\`\`\`typescript
// En reports/reports-initializer.service.ts
{
  name: 'Nuevo Reporte',
  code: ReportCode.NEW_REPORT,
  type: ReportType.IMMEDIATE, // o PREPROCESSED
  // ... configuración
}
\`\`\`

## Testing

### Ejemplo de test unitario

\`\`\`typescript
describe('ReportsService', () => {
  it('should generate daily income report', async () => {
    const result = await service.getDailyIncome({});
    expect(result.reportCode).toBe('DAILY_INCOME');
    expect(result.data.totalIncome).toBeGreaterThanOrEqual(0);
  });
});
\`\`\`

## Monitoreo

- Logs automáticos de ejecución de reportes
- Tiempo de respuesta medido
- Cache hits/misses para reportes preprocesados
- Errores capturados y reportados

## Troubleshooting

### Problemas comunes

1. **Reporte preprocesado no se actualiza**
   - Verificar que `frequency_hours` esté configurado correctamente
   - Comprobar `last_execution` en la tabla `reports`

2. **Errores de permisos**
   - Verificar que el usuario tenga permisos de administrador
   - Revisar configuración de guards

3. **Performance lenta**
   - Considerar índices en tablas relacionadas
   - Revisar consultas SQL generadas
   - Evaluar convertir reporte inmediato a preprocesado

### Logs útiles

\`\`\`bash
# Ver logs de reportes
tail -f logs/app.log | grep "ReportsService"

# Ver tiempo de ejecución
tail -f logs/app.log | grep "Report execution time"
\`\`\`