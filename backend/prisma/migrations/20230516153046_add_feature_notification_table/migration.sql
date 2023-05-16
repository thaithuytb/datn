/*
  Warnings:

  - You are about to drop the column `description` on the `notificationsOnUsers` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notificationsOnUsers` table. All the data in the column will be lost.
  - Added the required column `description` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notificationsOnUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `notificationsOnUsers` DROP COLUMN `description`,
    DROP COLUMN `title`,
    ADD COLUMN `seen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('CALENDAR', 'NOTION', 'OTHER') NOT NULL;
