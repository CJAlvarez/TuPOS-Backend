# Configuración de Temas y White Label para Stores

Este documento describe cómo configurar temas personalizados y configuración de white label para stores en el sistema.

## Estructura de theme_config

El campo `theme_config` en la tabla `stores` puede contener:

### 1. Nombre de tema predefinido (string)
```json
"default"
```
```json
"blue"
```
```json
"green"
```
```json
"purple"
```
```json
"orange"
```

### 2. Configuración completa de tema y white label (object)
```json
{
  "name": "mi-tienda-custom",
  "displayName": "Tema Mi Tienda",
  "colors": {
    "primary": "#FF6B35",
    "secondary": "#F7931E",
    "success": "#2ECC71",
    "danger": "#E74C3C",
    "warning": "#F39C12",
    "info": "#3498DB",
    "light": "#F8F9FA",
    "dark": "#2C3E50",
    "medium": "#6C757D"
  },
  "whiteLabel": {
    "storeName": "Mi Tienda Online",
    "companyName": "Mi Empresa S.A.S",
    "favicon": "https://example.com/favicon.ico",
    "logo": {
      "light": "https://example.com/logo-light.png",
      "dark": "https://example.com/logo-dark.png",
      "url": "https://example.com/logo.png"
    },
    "meta": {
      "description": "La mejor tienda online para tus compras",
      "keywords": "tienda, online, compras, productos",
      "author": "Mi Empresa"
    },
    "contact": {
      "email": "contacto@mitienda.com",
      "phone": "+57 300 123 4567",
      "address": "Calle 123 #45-67, Bogotá, Colombia",
      "website": "https://www.mitienda.com"
    },
    "social": {
      "facebook": "https://facebook.com/mitienda",
      "instagram": "https://instagram.com/mitienda",
      "twitter": "https://twitter.com/mitienda"
    }
  },
  "customCss": ".custom-header { background: linear-gradient(45deg, #FF6B35, #F7931E); }"
}
```

## Ejemplos de SQL para configurar temas y white label

### Ejemplo 1: Tema predefinido simple
```sql
UPDATE stores 
SET theme_config = '"blue"'
WHERE id = 1;
```

### Ejemplo 2: Restaurante con tema y branding completo (Formato actualizado)
```sql
UPDATE stores 
SET theme_config = '{
  "name": "bethel",
  "displayName": "Bethel Theme",
  "colors": {
    "primary": "#006838",
    "secondary": "#88c250",
    "tertiary": "#5260ff",
    "success": "#74c284",
    "danger": "#c45259",
    "warning": "#c69c4d",
    "info": "#37cde6",
    "light": "#f4f5f8",
    "dark": "#222428",
    "medium": "#92949c",
    "white": "#ffffff",
    "light-light": "#a7b3bb",
    "border-light": "#b3b2b1"
  },
  "whiteLabel": {
    "storeName": "Bethel",
    "companyName": "Bethel",
    "background-image": "assets/themes/bethel/background.png",
    "background-color": "--bs-secondary",
    "favicon": "assets/themes/bethel/favicon.ico",
    "icon": "assets/themes/bethel/favicon.png",
    "logo": {
      "light": "assets/themes/bethel/Logotipo-Negro.png",
      "dark": "assets/themes/bethel/Logotipo-Blanco.png",
      "url": "assets/themes/bethel/logo-dark2.png"
    },
    "meta": {
      "description": "Bethel Admin es el sistema de gestión de inventario y ventas",
      "keywords": "bethel, farmacia",
      "author": "CJ Alvarez"
    }
  }
}'
WHERE id = 2;
```

### Ejemplo 3: Tienda de tecnología con tema azul corporativo
```sql
UPDATE stores 
SET theme_config = '{
  "name": "tech-blue",
  "displayName": "Tema Tecnología Azul",
  "colors": {
    "primary": "#1E3A8A",
    "secondary": "#3B82F6",
    "success": "#10B981",
    "danger": "#EF4444",
    "warning": "#F59E0B",
    "info": "#06B6D4",
    "light": "#F1F5F9",
    "dark": "#1E293B",
    "medium": "#64748B"
  },
  "whiteLabel": {
    "storeName": "TechStore Pro",
    "companyName": "TechStore Pro Ltda",
    "favicon": "https://cdn.techstorepro.com/favicon.ico",
    "logo": {
      "url": "https://cdn.techstorepro.com/logo.png"
    },
    "meta": {
      "description": "Los mejores productos tecnológicos al mejor precio",
      "keywords": "tecnología, celulares, computadores, gadgets",
      "author": "TechStore Pro"
    },
    "contact": {
      "email": "ventas@techstorepro.com",
      "phone": "+57 320 888 9999",
      "website": "https://techstorepro.com"
    }
  },
  "customCss": ".product-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.1); }"
}'
WHERE id = 3;
```

