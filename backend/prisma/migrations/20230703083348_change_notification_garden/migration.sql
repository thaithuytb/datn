/*
  Warnings:

  - You are about to drop the column `type` on the `notifications_on_users` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `devices` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `gardens` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `garden_id` INTEGER NULL,
    ADD COLUMN `type` ENUM('GARDEN', 'DEVICE', 'OTHER') NOT NULL;

-- AlterTable
ALTER TABLE `notifications_on_users` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
