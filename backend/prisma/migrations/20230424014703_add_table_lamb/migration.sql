-- CreateTable
CREATE TABLE `lamps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` BOOLEAN NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `garden_id` INTEGER NOT NULL,

    INDEX `lamps_ip_idx`(`ip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lamps` ADD CONSTRAINT `lamps_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
