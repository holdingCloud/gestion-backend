/*
  Warnings:

  - Made the column `imagen` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `imagen` VARCHAR(150) NOT NULL;
