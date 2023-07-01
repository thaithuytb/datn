/*
  Warnings:

  - The values [NEBULIZER] on the enum `devices_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `nebulizer_datas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `nebulizer_datas` DROP FOREIGN KEY `nebulizer_datas_device_id_fkey`;

-- AlterTable
ALTER TABLE `devices` MODIFY `type` ENUM('FAN', 'LAMP', 'CURTAIN', 'PUMP', 'LIGHTSENSOR', 'HUMISENSOR', 'TEMPAIRSENSOR') NOT NULL;

-- DropTable
DROP TABLE `nebulizer_datas`;

-- CreateTable
CREATE TABLE `curtain_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `curtain_datas_device_id_idx`(`device_id`),
    INDEX `curtain_datas_device_id_created_at_idx`(`device_id`, `created_at`),
    INDEX `curtain_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `curtain_datas` ADD CONSTRAINT `curtain_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
