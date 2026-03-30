/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `password` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Manager" DROP COLUMN "phoneNumber",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "phoneNumber",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
