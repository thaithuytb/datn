/*
  Warnings:

  - You are about to drop the `fans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `humis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lamps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nebulizers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pumps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `temp_airs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `fans` DROP FOREIGN KEY `fans_garden_id_fkey`;

-- DropForeignKey
ALTER TABLE `humis` DROP FOREIGN KEY `humis_garden_id_fkey`;

-- DropForeignKey
ALTER TABLE `lamps` DROP FOREIGN KEY `lamps_garden_id_fkey`;

-- DropForeignKey
ALTER TABLE `lights` DROP FOREIGN KEY `lights_garden_id_fkey`;

-- DropForeignKey
ALTER TABLE `nebulizers` DROP FOREIGN KEY `nebulizers_garden_id_fkey`;

-- DropForeignKey
ALTER TABLE `pumps` DROP FOREIGN KEY `pumps_garden_id_fkey`;

-- DropForeignKey
ALTER TABLE `temp_airs` DROP FOREIGN KEY `temp_airs_garden_id_fkey`;

-- DropTable
DROP TABLE `fans`;

-- DropTable
DROP TABLE `humis`;

-- DropTable
DROP TABLE `lamps`;

-- DropTable
DROP TABLE `lights`;

-- DropTable
DROP TABLE `nebulizers`;

-- DropTable
DROP TABLE `pumps`;

-- DropTable
DROP TABLE `temp_airs`;

-- CreateTable
CREATE TABLE `devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `type` ENUM('FAN', 'LAMP', 'NEBULIZER', 'PUMP', 'LIGHTSENSOR', 'HUMISENSOR', 'TEMPAIRSENSOR') NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,

    UNIQUE INDEX `devices_ip_key`(`ip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `temp_air_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temp` DOUBLE NOT NULL,
    `temp_threshold` DOUBLE NULL,
    `air_humidity` DOUBLE NOT NULL,
    `air_humidity_threshold` DOUBLE NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `temp_air_datas_device_id_idx`(`device_id`),
    INDEX `temp_air_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `humi_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `threshold` DOUBLE NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `humi_datas_device_id_idx`(`device_id`),
    INDEX `humi_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `light_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NOT NULL,
    `threshold` DOUBLE NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `light_data_device_id_idx`(`device_id`),
    INDEX `light_data_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fan_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `fan_datas_device_id_idx`(`device_id`),
    INDEX `fan_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pump_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `pump_datas_device_id_idx`(`device_id`),
    INDEX `pump_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nebulizer_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` DOUBLE NULL,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `nebulizer_datas_device_id_idx`(`device_id`),
    INDEX `nebulizer_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lamp_datas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    INDEX `lamp_datas_device_id_idx`(`device_id`),
    INDEX `lamp_datas_garden_id_device_id_idx`(`garden_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
