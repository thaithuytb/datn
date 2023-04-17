-- AlterTable
ALTER TABLE `humis` MODIFY `threshold` DOUBLE NULL;

-- AlterTable
ALTER TABLE `lights` MODIFY `threshold` DOUBLE NULL;

-- AlterTable
ALTER TABLE `temp_airs` MODIFY `temp_threshold` DOUBLE NULL,
    MODIFY `air_humidity_threshold` DOUBLE NULL;
