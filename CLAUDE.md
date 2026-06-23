# Sistema de Gestión — gestion-backend

## Stack

- **Runtime**: Node.js + TypeScript
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Schema**: `prisma/schema.prisma`

## Comandos frecuentes

```bash
npx prisma migrate dev      # Aplicar migraciones en desarrollo
npx prisma migrate deploy   # Aplicar migraciones en producción
npx prisma generate         # Regenerar Prisma Client
npx prisma studio           # UI para explorar la BD
```

## Contexto del negocio

Sistema de gestión para **empresa chilena**. Toda la lógica de negocio debe considerar la normativa local:

- **RUT**: formato `XX.XXX.XXX-X` (personas y empresas)
- **SII**: organismo tributario. Los documentos tributarios son DTE (Documento Tributario Electrónico). Tipos relevantes: Factura Electrónica (33), Factura Exenta (34), Nota Crédito (61), Nota Débito (56)
- **IVA**: 19% (campo `CondicionIVA`: AFECTO / EXENTO)
- **AFP**: cotización previsional obligatoria (~10% + comisión). Instituciones: Habitat, PlanVital, ProVida, Capital, Cuprum, Modelo, Uno
- **Salud**: FONASA o ISAPRE (7% del sueldo imponible)
- **Mutual**: seguro de accidentes laborales — ACHS, IST, Mutual de Seguridad
- **AFC** (Seguro de Cesantía): descuento obligatorio para contratos indefinidos
- **Gratificación**: Art. 50 CT (25% mensual, tope 4.75 IMM) o Art. 47 CT (30% utilidades anuales)
- **Jornada laboral**: máx. 40h semanales según Ley 21.561
- **Vacaciones**: 15 días hábiles (Art. 67 CT) + días progresivos (Art. 68)
- **Licencias médicas**: tramitadas ante COMPIN o ISAPRE
- **Finiquito**: causales Art. 159 / 160 / 161 del Código del Trabajo
- **Previred**: plataforma de pago de cotizaciones previsionales
- **Dirección del Trabajo (DT)**: organismo fiscalizador laboral
- **Guía de Despacho**: documento de tránsito de mercadería previo a la factura

## Módulos del schema

| Módulo | Modelos principales |
|---|---|
| Auth | `Users`, `Roles` |
| Geografía | `Region`, `Commune` |
| Clientes | `Company`, `Clients`, `buyByClient`, `ClientProductFrequency` |
| Inventario | `Categorias`, `Bodegas`, `Products`, `TiposMovimiento`, `MovimientosInventario` |
| Ventas | `salesSheets`, `detailsSalesSheet` |
| Proveedores | `Proveedores`, `ContactosProveedor`, `ProductosProveedor`, `NotasProveedor`, `PagosProveedor` |
| Compras | `OrdenesCompra`, `ItemsOrdenCompra`, `RecepcionesMercaderia`, `ItemsRecepcion`, `FacturasCompra` |
| Cuentas | `TiposCuenta`, `CuentasGasto`, `PagosCuenta` |
| RRHH | `Employees`, `Departamentos`, `Cargos`, `AFP`, `SistemasSalud`, `Mutuales`, `CargasFamiliares`, `Contratos`, `AnexosContrato`, `Liquidaciones`, `TiposItemLiquidacion`, `ItemsLiquidacion`, `Anticipos`, `SolicitudesVacaciones`, `LicenciasMedicas`, `Permisos`, `Finiquitos`, `DocumentosEmpleado`, `LibroRemuneraciones`, `CuentasBancariasEmpleado` |

## Convenciones del schema

- PKs siempre `@id @default(autoincrement())`
- Montos en `Decimal` (`@db.Decimal(10,2)` o `@db.Decimal(12,2)` para totales)
- Fechas de solo fecha: `@db.Date`; con hora: `DateTime`
- RUT: `@db.VarChar(20)` con `@unique` en entidades principales
- Emails: `@db.VarChar(100)`
- Textos largos (descripciones): `@db.Text`
- URLs de archivos: `@db.VarChar(300)`
- Relaciones múltiples al mismo modelo usan nombres explícitos (ej: `"OCCreador"`, `"OCAprobador"`)
- Flujo de compras: OC → Guía de Despacho (`RecepcionesMercaderia`) → DTE (`FacturasCompra`)
- Valorización de inventario: Precio Promedio Ponderado (`precioPromedio`) — método aceptado por SII

## Direcciones

Los modelos `Employees`, `Clients` y `Proveedores` tienen campos inline de dirección (`direccion`, `communeId`) relacionados con `Commune → Region`.
