/*
  Warnings:

  - Added the required column `rolesId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Roles` DROP FOREIGN KEY `Roles_userId_fkey`;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `rolesId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_rolesId_fkey` FOREIGN KEY (`rolesId`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
