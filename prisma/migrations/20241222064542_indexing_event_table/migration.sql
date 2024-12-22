-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "Event_authorId_date_idx" ON "Event"("authorId", "date");
