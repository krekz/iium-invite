/*
  Warnings:

  - You are about to drop the column `published` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "published",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "registrationEndDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Event_registrationEndDate_active_idx" ON "Event"("registrationEndDate", "active");

-- CreateIndex
CREATE INDEX "Event_date_active_idx" ON "Event"("date", "active");

-- CreateIndex
CREATE INDEX "Event_active_idx" ON "Event"("active");
