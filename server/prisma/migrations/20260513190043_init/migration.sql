/*
  Warnings:

  - You are about to drop the column `code` on the `VerificationCode` table. All the data in the column will be lost.
  - Added the required column `token` to the `VerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerificationCode" DROP COLUMN "code",
ADD COLUMN     "token" TEXT NOT NULL;
