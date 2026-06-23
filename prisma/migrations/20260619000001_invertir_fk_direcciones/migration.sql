-- Paso 1: Agregar direccionId a las tablas entidad
ALTER TABLE "Clients"   ADD COLUMN "direccionId" INTEGER;
ALTER TABLE "Employees" ADD COLUMN "direccionId" INTEGER;
ALTER TABLE "Company"   ADD COLUMN "direccionId" INTEGER;

-- Paso 2: Poblar direccionId desde los registros Direcciones existentes
UPDATE "Clients" c
SET "direccionId" = d.id
FROM "Direcciones" d
WHERE d."clientId" = c.id AND d.principal = true;

UPDATE "Employees" e
SET "direccionId" = d.id
FROM "Direcciones" d
WHERE d."employeeId" = e.id AND d.principal = true;

-- Paso 3: Agregar restricción UNIQUE (relación 1:1)
ALTER TABLE "Clients"   ADD CONSTRAINT "Clients_direccionId_key"   UNIQUE ("direccionId");
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_direccionId_key" UNIQUE ("direccionId");
ALTER TABLE "Company"   ADD CONSTRAINT "Company_direccionId_key"   UNIQUE ("direccionId");

-- Paso 4: Agregar FK constraints apuntando a Direcciones
ALTER TABLE "Clients"   ADD CONSTRAINT "Clients_direccionId_fkey"
  FOREIGN KEY ("direccionId") REFERENCES "Direcciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Employees" ADD CONSTRAINT "Employees_direccionId_fkey"
  FOREIGN KEY ("direccionId") REFERENCES "Direcciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Company"   ADD CONSTRAINT "Company_direccionId_fkey"
  FOREIGN KEY ("direccionId") REFERENCES "Direcciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Paso 5: Eliminar FK constraints del lado de Direcciones
ALTER TABLE "Direcciones" DROP CONSTRAINT IF EXISTS "Direcciones_clientId_fkey";
ALTER TABLE "Direcciones" DROP CONSTRAINT IF EXISTS "Direcciones_employeeId_fkey";
ALTER TABLE "Direcciones" DROP CONSTRAINT IF EXISTS "Direcciones_companyId_fkey";

-- Paso 6: Eliminar columnas antiguas de Direcciones
ALTER TABLE "Direcciones" DROP COLUMN IF EXISTS "principal";
ALTER TABLE "Direcciones" DROP COLUMN IF EXISTS "clientId";
ALTER TABLE "Direcciones" DROP COLUMN IF EXISTS "employeeId";
ALTER TABLE "Direcciones" DROP COLUMN IF EXISTS "companyId";
