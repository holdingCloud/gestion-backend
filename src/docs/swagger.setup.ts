import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Gestion Backend API')
    .setDescription(
      'API REST para el sistema de gestión de clientes, ventas y empleados',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT-auth',
    )
    .addTag('Auth', 'Autenticación y tokens JWT')
    .addTag('Users', 'Gestión de usuarios del sistema')
    .addTag('Clients', 'Gestión de clientes y compras')
    .addTag('Employee', 'Gestión de empleados')
    .addTag('Product', 'Catálogo de productos')
    .addTag('Bill', 'Gestión de facturas')
    .addTag('Bill Details', 'Detalles de líneas de factura')
    .addTag('Sales Sheet', 'Hojas de venta diarias')
    .addTag('Details Sales Sheet', 'Ítems de hojas de venta')
    .addTag('Health', 'Estado del servicio')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
