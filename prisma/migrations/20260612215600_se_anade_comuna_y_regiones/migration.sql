/*
  Warnings:

  - The values [NO_DISPONIBLE,PAUSADO] on the enum `ContactStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `contactFrequencyDays` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `lastContactedAt` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `nextCallDate` on the `Clients` table. All the data in the column will be lost.
  - Added the required column `unitPrice` to the `buyByClient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDIENTE', 'FINALIZADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "FrequencyStatus" AS ENUM ('NUEVO', 'EN_PLAZO', 'POR_VENCER', 'VENCIDO');

-- AlterEnum
BEGIN;
CREATE TYPE "ContactStatus_new" AS ENUM ('LLAMAR', 'CONTACTADO', 'VENCIDO');
ALTER TABLE "Clients" ALTER COLUMN "contactStatus" DROP DEFAULT;
ALTER TABLE "Clients" ALTER COLUMN "contactStatus" TYPE "ContactStatus_new" USING ("contactStatus"::text::"ContactStatus_new");
ALTER TYPE "ContactStatus" RENAME TO "ContactStatus_old";
ALTER TYPE "ContactStatus_new" RENAME TO "ContactStatus";
DROP TYPE "ContactStatus_old";
ALTER TABLE "Clients" ALTER COLUMN "contactStatus" SET DEFAULT 'LLAMAR';
COMMIT;

-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "contactFrequencyDays",
DROP COLUMN "lastContactedAt",
DROP COLUMN "nextCallDate",
ADD COLUMN     "frequency" INTEGER;

-- AlterTable
ALTER TABLE "buyByClient" ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "purchaseStatus" "PurchaseStatus" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "ClientProductFrequency" (
    "id" SERIAL NOT NULL,
    "clientsId" INTEGER NOT NULL,
    "productsId" INTEGER NOT NULL,
    "purchaseCount" INTEGER NOT NULL DEFAULT 0,
    "avgDaysBetweenPurchases" INTEGER,
    "lastPurchaseDate" TIMESTAMP(3),
    "actualPurchaseDate" TIMESTAMP(3),
    "nextEstimatedDate" TIMESTAMP(3),
    "status" "FrequencyStatus" NOT NULL DEFAULT 'NUEVO',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProductFrequency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientProductFrequency_nextEstimatedDate_idx" ON "ClientProductFrequency"("nextEstimatedDate");

-- CreateIndex
CREATE INDEX "ClientProductFrequency_status_idx" ON "ClientProductFrequency"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProductFrequency_clientsId_productsId_key" ON "ClientProductFrequency"("clientsId", "productsId");

-- CreateIndex
CREATE INDEX "buyByClient_clientsId_productsId_idx" ON "buyByClient"("clientsId", "productsId");

-- CreateIndex
CREATE INDEX "buyByClient_clientsId_createdAt_idx" ON "buyByClient"("clientsId", "createdAt");

-- AddForeignKey
ALTER TABLE "ClientProductFrequency" ADD CONSTRAINT "ClientProductFrequency_clientsId_fkey" FOREIGN KEY ("clientsId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProductFrequency" ADD CONSTRAINT "ClientProductFrequency_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
