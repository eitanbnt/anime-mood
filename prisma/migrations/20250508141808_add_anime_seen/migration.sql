-- CreateTable
CREATE TABLE "AnimeSeen" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnimeSeen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeSeen_animeId_userId_key" ON "AnimeSeen"("animeId", "userId");
