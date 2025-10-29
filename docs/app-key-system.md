# Sistema de Llave de Aplicación

Este sistema implementa una llave de aplicación para validar requests entre el Frontend y Backend, devolviendo un error 404 para requests no autorizados.

## 🔧 Configuración

### Backend (NestJS)

1. **Variable de entorno**: Configura `APP_KEY` en tu archivo `.env`:
   ```env
   APP_KEY=tu-llave-super-segura-aqui
   ```

2. **El guard está aplicado globalmente**, por lo que todas las rutas están protegidas automáticamente.

### Frontend

**Incluye el header `x-app-key` en todas las requests:**

```typescript
// Ejemplo con fetch
fetch('/api/endpoint', {
  headers: {
    'Content-Type': 'application/json',
    'x-app-key': 'tu-llave-super-segura-aqui'
  }
});

// Ejemplo con Axios
axios.defaults.headers.common['x-app-key'] = 'tu-llave-super-segura-aqui';

// O por request individual
axios.get('/api/endpoint', {
  headers: {
    'x-app-key': 'tu-llave-super-segura-aqui'
  }
});
```

## 🛡️ Comportamiento de Seguridad

- **✅ Con llave válida**: La request procede normalmente
- **❌ Sin llave o llave inválida**: Se devuelve `404 Not Found` (no `401` o `403` para ocultar la existencia del endpoint)
- **⚠️ Sin variable configurada**: Si `APP_KEY` no está configurada, el sistema permite acceso (útil para desarrollo)

## 📖 Documentación Swagger

El sistema está documentado en Swagger:
- Aparece como "app-key" en la sección de seguridad
- Permite probar los endpoints directamente desde la documentación

Para usar en Swagger:
1. Ve a la sección de seguridad
2. Haz clic en "app-key"
3. Ingresa tu llave de aplicación
4. Todas las requests incluirán automáticamente el header

## 🚀 Ejemplo de Uso en Controladores

Si quieres documentar específicamente que un endpoint requiere la llave:

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppKeySecurity } from '../guards/app-key-security.decorator';

@Controller('example')
@AppKeySecurity() // Documenta que este controlador requiere app-key
export class ExampleController {
  
  @Get()
  @AppKeySecurity() // O aplícalo a métodos específicos
  getExample() {
    return { message: 'Success' };
  }
}
```

## ⚙️ Archivos Modificados

- `src/guards/app-key.guard.ts` - Guard principal
- `src/guards/app-key-security.decorator.ts` - Decorador para Swagger
- `src/app.module.ts` - Configuración global del guard
- `src/main.ts` - Configuración de Swagger y CORS
- `.env.example` - Ejemplo de configuración

## 🔐 Generación de Llave Segura

Para generar una llave segura, puedes usar:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# Online (usar con precaución)
# Usar un generador de contraseñas online con al menos 32 caracteres
```

## 🧪 Testing

Para testing, puedes:

1. **Desactivar temporalmente**: No configurar `APP_KEY` en el entorno de test
2. **Usar llave de test**: Configurar una llave específica para testing
3. **Mock del guard**: Hacer mock del `AppKeyGuard` en tests unitarios

```typescript
// Ejemplo de mock en tests
const mockAppKeyGuard = {
  canActivate: jest.fn(() => true),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    // ...
  })
  .overrideGuard(AppKeyGuard)
  .useValue(mockAppKeyGuard)
  .compile();
});
```