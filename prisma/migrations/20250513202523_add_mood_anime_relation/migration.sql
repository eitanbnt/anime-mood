/*
  Warnings:

  - A unique constraint covering the columns `[animeId]` on the table `MoodCache` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MoodCache_animeId_key" ON "MoodCache"("animeId");

-- AddForeignKey
ALTER TABLE "MoodCache" ADD CONSTRAINT "MoodCache_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "AnimeCache"("animeId") ON DELETE RESTRICT ON UPDATE CASCADE;
