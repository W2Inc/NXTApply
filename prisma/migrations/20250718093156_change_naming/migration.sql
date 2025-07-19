/*
  Warnings:

  - You are about to drop the `ApplicationStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicationTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "ApplicationStep_trackId_order_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ApplicationStep";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ApplicationTrack";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Event";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startsAt" DATETIME NOT NULL,
    "type" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "application_track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "application_step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackId" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "application_step_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_track_completion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "track_completion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "track_completion_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_track_completion" ("completedAt", "createdAt", "id", "trackId", "userId") SELECT "completedAt", "createdAt", "id", "trackId", "userId" FROM "track_completion";
DROP TABLE "track_completion";
ALTER TABLE "new_track_completion" RENAME TO "track_completion";
CREATE INDEX "track_completion_userId_trackId_idx" ON "track_completion"("userId", "trackId");
CREATE INDEX "track_completion_completedAt_idx" ON "track_completion"("completedAt");
CREATE TABLE "new_track_completion_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "trackId" TEXT NOT NULL,
    "completionCount" INTEGER NOT NULL,
    "prevMonthCount" INTEGER,
    "percentageChange" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "track_completion_metrics_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_track_completion_metrics" ("completionCount", "createdAt", "id", "month", "percentageChange", "prevMonthCount", "trackId", "updatedAt", "year") SELECT "completionCount", "createdAt", "id", "month", "percentageChange", "prevMonthCount", "trackId", "updatedAt", "year" FROM "track_completion_metrics";
DROP TABLE "track_completion_metrics";
ALTER TABLE "new_track_completion_metrics" RENAME TO "track_completion_metrics";
CREATE UNIQUE INDEX "track_completion_metrics_year_month_trackId_key" ON "track_completion_metrics"("year", "month", "trackId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "application_step_trackId_order_idx" ON "application_step"("trackId", "order");
