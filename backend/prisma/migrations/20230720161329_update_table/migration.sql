/*
  Warnings:

  - The values [CURTAIN,LIGHTSENSOR,HUMISENSOR,TEMPAIRSENSOR] on the enum `devices_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [LIGHTSENSOR,HUMISENSOR,TEMPAIRSENSOR] on the enum `thresholds_name` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `curtain_datas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fan_datas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `humi_datas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lamp_datas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `light_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pump_datas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `temp_air_datas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `curtain_datas` DROP FOREIGN KEY `curtain_datas_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `fan_datas` DROP FOREIGN KEY `fan_datas_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `humi_datas` DROP FOREIGN KEY `humi_datas_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `lamp_datas` DROP FOREIGN KEY `lamp_datas_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `light_data` DROP FOREIGN KEY `light_data_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `pump_datas` DROP FOREIGN KEY `pump_datas_device_id_fkey`;

-- DropForeignKey
ALTER TABLE `temp_air_datas` DROP FOREIGN KEY `temp_air_datas_device_id_fkey`;

-- AlterTable
ALTER TABLE `devices` MODIFY `type` ENUM('FAN', 'LAMP', 'PUMP', 'LIGHT_SENSOR', 'HUMIDITY_SENSOR', 'TEMPERATURE_HUMIDITY_AIR_SENSOR') NOT NULL;

-- AlterTable
ALTER TABLE `thresholds` MODIFY `name` ENUM('LIGHT_SENSOR', 'HUMIDITY_SENSOR', 'TEMPERATURE_HUMIDITY_AIR_SENSOR') NOT NULL;

-- DropTable
DROP TABLE `curtain_datas`;

-- DropTable
DROP TABLE `fan_datas`;

-- DropTable
DROP TABLE `humi_datas`;

-- DropTable
DROP TABLE `lamp_datas`;

-- DropTable
DROP TABLE `light_data`;

-- DropTable
DROP TABLE `pump_datas`;

-- DropTable
DROP TABLE `temp_air_datas`;

-- CreateTable
CREATE TABLE `temperature_humidity_air_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temperature` DOUBLE NOT NULL,
    `humidity_air` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `temperature_humidity_air_datas_device_id_idx`(`device_id`),
    INDEX `temperature_humidity_air_datas_device_id_created_at_idx`(`device_id`, `created_at`),
    INDEX `temperature_humidity_air_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Humidity_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `Humidity_datas_device_id_idx`(`device_id`),
    INDEX `Humidity_datas_device_id_created_at_idx`(`device_id`, `created_at`),
    INDEX `Humidity_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `light_lux_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `light_lux_data_device_id_idx`(`device_id`),
    INDEX `light_lux_data_device_id_created_at_idx`(`device_id`, `created_at`),
    INDEX `light_lux_data_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actuator_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL,

    INDEX `actuator_datas_device_id_idx`(`device_id`),
    INDEX `actuator_datas_device_id_created_at_idx`(`device_id`, `created_at`),
    INDEX `actuator_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `temperature_humidity_air_datas` ADD CONSTRAINT `temperature_humidity_air_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Humidity_datas` ADD CONSTRAINT `Humidity_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `light_lux_data` ADD CONSTRAINT `light_lux_data_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actuator_datas` ADD CONSTRAINT `actuator_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
