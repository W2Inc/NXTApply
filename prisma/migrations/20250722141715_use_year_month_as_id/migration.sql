/*
  Warnings:

  - The primary key for the `user_metrics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_metrics` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_metrics" (
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "userCount" INTEGER NOT NULL,
    "completedTracks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("year", "month")
);
INSERT INTO "new_user_metrics" ("completedTracks", "createdAt", "month", "updatedAt", "userCount", "year") SELECT "completedTracks", "createdAt", "month", "updatedAt", "userCount", "year" FROM "user_metrics";
DROP TABLE "user_metrics";
ALTER TABLE "new_user_metrics" RENAME TO "user_metrics";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
