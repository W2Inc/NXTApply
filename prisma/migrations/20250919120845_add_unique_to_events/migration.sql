-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT,
    "maxUsers" INTEGER,
    "autoComplete" BOOLEAN NOT NULL DEFAULT false,
    "unique" BOOLEAN NOT NULL DEFAULT false,
    "eventTypeId" TEXT NOT NULL,
    "trackId" TEXT,
    "startsAt" DATETIME NOT NULL,
    "registerUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_type" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_event" ("address", "autoComplete", "createdAt", "eventTypeId", "id", "maxUsers", "registerUntil", "startsAt", "trackId", "updatedAt") SELECT "address", "autoComplete", "createdAt", "eventTypeId", "id", "maxUsers", "registerUntil", "startsAt", "trackId", "updatedAt" FROM "event";
DROP TABLE "event";
ALTER TABLE "new_event" RENAME TO "event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
