/*
  Warnings:

  - Added the required column `garden_id` to the `fans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `garden_id` to the `humis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `garden_id` to the `lights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `garden_id` to the `nebulizers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `garden_id` to the `pumps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `garden_id` to the `temp_airs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fans` ADD COLUMN `garden_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `humis` ADD COLUMN `garden_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `lights` ADD COLUMN `garden_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `nebulizers` ADD COLUMN `garden_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pumps` ADD COLUMN `garden_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `temp_airs` ADD COLUMN `garden_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `gardens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `width` INTEGER NULL,
    `length` INTEGER NULL,
    `land_area` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `gardens_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `fans_ip_idx` ON `fans`(`ip`);

-- CreateIndex
CREATE INDEX `humis_ip_idx` ON `humis`(`ip`);

-- CreateIndex
CREATE INDEX `lights_ip_idx` ON `lights`(`ip`);

-- CreateIndex
CREATE INDEX `nebulizers_ip_idx` ON `nebulizers`(`ip`);

-- CreateIndex
CREATE INDEX `pumps_ip_idx` ON `pumps`(`ip`);

-- CreateIndex
CREATE INDEX `temp_airs_ip_idx` ON `temp_airs`(`ip`);

-- AddForeignKey
ALTER TABLE `temp_airs` ADD CONSTRAINT `temp_airs_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `humis` ADD CONSTRAINT `humis_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lights` ADD CONSTRAINT `lights_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fans` ADD CONSTRAINT `fans_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pumps` ADD CONSTRAINT `pumps_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nebulizers` ADD CONSTRAINT `nebulizers_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
