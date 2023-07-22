/*
  Warnings:

  - You are about to drop the `Humidity_datas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Humidity_datas` DROP FOREIGN KEY `Humidity_datas_device_id_fkey`;

-- DropTable
DROP TABLE `Humidity_datas`;

-- CreateTable
CREATE TABLE `humidity_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `humidity_datas_device_id_idx`(`device_id`),
    INDEX `humidity_datas_device_id_created_at_idx`(`device_id`, `created_at`),
    INDEX `humidity_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `humidity_datas` ADD CONSTRAINT `humidity_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
