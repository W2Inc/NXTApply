-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_application_step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT,
    "conditionals" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "application_step_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_application_step" ("conditionals", "content", "createdAt", "id", "order", "trackId", "type", "updatedAt") SELECT "conditionals", "content", "createdAt", "id", "order", "trackId", "type", "updatedAt" FROM "application_step";
DROP TABLE "application_step";
ALTER TABLE "new_application_step" RENAME TO "application_step";
CREATE INDEX "application_step_trackId_order_idx" ON "application_step"("trackId", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
