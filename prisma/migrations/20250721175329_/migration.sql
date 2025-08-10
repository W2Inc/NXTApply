/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `track_completion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "track_completion_userId_key" ON "track_completion"("userId");
