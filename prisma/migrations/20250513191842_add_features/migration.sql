/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE genre_id_seq;
ALTER TABLE "Genre" ALTER COLUMN "id" SET DEFAULT nextval('genre_id_seq');
ALTER SEQUENCE genre_id_seq OWNED BY "Genre"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");
