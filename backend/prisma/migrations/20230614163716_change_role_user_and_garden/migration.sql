/*
  Warnings:

  - The values [MANAGER] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `gardens_on_users` ADD COLUMN `role` ENUM('MANAGER', 'USER', 'VIEWER') NOT NULL DEFAULT 'VIEWER';

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
