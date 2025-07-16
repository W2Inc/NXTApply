/*
  Warnings:

  - You are about to drop the column `oauthId` on the `user` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT,
    "tfa" TEXT,
    "dob" DATETIME,
    "gender" INTEGER,
    "country" TEXT,
    "flags" INTEGER NOT NULL DEFAULT 0,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "providerId" TEXT,
    "provider" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_user" ("country", "createdAt", "dob", "email", "firstName", "flags", "gender", "hash", "id", "lastName", "phone", "tfa", "updatedAt", "verified") SELECT "country", "createdAt", "dob", "email", "firstName", "flags", "gender", "hash", "id", "lastName", "phone", "tfa", "updatedAt", "verified" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