### Ejemplo 4: Tema simple solo con white label (sin colores personalizados)
```sql
UPDATE stores 
SET theme_config = '{
  "name": "default-branded",
  "displayName": "Tema Default con Branding",
  "whiteLabel": {
    "storeName": "Mi Negocio",
    "companyName": "Mi Negocio EIRL",
    "favicon": "https://cdn.minegocio.com/favicon.ico",
    "logo": {
      "url": "https://cdn.minegocio.com/logo.png"
    },
    "contact": {
      "email": "info@minegocio.com",
      "phone": "+57 315 444 5555"
    }
  }
}'
WHERE id = 4;
```

## Aplicación automática de temas y white label

Los temas y configuración de white label se aplican automáticamente cuando:

1. **Login del usuario**: Al hacer login, se obtiene el store asociado al admin del usuario y se carga su tema y configuración de white label
2. **Cambio de store**: Si el usuario cambia de store (funcionalidad futura), se actualizará el tema y white label
3. **Logout**: Al hacer logout, se limpia el tema del usuario y se regresa al tema por defecto sin white label personalizado

## Funcionalidades de White Label incluidas

### Configuración automática del navegador:
- **Título de la página**: Se establece desde `whiteLabel.storeName`
- **Favicon**: Se carga desde `whiteLabel.favicon`
- **Meta tags**: Descripción, palabras clave, autor desde `whiteLabel.meta`

### Información de contacto disponible:
- Email, teléfono, dirección, sitio web desde `whiteLabel.contact`
- Enlaces de redes sociales desde `whiteLabel.social`

### Logos y branding:
- Logo principal desde `whiteLabel.logo.url`
- Versiones para tema claro/oscuro desde `whiteLabel.logo.light/dark`

### CSS personalizado:
- Estilos adicionales desde `customCss` para personalización avanzada

## Variables CSS disponibles (Formato actualizado)

Los temas generan las siguientes variables CSS:

```css
:root {
  /* Colores principales */
  --theme-primary: #color;
  --theme-secondary: #color;
  --theme-tertiary: #color;
  --theme-success: #color;
  --theme-danger: #color;
  --theme-warning: #color;
  --theme-info: #color;
  --theme-light: #color;
  --theme-dark: #color;
  --theme-medium: #color;
  
  /* Colores adicionales */
  --theme-white: #color;
  --theme-light-light: #color;
  --theme-border-light: #color;
  
  /* Variables de fondo (white label) */
  --theme-background-image: url(path);
  --theme-background-color: #color;
}
```

## Acceso a la configuración en componentes

### Acceso a white label desde JavaScript
```typescript
// La configuración de white label se almacena globalmente
const whiteLabelConfig = (window as any).whiteLabelConfig;
if (whiteLabelConfig) {
  console.log('Nombre de la tienda:', whiteLabelConfig.storeName);
  console.log('Logo:', whiteLabelConfig.logo?.url);
  console.log('Email:', whiteLabelConfig.contact?.email);
}
```

### Desde el ThemeService
```typescript
constructor(private themeService: ThemeService) {}

ngOnInit() {
  const whiteLabel = this.themeService.getCurrentWhiteLabelConfig();
  if (whiteLabel) {
    console.log('Configuración de white label:', whiteLabel);
  }
}
```

### En plantillas HTML
```html
<!-- El título se aplica automáticamente al documento -->
<!-- Para mostrar información en la interfaz: -->
<div *ngIf="getWhiteLabelConfig()">
  <h1>{{ getWhiteLabelConfig()?.storeName }}</h1>
  <img [src]="getWhiteLabelConfig()?.logo?.url" alt="Logo">
  <p>{{ getWhiteLabelConfig()?.contact?.email }}</p>
</div>
```

## Migración de datos existentes

Para migrar stores existentes a usar temas:

```sql
-- Asignar tema por defecto a todos los stores sin configuración
UPDATE stores 
SET theme_config = '"default"'
WHERE theme_config IS NULL;

-- Asignar temas específicos por categoría de negocio
UPDATE stores 
SET theme_config = '"blue"'
WHERE business_type = 'technology';

UPDATE stores 
SET theme_config = '"green"'
WHERE business_type = 'health';

UPDATE stores 
SET theme_config = '"orange"'
WHERE business_type = 'food';
```