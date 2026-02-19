/*
  Warnings:

  - You are about to drop the column `name` on the `Roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Roles` DROP COLUMN `name`,
    ADD COLUMN `type` ENUM('ADMINISTRADOR', 'REPARTIDOR', 'COMUN') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Roles_type_key` ON `Roles`(`type`);
