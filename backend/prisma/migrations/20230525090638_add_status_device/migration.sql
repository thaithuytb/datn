/*
  Warnings:

  - You are about to drop the column `threshold` on the `humi_datas` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `light_data` table. All the data in the column will be lost.
  - You are about to drop the column `air_humidity_threshold` on the `temp_air_datas` table. All the data in the column will be lost.
  - You are about to drop the column `temp_threshold` on the `temp_air_datas` table. All the data in the column will be lost.
  - You are about to drop the `gardensOnUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notificationsOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `gardensOnUsers` DROP FOREIGN KEY `gardensOnUsers_garden_id_fkey`;

-- DropForeignKey
ALTER TABLE `gardensOnUsers` DROP FOREIGN KEY `gardensOnUsers_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notificationsOnUsers` DROP FOREIGN KEY `notificationsOnUsers_notification_id_fkey`;

-- DropForeignKey
ALTER TABLE `notificationsOnUsers` DROP FOREIGN KEY `notificationsOnUsers_user_id_fkey`;

-- AlterTable
ALTER TABLE `devices` ADD COLUMN `other_threshold` DOUBLE NULL,
    ADD COLUMN `threshold` DOUBLE NULL;

-- AlterTable
ALTER TABLE `humi_datas` DROP COLUMN `threshold`;

-- AlterTable
ALTER TABLE `light_data` DROP COLUMN `threshold`;

-- AlterTable
ALTER TABLE `temp_air_datas` DROP COLUMN `air_humidity_threshold`,
    DROP COLUMN `temp_threshold`;

-- DropTable
DROP TABLE `gardensOnUsers`;

-- DropTable
DROP TABLE `notificationsOnUsers`;

-- CreateTable
CREATE TABLE `gardens_on_users` (
    `user_id` INTEGER NOT NULL,
    `garden_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `gardensOnUsers_garden_id_fkey`(`garden_id`),
    PRIMARY KEY (`user_id`, `garden_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications_on_users` (
    `user_id` INTEGER NOT NULL,
    `notification_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `seen` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('CALENDAR', 'NOTION', 'OTHER') NOT NULL,

    INDEX `notificationsOnUsers_notification_id_fkey`(`notification_id`),
    PRIMARY KEY (`user_id`, `notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fan_datas_device_id_created_at_idx` ON `fan_datas`(`device_id`, `created_at`);

-- CreateIndex
CREATE INDEX `humi_datas_device_id_created_at_idx` ON `humi_datas`(`device_id`, `created_at`);

-- CreateIndex
CREATE INDEX `lamp_datas_device_id_created_at_idx` ON `lamp_datas`(`device_id`, `created_at`);

-- CreateIndex
CREATE INDEX `light_data_device_id_created_at_idx` ON `light_data`(`device_id`, `created_at`);

-- CreateIndex
CREATE INDEX `nebulizer_datas_device_id_created_at_idx` ON `nebulizer_datas`(`device_id`, `created_at`);

-- CreateIndex
CREATE INDEX `pump_datas_device_id_created_at_idx` ON `pump_datas`(`device_id`, `created_at`);

-- CreateIndex
CREATE INDEX `temp_air_datas_device_id_created_at_idx` ON `temp_air_datas`(`device_id`, `created_at`);

-- AddForeignKey
ALTER TABLE `gardens_on_users` ADD CONSTRAINT `gardens_on_users_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gardens_on_users` ADD CONSTRAINT `gardens_on_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications_on_users` ADD CONSTRAINT `notifications_on_users_notification_id_fkey` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications_on_users` ADD CONSTRAINT `notifications_on_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
