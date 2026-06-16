-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AlterTable: nullable column so existing clients are not affected
ALTER TABLE "Clients" ADD COLUMN "companyId" INTEGER;

-- CreateIndex
CREATE INDEX "Clients_companyId_idx" ON "Clients"("companyId");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_companyId_fkey"
    FOREIGN KEY ("companyId") REFERENCES "Company"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
