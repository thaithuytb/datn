/*
  Warnings:

  - You are about to drop the column `high_threshold` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `low_threshold` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `devices` DROP COLUMN `high_threshold`,
    DROP COLUMN `low_threshold`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `date_of_birth` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `thresholds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('LIGHTSENSOR', 'HUMISENSOR', 'TEMPAIRSENSOR') NOT NULL,
    `low_threshold` VARCHAR(191) NULL,
    `high_threshold` VARCHAR(191) NULL,
    `garden_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `thresholds` ADD CONSTRAINT `thresholds_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
