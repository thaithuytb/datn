-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'MANAGER', 'ADMIN') NOT NULL DEFAULT 'USER';