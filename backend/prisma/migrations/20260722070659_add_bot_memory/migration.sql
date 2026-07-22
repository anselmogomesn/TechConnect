-- CreateTable
CREATE TABLE "BotConversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "messages" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "BotConversation_userId_idx" ON "BotConversation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BotConversation_userId_key" ON "BotConversation"("userId");
