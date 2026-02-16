-- CreateTable
CREATE TABLE `tbl_mas_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userCode` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,
    `verifyEmail` VARCHAR(191) NOT NULL,
    `profileImage` VARCHAR(191) NOT NULL,
    `uploadImage` VARCHAR(191) NULL,
    `uploadImageId` VARCHAR(191) NOT NULL,
    `createBy` VARCHAR(191) NOT NULL,
    `createDateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateBy` VARCHAR(191) NOT NULL,
    `updateDateTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_mas_users_userCode_key`(`userCode`),
    UNIQUE INDEX `tbl_mas_users_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
