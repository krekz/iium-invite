/*
  Warnings:

  - You are about to drop the column `starpoints` on the `Event` table. All the data in the column will be lost.
  - Added the required column `has_starpoints` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "starpoints";

-- Add the new column with a default value
ALTER TABLE "Event" ADD COLUMN "has_starpoints" BOOLEAN NOT NULL DEFAULT false;

-- Update existing rows (optional, since we have a default value)
UPDATE "Event" SET "has_starpoints" = false;