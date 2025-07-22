/*
  Warnings:

  - You are about to drop the `step_completion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_completion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "step_completion";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "track_completion";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user_track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_track_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_track_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userTrackId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "user_step_userTrackId_fkey" FOREIGN KEY ("userTrackId") REFERENCES "user_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_step_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "application_step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_track_userId_key" ON "user_track"("userId");

-- CreateIndex
CREATE INDEX "user_track_userId_trackId_idx" ON "user_track"("userId", "trackId");

-- CreateIndex
CREATE INDEX "user_track_completedAt_idx" ON "user_track"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_step_userTrackId_stepId_key" ON "user_step"("userTrackId", "stepId");
