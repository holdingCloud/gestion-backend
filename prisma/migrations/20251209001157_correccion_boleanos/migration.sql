/*
  Warnings:

  - Made the column `isActive` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isLoged` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `isLoged` BOOLEAN NOT NULL DEFAULT false;
