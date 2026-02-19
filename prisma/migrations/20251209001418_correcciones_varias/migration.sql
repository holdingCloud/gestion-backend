/*
  Warnings:

  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `imagen` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `imagen` VARCHAR(150) NOT NULL;
