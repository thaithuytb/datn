/*
  Warnings:

  - You are about to drop the `light_lux_data` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endAt` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `light_lux_data` DROP FOREIGN KEY `light_lux_data_device_id_fkey`;

-- AlterTable
ALTER TABLE `devices` ADD COLUMN `duration` VARCHAR(191) NULL,
    ADD COLUMN `endAt` DATETIME(3) NOT NULL,
    ADD COLUMN `startAt` DATETIME(3) NOT NULL,
    ADD COLUMN `time` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `light_lux_data`;

-- CreateTable
CREATE TABLE `light_lux_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `light_lux_datas_device_id_idx`(`device_id`),
    INDEX `light_lux_datas_device_id_created_at_idx`(`device_id`, `created_at`),
    INDEX `light_lux_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `light_lux_datas` ADD CONSTRAINT `light_lux_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
