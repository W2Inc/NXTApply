/*
  Warnings:

  - You are about to drop the `track_completion_metrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_metrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "track_completion_metrics_year_month_trackId_key";

-- DropIndex
DROP INDEX "user_metrics_year_month_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "track_completion_metrics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_metrics";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "step_completion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userTrackId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "completedAt" DATETIME,
    CONSTRAINT "step_completion_userTrackId_fkey" FOREIGN KEY ("userTrackId") REFERENCES "track_completion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "step_completion_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "application_step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_track_completion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "track_completion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "track_completion_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_track_completion" ("completedAt", "createdAt", "id", "trackId", "userId") SELECT "completedAt", "createdAt", "id", "trackId", "userId" FROM "track_completion";
DROP TABLE "track_completion";
ALTER TABLE "new_track_completion" RENAME TO "track_completion";
CREATE UNIQUE INDEX "track_completion_userId_key" ON "track_completion"("userId");
CREATE INDEX "track_completion_userId_trackId_idx" ON "track_completion"("userId", "trackId");
CREATE INDEX "track_completion_completedAt_idx" ON "track_completion"("completedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "step_completion_userTrackId_stepId_key" ON "step_completion"("userTrackId", "stepId");
