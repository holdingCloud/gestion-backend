/*
  Warnings:

  - You are about to drop the column `userId` on the `Roles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Roles_userId_key` ON `Roles`;

-- AlterTable
ALTER TABLE `Roles` DROP COLUMN `userId`;
