-- CreateTable
CREATE TABLE "AnimeCache" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "synopsis" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnimeCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCache_animeId_key" ON "AnimeCache"("animeId");
