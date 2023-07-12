/*
  Warnings:

  - You are about to alter the column `role` on the `gardens_on_users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `gardens_on_users` MODIFY `role` ENUM('MANAGER', 'USER') NOT NULL DEFAULT 'USER';
