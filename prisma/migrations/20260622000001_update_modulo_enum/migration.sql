-- Eliminar filas con valores que desaparecen sin equivalente
DELETE FROM "RolModulo" WHERE modulo = 'RRHH';

-- Crear nuevo tipo enum con los valores actualizados
CREATE TYPE "Modulo_new" AS ENUM (
  'DASHBOARD',
  'USUARIOS',
  'CLIENTES',
  'EMPLEADOS',
  'INVENTARIO',
  'COMPRAS',
  'PROVEEDORES',
  'CUENTAS',
  'HOJA_DE_VENTA',
  'REPORTES',
  'EMPRESAS'
);

-- Migrar la columna al nuevo enum (VENTAS → HOJA_DE_VENTA, resto igual)
ALTER TABLE "RolModulo"
  ALTER COLUMN modulo TYPE "Modulo_new"
  USING CASE modulo::text
    WHEN 'VENTAS' THEN 'HOJA_DE_VENTA'
    ELSE modulo::text
  END::"Modulo_new";

-- Reemplazar el enum antiguo
DROP TYPE "Modulo";
ALTER TYPE "Modulo_new" RENAME TO "Modulo";
