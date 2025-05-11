-- CreateTable
CREATE TABLE "MoodCache" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "genres" TEXT,
    "mood" TEXT NOT NULL,

    CONSTRAINT "MoodCache_pkey" PRIMARY KEY ("id")
);
