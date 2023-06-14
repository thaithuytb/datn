/*
  Warnings:

  - You are about to drop the column `other_threshold` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `devices` DROP COLUMN `other_threshold`,
    DROP COLUMN `threshold`,
    ADD COLUMN `high_threshold` VARCHAR(191) NULL,
    ADD COLUMN `low_threshold` VARCHAR(191) NULL;
