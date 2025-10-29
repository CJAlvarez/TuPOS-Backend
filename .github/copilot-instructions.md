# copilot-instructions.txt

Este proyecto será migrado a NestJS. El objetivo es aprovechar la arquitectura modular, inyección de dependencias, adaptadores, middlewares, guards, interceptors y otras características que ofrece NestJS. La interacción con la base de datos debe realizarse usando Sequelize a través del módulo oficial de NestJS.

## Instrucciones para GitHub Copilot

- Todo el código debe estar en TypeScript y seguir las convenciones de NestJS.
- Utiliza módulos (`@Module`), controladores (`@Controller`), servicios (`@Injectable`), y entidades (`@Entity`) para organizar la lógica.
- Implementa adaptadores para integración con servicios externos o recursos compartidos.
- Usa el módulo de Sequelize de NestJS para la interacción con la base de datos, evitando raw queries.
- Implementa DTOs y validaciones usando `class-validator` y `class-transformer`.
- Utiliza guards para autenticación y autorización.
- Implementa middlewares e interceptors donde sea necesario (por ejemplo, logging, manejo de errores, transformación de respuestas).
- Configura variables de entorno usando el módulo `@nestjs/config`.
- Mantén la modularidad y separación de responsabilidades.
- No incluir datos sensibles ni credenciales en el código fuente.
- Los archivos estáticos y plantillas deben estar en una carpeta pública o designada para tal fin.
- Los logs de errores deben gestionarse usando el sistema de logging de NestJS.
- Documenta los endpoints usando Swagger (`@nestjs/swagger`).
