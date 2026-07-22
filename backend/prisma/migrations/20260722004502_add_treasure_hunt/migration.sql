-- CreateTable
CREATE TABLE "TreasureHunt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "clue" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "streakBonus" INTEGER NOT NULL DEFAULT 10,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserTreasureFind" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "treasureId" TEXT NOT NULL,
    "found" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "foundAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserTreasureFind_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserTreasureFind_treasureId_fkey" FOREIGN KEY ("treasureId") REFERENCES "TreasureHunt" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TreasureHunt_date_key" ON "TreasureHunt"("date");

-- CreateIndex
CREATE INDEX "UserTreasureFind_userId_idx" ON "UserTreasureFind"("userId");

-- CreateIndex
CREATE INDEX "UserTreasureFind_treasureId_idx" ON "UserTreasureFind"("treasureId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTreasureFind_userId_treasureId_key" ON "UserTreasureFind"("userId", "treasureId");
