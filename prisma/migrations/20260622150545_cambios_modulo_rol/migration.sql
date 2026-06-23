/*
  Warnings:

  - The values [REPARTIDOR,COMUN] on the enum `typePosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typePosition_new" AS ENUM ('SUPER_ADMIN', 'ADMINISTRADOR');
ALTER TABLE "Employees" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Employees" ALTER COLUMN "type" TYPE "typePosition_new" USING ("type"::text::"typePosition_new");
ALTER TYPE "typePosition" RENAME TO "typePosition_old";
ALTER TYPE "typePosition_new" RENAME TO "typePosition";
DROP TYPE "typePosition_old";
ALTER TABLE "Employees" ALTER COLUMN "type" SET DEFAULT 'ADMINISTRADOR';
COMMIT;

-- AlterTable
ALTER TABLE "Employees" ALTER COLUMN "type" SET DEFAULT 'ADMINISTRADOR';
