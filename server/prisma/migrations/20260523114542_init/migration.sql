/*
  Warnings:

  - The values [WasherDryer,AirConditioning] on the enum `Highlight` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Highlight_new" AS ENUM ('HighSpeedInternetAccess', 'Heating', 'SmokeFree', 'CableReady', 'SatelliteTV', 'DoubleVanities', 'TubShower', 'Intercom', 'SprinklerSystem', 'RecentlyRenovated', 'CloseToTransit', 'GreatView', 'QuietNeighborhood');
ALTER TABLE "Property" ALTER COLUMN "highlights" TYPE "Highlight_new"[] USING ("highlights"::text::"Highlight_new"[]);
ALTER TYPE "Highlight" RENAME TO "Highlight_old";
ALTER TYPE "Highlight_new" RENAME TO "Highlight";
DROP TYPE "public"."Highlight_old";
COMMIT;
