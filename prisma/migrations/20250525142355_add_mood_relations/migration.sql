/*
  Warnings:

  - You are about to drop the column `genres` on the `MoodCache` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `MoodCache` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MoodCache" DROP COLUMN "genres",
DROP COLUMN "mood";

-- CreateTable
CREATE TABLE "Mood" (
    "id" SERIAL NOT NULL,
    "mood" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimeMoods" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnimeMoods_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mood_mood_key" ON "Mood"("mood");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_animeId_key" ON "Mood"("animeId");

-- CreateIndex
CREATE INDEX "_AnimeMoods_B_index" ON "_AnimeMoods"("B");

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "AnimeCache"("animeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeMoods" ADD CONSTRAINT "_AnimeMoods_A_fkey" FOREIGN KEY ("A") REFERENCES "Mood"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeMoods" ADD CONSTRAINT "_AnimeMoods_B_fkey" FOREIGN KEY ("B") REFERENCES "MoodCache"("id") ON DELETE CASCADE ON UPDATE CASCADE;
