-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('LLAMAR', 'CONTACTADO', 'NO_DISPONIBLE', 'PAUSADO');

-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "contactFrequencyDays" INTEGER,
ADD COLUMN     "contactStatus" "ContactStatus" NOT NULL DEFAULT 'LLAMAR',
ADD COLUMN     "lastContactedAt" TIMESTAMP(3),
ADD COLUMN     "nextCallDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "buyByClient" (
    "id" SERIAL NOT NULL,
    "clientsId" INTEGER NOT NULL,
    "productsId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyByClient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "buyByClient" ADD CONSTRAINT "buyByClient_clientsId_fkey" FOREIGN KEY ("clientsId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyByClient" ADD CONSTRAINT "buyByClient_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
