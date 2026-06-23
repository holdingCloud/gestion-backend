/*
  Warnings:

  - The values [EMPLEADOS] on the enum `Modulo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Modulo_new" AS ENUM ('DASHBOARD', 'USUARIOS', 'CLIENTES', 'RRHH', 'INVENTARIO', 'COMPRAS', 'PROVEEDORES', 'CUENTAS', 'HOJA_DE_VENTA', 'REPORTES', 'EMPRESAS');
ALTER TABLE "RolModulo" ALTER COLUMN "modulo" TYPE "Modulo_new" USING ("modulo"::text::"Modulo_new");
ALTER TYPE "Modulo" RENAME TO "Modulo_old";
ALTER TYPE "Modulo_new" RENAME TO "Modulo";
DROP TYPE "Modulo_old";
COMMIT;
