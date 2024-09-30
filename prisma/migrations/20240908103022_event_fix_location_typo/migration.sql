/*
  Warnings:

  - You are about to drop the column `locaton` on the `Event` table. All the data in the column will be lost.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "locaton",
ADD COLUMN     "location" TEXT NOT NULL;
