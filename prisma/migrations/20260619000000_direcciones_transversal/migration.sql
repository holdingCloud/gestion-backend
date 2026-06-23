-- CreateEnum
CREATE TYPE "TiposDireccion" AS ENUM ('PRINCIPAL', 'FACTURACION', 'DESPACHO', 'COMERCIAL', 'TRABAJO', 'SUCURSAL', 'BODEGA', 'OTRO');

-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT IF EXISTS "Clients_communeId_fkey";

-- CreateTable
CREATE TABLE "Direcciones" (
    "id" SERIAL NOT NULL,
    "tipo" "TiposDireccion" NOT NULL,
    "calle" VARCHAR(200) NOT NULL,
    "numero" VARCHAR(20),
    "departamento" VARCHAR(50),
    "referencia" VARCHAR(200),
    "communeId" INTEGER,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "clientId" INTEGER,
    "employeeId" INTEGER,
    "companyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Direcciones_pkey" PRIMARY KEY ("id")
);

-- Migrar direcciones de clientes existentes (tipo PRINCIPAL)
INSERT INTO "Direcciones" (tipo, calle, departamento, referencia, "communeId", principal, "clientId", "updatedAt")
SELECT
  'PRINCIPAL'::"TiposDireccion",
  address,
  n_depto_casa,
  referencia,
  "communeId",
  true,
  id,
  NOW()
FROM "Clients"
WHERE address IS NOT NULL AND address != '';

-- Migrar direcciones de empleados existentes (tipo TRABAJO, city guardado en referencia)
INSERT INTO "Direcciones" (tipo, calle, referencia, principal, "employeeId", "updatedAt")
SELECT
  'TRABAJO'::"TiposDireccion",
  address,
  city,
  true,
  id,
  NOW()
FROM "Employees"
WHERE address IS NOT NULL AND address != '';

-- AlterTable Clients: remover columnas de dirección
ALTER TABLE "Clients" DROP COLUMN "address",
DROP COLUMN "communeId",
DROP COLUMN "n_depto_casa",
DROP COLUMN "referencia";

-- AlterTable Employees: remover columnas de dirección
ALTER TABLE "Employees" DROP COLUMN "address",
DROP COLUMN "city";

-- CreateIndex
CREATE INDEX "Direcciones_communeId_idx" ON "Direcciones"("communeId");

-- CreateIndex
CREATE INDEX "Direcciones_tipo_idx" ON "Direcciones"("tipo");

-- AddForeignKey
ALTER TABLE "Direcciones" ADD CONSTRAINT "Direcciones_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direcciones" ADD CONSTRAINT "Direcciones_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direcciones" ADD CONSTRAINT "Direcciones_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direcciones" ADD CONSTRAINT "Direcciones_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
