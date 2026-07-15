/*
  Warnings:

  - Changed the type of `hireDate` on the `Employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'CONVIVIENTE_CIVIL');

-- CreateEnum
CREATE TYPE "Parentesco" AS ENUM ('CONYUGE', 'HIJO', 'PADRE', 'MADRE', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoCuentaBancaria" AS ENUM ('CUENTA_CORRIENTE', 'CUENTA_VISTA', 'CUENTA_AHORRO');

-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('INDEFINIDO', 'PLAZO_FIJO', 'OBRA_O_FAENA');

-- CreateEnum
CREATE TYPE "TipoGratificacion" AS ENUM ('ART_47', 'ART_50');

-- CreateEnum
CREATE TYPE "ContratoEstado" AS ENUM ('ACTIVO', 'TERMINADO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "TipoItemLiquidacionEnum" AS ENUM ('HABER', 'DESCUENTO');

-- CreateEnum
CREATE TYPE "LiquidacionEstado" AS ENUM ('BORRADOR', 'EMITIDA', 'PAGADA');

-- CreateEnum
CREATE TYPE "TipoVacaciones" AS ENUM ('LEGAL', 'PROGRESIVA', 'ADICIONAL');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "TipoLicencia" AS ENUM ('ENFERMEDAD', 'MATERNIDAD', 'PATERNIDAD', 'ACCIDENTE_LABORAL', 'OTRO');

-- CreateEnum
CREATE TYPE "EntidadLicencia" AS ENUM ('COMPIN', 'ISAPRE');

-- CreateEnum
CREATE TYPE "TipoPermiso" AS ENUM ('ADMINISTRATIVO', 'SINDICAL', 'OTRO');

-- CreateEnum
CREATE TYPE "CausalFiniquito" AS ENUM ('ART_159_1', 'ART_159_2', 'ART_159_4', 'ART_160', 'ART_161');

-- CreateEnum
CREATE TYPE "FiniquitoEstado" AS ENUM ('BORRADOR', 'FIRMADO', 'PAGADO');

-- CreateEnum
CREATE TYPE "TipoDocEmpleado" AS ENUM ('CONTRATO', 'CEDULA_IDENTIDAD', 'CERTIFICADO_ESTUDIOS', 'CERTIFICADO_AFP', 'ANEXO', 'FINIQUITO', 'OTRO');

-- AlterTable
ALTER TABLE "Employees" ADD COLUMN     "afpId" INTEGER,
ADD COLUMN     "cargoId" INTEGER,
ADD COLUMN     "departamentoId" INTEGER,
ADD COLUMN     "estadoCivil" "EstadoCivil",
ADD COLUMN     "fechaNacimiento" DATE,
ADD COLUMN     "jefeId" INTEGER,
ADD COLUMN     "mutualId" INTEGER,
ADD COLUMN     "sistemasSaludId" INTEGER,
DROP COLUMN "hireDate",
ADD COLUMN     "hireDate" DATE NOT NULL;

-- CreateTable
CREATE TABLE "Departamentos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cargos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AFP" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tasaCotizacion" DECIMAL(5,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AFP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SistemasSalud" (
    "id" SERIAL NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SistemasSalud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mutuales" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mutuales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiposItemLiquidacion" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" "TipoItemLiquidacionEnum" NOT NULL,
    "esLegal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TiposItemLiquidacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CargasFamiliares" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "rut" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "parentesco" "Parentesco" NOT NULL,
    "fechaNacimiento" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CargasFamiliares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuentasBancariasEmpleado" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "banco" VARCHAR(100) NOT NULL,
    "tipoCuenta" "TipoCuentaBancaria" NOT NULL,
    "numeroCuenta" VARCHAR(30) NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CuentasBancariasEmpleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contratos" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "tipoContrato" "TipoContrato" NOT NULL,
    "sueldoBase" DECIMAL(10,2) NOT NULL,
    "gratificacion" "TipoGratificacion" NOT NULL,
    "jornada" INTEGER NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaTermino" DATE,
    "estado" "ContratoEstado" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnexosContrato" (
    "id" SERIAL NOT NULL,
    "contratoId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaVigencia" DATE NOT NULL,
    "urlDocumento" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnexosContrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liquidaciones" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "periodo" DATE NOT NULL,
    "sueldoBase" DECIMAL(10,2) NOT NULL,
    "totalHaberes" DECIMAL(12,2) NOT NULL,
    "totalDescuentos" DECIMAL(12,2) NOT NULL,
    "liquidoAPagar" DECIMAL(12,2) NOT NULL,
    "estado" "LiquidacionEstado" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Liquidaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemsLiquidacion" (
    "id" SERIAL NOT NULL,
    "liquidacionId" INTEGER NOT NULL,
    "tipoItemId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemsLiquidacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibroRemuneraciones" (
    "id" SERIAL NOT NULL,
    "periodo" DATE NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "liquidacionId" INTEGER NOT NULL,
    "totalImponible" DECIMAL(12,2) NOT NULL,
    "liquido" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibroRemuneraciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anticipos" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha" DATE NOT NULL,
    "descontado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anticipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudesVacaciones" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "tipo" "TipoVacaciones" NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "diasHabiles" INTEGER NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudesVacaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenciasMedicas" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "tipo" "TipoLicencia" NOT NULL,
    "entidad" "EntidadLicencia" NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "dias" INTEGER NOT NULL,
    "urlDocumento" VARCHAR(300),
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LicenciasMedicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permisos" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "tipo" "TipoPermiso" NOT NULL,
    "conGoce" BOOLEAN NOT NULL DEFAULT true,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "motivo" TEXT,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finiquitos" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "causal" "CausalFiniquito" NOT NULL,
    "fechaTermino" DATE NOT NULL,
    "feriadoProporcional" DECIMAL(10,2) NOT NULL,
    "indemnizacion" DECIMAL(10,2) NOT NULL,
    "totalFiniquito" DECIMAL(12,2) NOT NULL,
    "estado" "FiniquitoEstado" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finiquitos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentosEmpleado" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "tipo" "TipoDocEmpleado" NOT NULL,
    "url" VARCHAR(300) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentosEmpleado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cargos_departamentoId_idx" ON "Cargos"("departamentoId");

-- CreateIndex
CREATE INDEX "CargasFamiliares_employeeId_idx" ON "CargasFamiliares"("employeeId");

-- CreateIndex
CREATE INDEX "CuentasBancariasEmpleado_employeeId_idx" ON "CuentasBancariasEmpleado"("employeeId");

-- CreateIndex
CREATE INDEX "Contratos_employeeId_idx" ON "Contratos"("employeeId");

-- CreateIndex
CREATE INDEX "Contratos_estado_idx" ON "Contratos"("estado");

-- CreateIndex
CREATE INDEX "AnexosContrato_contratoId_idx" ON "AnexosContrato"("contratoId");

-- CreateIndex
CREATE INDEX "Liquidaciones_periodo_idx" ON "Liquidaciones"("periodo");

-- CreateIndex
CREATE INDEX "Liquidaciones_estado_idx" ON "Liquidaciones"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Liquidaciones_employeeId_periodo_key" ON "Liquidaciones"("employeeId", "periodo");

-- CreateIndex
CREATE INDEX "ItemsLiquidacion_liquidacionId_idx" ON "ItemsLiquidacion"("liquidacionId");

-- CreateIndex
CREATE INDEX "LibroRemuneraciones_periodo_idx" ON "LibroRemuneraciones"("periodo");

-- CreateIndex
CREATE UNIQUE INDEX "LibroRemuneraciones_employeeId_periodo_key" ON "LibroRemuneraciones"("employeeId", "periodo");

-- CreateIndex
CREATE INDEX "Anticipos_employeeId_idx" ON "Anticipos"("employeeId");

-- CreateIndex
CREATE INDEX "Anticipos_descontado_idx" ON "Anticipos"("descontado");

-- CreateIndex
CREATE INDEX "SolicitudesVacaciones_employeeId_idx" ON "SolicitudesVacaciones"("employeeId");

-- CreateIndex
CREATE INDEX "SolicitudesVacaciones_estado_idx" ON "SolicitudesVacaciones"("estado");

-- CreateIndex
CREATE INDEX "LicenciasMedicas_employeeId_idx" ON "LicenciasMedicas"("employeeId");

-- CreateIndex
CREATE INDEX "LicenciasMedicas_estado_idx" ON "LicenciasMedicas"("estado");

-- CreateIndex
CREATE INDEX "Permisos_employeeId_idx" ON "Permisos"("employeeId");

-- CreateIndex
CREATE INDEX "Finiquitos_employeeId_idx" ON "Finiquitos"("employeeId");

-- CreateIndex
CREATE INDEX "DocumentosEmpleado_employeeId_idx" ON "DocumentosEmpleado"("employeeId");

-- CreateIndex
CREATE INDEX "ClientProductFrequency_actualPurchaseDate_idx" ON "ClientProductFrequency"("actualPurchaseDate");

-- CreateIndex
CREATE INDEX "ClientProductFrequency_clientsId_status_idx" ON "ClientProductFrequency"("clientsId", "status");

-- CreateIndex
CREATE INDEX "Clients_createdAt_idx" ON "Clients"("createdAt");

-- CreateIndex
CREATE INDEX "Employees_cargoId_idx" ON "Employees"("cargoId");

-- CreateIndex
CREATE INDEX "Employees_departamentoId_idx" ON "Employees"("departamentoId");

-- CreateIndex
CREATE INDEX "buyByClient_purchaseDate_idx" ON "buyByClient"("purchaseDate");

-- AddForeignKey
ALTER TABLE "Cargos" ADD CONSTRAINT "Cargos_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_afpId_fkey" FOREIGN KEY ("afpId") REFERENCES "AFP"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_sistemasSaludId_fkey" FOREIGN KEY ("sistemasSaludId") REFERENCES "SistemasSalud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_mutualId_fkey" FOREIGN KEY ("mutualId") REFERENCES "Mutuales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_jefeId_fkey" FOREIGN KEY ("jefeId") REFERENCES "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargasFamiliares" ADD CONSTRAINT "CargasFamiliares_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentasBancariasEmpleado" ADD CONSTRAINT "CuentasBancariasEmpleado_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contratos" ADD CONSTRAINT "Contratos_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnexosContrato" ADD CONSTRAINT "AnexosContrato_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liquidaciones" ADD CONSTRAINT "Liquidaciones_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsLiquidacion" ADD CONSTRAINT "ItemsLiquidacion_liquidacionId_fkey" FOREIGN KEY ("liquidacionId") REFERENCES "Liquidaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsLiquidacion" ADD CONSTRAINT "ItemsLiquidacion_tipoItemId_fkey" FOREIGN KEY ("tipoItemId") REFERENCES "TiposItemLiquidacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibroRemuneraciones" ADD CONSTRAINT "LibroRemuneraciones_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibroRemuneraciones" ADD CONSTRAINT "LibroRemuneraciones_liquidacionId_fkey" FOREIGN KEY ("liquidacionId") REFERENCES "Liquidaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anticipos" ADD CONSTRAINT "Anticipos_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudesVacaciones" ADD CONSTRAINT "SolicitudesVacaciones_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenciasMedicas" ADD CONSTRAINT "LicenciasMedicas_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "Permisos_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finiquitos" ADD CONSTRAINT "Finiquitos_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentosEmpleado" ADD CONSTRAINT "DocumentosEmpleado_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
