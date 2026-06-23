-- CreateEnum
CREATE TYPE "Modulo" AS ENUM ('CLIENTES', 'INVENTARIO', 'VENTAS', 'PROVEEDORES', 'COMPRAS', 'CUENTAS', 'RRHH', 'REPORTES');

-- CreateTable
CREATE TABLE "RolModulo" (
    "id" SERIAL NOT NULL,
    "rolId" INTEGER NOT NULL,
    "modulo" "Modulo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolModulo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RolModulo_rolId_idx" ON "RolModulo"("rolId");

-- CreateIndex
CREATE UNIQUE INDEX "RolModulo_rolId_modulo_key" ON "RolModulo"("rolId", "modulo");

-- AddForeignKey
ALTER TABLE "RolModulo" ADD CONSTRAINT "RolModulo_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed: ADMINISTRADOR → todos los módulos
INSERT INTO "RolModulo" ("rolId", "modulo")
SELECT r.id, m.modulo
FROM "Roles" r
CROSS JOIN (
  VALUES
    ('CLIENTES'::"Modulo"),
    ('INVENTARIO'::"Modulo"),
    ('VENTAS'::"Modulo"),
    ('PROVEEDORES'::"Modulo"),
    ('COMPRAS'::"Modulo"),
    ('CUENTAS'::"Modulo"),
    ('RRHH'::"Modulo"),
    ('REPORTES'::"Modulo")
) AS m(modulo)
WHERE r.type = 'ADMINISTRADOR';

-- Seed: REPARTIDOR → CLIENTES, VENTAS, INVENTARIO
INSERT INTO "RolModulo" ("rolId", "modulo")
SELECT r.id, m.modulo
FROM "Roles" r
CROSS JOIN (
  VALUES
    ('CLIENTES'::"Modulo"),
    ('VENTAS'::"Modulo"),
    ('INVENTARIO'::"Modulo")
) AS m(modulo)
WHERE r.type = 'REPARTIDOR';

-- Seed: COMUN → CLIENTES, VENTAS
INSERT INTO "RolModulo" ("rolId", "modulo")
SELECT r.id, m.modulo
FROM "Roles" r
CROSS JOIN (
  VALUES
    ('CLIENTES'::"Modulo"),
    ('VENTAS'::"Modulo")
) AS m(modulo)
WHERE r.type = 'COMUN';
