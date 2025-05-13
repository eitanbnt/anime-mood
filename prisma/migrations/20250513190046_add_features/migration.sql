/*
  Warnings:

  - You are about to drop the column `genres` on the `AnimeCache` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `MoodCache` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `Recommendation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnimeCache" DROP COLUMN "genres",
ADD COLUMN     "episodes" TEXT,
ADD COLUMN     "score" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "trailer" TEXT;

-- AlterTable
ALTER TABLE "MoodCache" DROP COLUMN "genres",
ADD COLUMN     "episodes" TEXT,
ADD COLUMN     "score" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "trailer" TEXT;

-- AlterTable
ALTER TABLE "Recommendation" DROP COLUMN "genres",
ADD COLUMN     "episodes" TEXT,
ADD COLUMN     "score" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "trailer" TEXT;

-- CreateTable
CREATE TABLE "Genre" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimeGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnimeGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AnimeGenres_B_index" ON "_AnimeGenres"("B");

-- AddForeignKey
ALTER TABLE "_AnimeGenres" ADD CONSTRAINT "_AnimeGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "AnimeCache"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeGenres" ADD CONSTRAINT "_AnimeGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
