-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(200) NOT NULL,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(150) NOT NULL,
    `imagen` VARCHAR(150) NULL,
    `isActive` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Roles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `description` VARCHAR(50) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `img` VARCHAR(50) NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Products_available_idx`(`available`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(150) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `zone` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Clients_available_idx`(`available`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rut` VARCHAR(20) NOT NULL,
    `fullname` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `salary` INTEGER NOT NULL,
    `hireDate` VARCHAR(20) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `available` BOOLEAN NOT NULL DEFAULT true,
    `type` ENUM('ADMINISTRADOR', 'REPARTIDOR', 'COMUN') NOT NULL DEFAULT 'COMUN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Employees_available_idx`(`available`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `billsId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salesSheets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `billId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailsSalesSheet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientsId` INTEGER NOT NULL,
    `productsId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `discount` DOUBLE NOT NULL,
    `salesSheetId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Roles` ADD CONSTRAINT `Roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillDetails` ADD CONSTRAINT `BillDetails_billsId_fkey` FOREIGN KEY (`billsId`) REFERENCES `Bills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesSheets` ADD CONSTRAINT `salesSheets_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesSheets` ADD CONSTRAINT `salesSheets_billId_fkey` FOREIGN KEY (`billId`) REFERENCES `Bills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailsSalesSheet` ADD CONSTRAINT `detailsSalesSheet_clientsId_fkey` FOREIGN KEY (`clientsId`) REFERENCES `Clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailsSalesSheet` ADD CONSTRAINT `detailsSalesSheet_productsId_fkey` FOREIGN KEY (`productsId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailsSalesSheet` ADD CONSTRAINT `detailsSalesSheet_salesSheetId_fkey` FOREIGN KEY (`salesSheetId`) REFERENCES `salesSheets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
