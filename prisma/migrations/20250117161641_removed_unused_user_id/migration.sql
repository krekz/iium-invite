/*
  Warnings:

  - You are about to drop the column `userId` on the `EventReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventReport" DROP CONSTRAINT "EventReport_userId_fkey";

-- AlterTable
ALTER TABLE "EventReport" DROP COLUMN "userId";
