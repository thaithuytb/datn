-- CreateTable
CREATE TABLE `gardensOnUsers` (
    `user_id` INTEGER NOT NULL,
    `garden_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `garden_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gardensOnUsers` ADD CONSTRAINT `gardensOnUsers_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `gardens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gardensOnUsers` ADD CONSTRAINT `gardensOnUsers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
