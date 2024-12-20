/*
  Warnings:

  - A unique constraint covering the columns `[iiumEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_iiumEmail_key" ON "User"("iiumEmail");
