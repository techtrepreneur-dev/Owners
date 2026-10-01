-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "squareFeet" DROP NOT NULL,
ALTER COLUMN "squareFeet" SET DEFAULT 0;
