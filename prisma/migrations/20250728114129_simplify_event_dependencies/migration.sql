/*
  Warnings:

  - You are about to drop the `event_dependency` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "event_dependency";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "event_type_dependency" (
    "eventId" TEXT NOT NULL,
    "requiredTypeId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "requiredTypeId"),
    CONSTRAINT "event_type_dependency_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_type_dependency_requiredTypeId_fkey" FOREIGN KEY ("requiredTypeId") REFERENCES "event_type" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
