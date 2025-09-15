-- CreateTable
CREATE TABLE "user" (
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

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "hash" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reset_token" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "reset_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "verification_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT,
    "maxUsers" INTEGER,
    "autoComplete" BOOLEAN NOT NULL DEFAULT false,
    "eventTypeId" TEXT NOT NULL,
    "trackId" TEXT,
    "startsAt" DATETIME NOT NULL,
    "registerUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_type" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_type_dependency" (
    "eventId" TEXT NOT NULL,
    "requiredTypeId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "requiredTypeId"),
    CONSTRAINT "event_type_dependency_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_type_dependency_requiredTypeId_fkey" FOREIGN KEY ("requiredTypeId") REFERENCES "event_type" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_type" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "user_event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "conditionals" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "application_step_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "application_user_track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "application_user_track_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "application_user_track_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "application_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "application_user_step" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userTrackId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "application_user_step_userTrackId_fkey" FOREIGN KEY ("userTrackId") REFERENCES "application_user_track" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "application_user_step_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "application_step" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_metrics" (
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "userCount" INTEGER NOT NULL,
    "completedTracks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("year", "month")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_userId_key" ON "verification_token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_event_userId_eventId_key" ON "user_event"("userId", "eventId");

-- CreateIndex
CREATE INDEX "application_step_trackId_order_idx" ON "application_step"("trackId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "application_user_track_userId_key" ON "application_user_track"("userId");

-- CreateIndex
CREATE INDEX "application_user_track_userId_trackId_idx" ON "application_user_track"("userId", "trackId");

-- CreateIndex
CREATE INDEX "application_user_track_completedAt_idx" ON "application_user_track"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "application_user_step_userTrackId_stepId_key" ON "application_user_step"("userTrackId", "stepId");
