/*
  Warnings:

  - You are about to drop the column `name` on the `Manager` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the `_TenantProperties` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nin]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_A_fkey";

-- DropForeignKey
ALTER TABLE "_TenantProperties" DROP CONSTRAINT "_TenantProperties_B_fkey";

-- AlterTable
ALTER TABLE "Manager" DROP COLUMN "name",
ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "nin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "profileVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "tire" TEXT NOT NULL DEFAULT '1';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "activeStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleteStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishStatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "name",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- DropTable
DROP TABLE "_TenantProperties";

-- CreateIndex
CREATE UNIQUE INDEX "Manager_nin_key" ON "Manager"("nin");
