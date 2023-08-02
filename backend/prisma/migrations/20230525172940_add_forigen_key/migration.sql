/*
  Warnings:

  - Made the column `status` on table `devices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `devices` MODIFY `status` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `temp_air_datas` ADD CONSTRAINT `temp_air_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `humi_datas` ADD CONSTRAINT `humi_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `light_data` ADD CONSTRAINT `light_data_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fan_datas` ADD CONSTRAINT `fan_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pump_datas` ADD CONSTRAINT `pump_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nebulizer_datas` ADD CONSTRAINT `nebulizer_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lamp_datas` ADD CONSTRAINT `lamp_datas_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
