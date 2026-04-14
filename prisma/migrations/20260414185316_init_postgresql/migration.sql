-- CreateEnum
CREATE TYPE "typePosition" AS ENUM ('ADMINISTRADOR', 'REPARTIDOR', 'COMUN');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(200) NOT NULL,
    "email" VARCHAR(30) NOT NULL,
    "password" VARCHAR(150) NOT NULL,
    "imagen" VARCHAR(150) NOT NULL,
    "rolesId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isLoged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "type" "typePosition" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "img" VARCHAR(50) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(150) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "zone" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "rut" VARCHAR(20) NOT NULL,
    "fullname" VARCHAR(150) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "salary" INTEGER NOT NULL,
    "hireDate" VARCHAR(20) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "type" "typePosition" NOT NULL DEFAULT 'COMUN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bills" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillDetails" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "billsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salesSheets" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "billId" INTEGER NOT NULL,

    CONSTRAINT "salesSheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detailsSalesSheet" (
    "id" SERIAL NOT NULL,
    "clientsId" INTEGER NOT NULL,
    "productsId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "salesSheetId" INTEGER NOT NULL,

    CONSTRAINT "detailsSalesSheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_type_key" ON "Roles"("type");

-- CreateIndex
CREATE INDEX "Products_available_idx" ON "Products"("available");

-- CreateIndex
CREATE INDEX "Clients_available_idx" ON "Clients"("available");

-- CreateIndex
CREATE INDEX "Employees_available_idx" ON "Employees"("available");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillDetails" ADD CONSTRAINT "BillDetails_billsId_fkey" FOREIGN KEY ("billsId") REFERENCES "Bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salesSheets" ADD CONSTRAINT "salesSheets_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salesSheets" ADD CONSTRAINT "salesSheets_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailsSalesSheet" ADD CONSTRAINT "detailsSalesSheet_clientsId_fkey" FOREIGN KEY ("clientsId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailsSalesSheet" ADD CONSTRAINT "detailsSalesSheet_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detailsSalesSheet" ADD CONSTRAINT "detailsSalesSheet_salesSheetId_fkey" FOREIGN KEY ("salesSheetId") REFERENCES "salesSheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
