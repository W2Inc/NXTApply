/*
  Warnings:

  - The primary key for the `event_dependency` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `event_dependency` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event_dependency" (
    "dependentId" TEXT NOT NULL,
    "requiredId" TEXT NOT NULL,

    PRIMARY KEY ("dependentId", "requiredId"),
    CONSTRAINT "event_dependency_dependentId_fkey" FOREIGN KEY ("dependentId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_dependency_requiredId_fkey" FOREIGN KEY ("requiredId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_event_dependency" ("dependentId", "requiredId") SELECT "dependentId", "requiredId" FROM "event_dependency";
DROP TABLE "event_dependency";
ALTER TABLE "new_event_dependency" RENAME TO "event_dependency";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
