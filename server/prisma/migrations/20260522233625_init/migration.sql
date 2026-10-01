/*
  Warnings:

  - You are about to drop the column `securityDeposit` on the `Property` table. All the data in the column will be lost.
  - Added the required column `otherFees` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `propertyType` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "VerificationCode_email_idx";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "securityDeposit",
ADD COLUMN     "otherFees" DOUBLE PRECISION NOT NULL,
DROP COLUMN "propertyType",
ADD COLUMN     "propertyType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PropertyType";
