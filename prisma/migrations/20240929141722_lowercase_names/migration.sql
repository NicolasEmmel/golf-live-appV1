/*
  Warnings:

  - You are about to drop the `Hole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HoleScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HoleScore" DROP CONSTRAINT "HoleScore_holeId_fkey";

-- DropForeignKey
ALTER TABLE "HoleScore" DROP CONSTRAINT "HoleScore_playerId_fkey";

-- DropTable
DROP TABLE "Hole";

-- DropTable
DROP TABLE "HoleScore";

-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "handicap" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hole" (
    "holeId" SERIAL NOT NULL,
    "par" INTEGER NOT NULL,
    "strokeIndex" INTEGER NOT NULL,

    CONSTRAINT "hole_pkey" PRIMARY KEY ("holeId")
);

-- CreateTable
CREATE TABLE "holescore" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "holeId" INTEGER NOT NULL,
    "strokes" INTEGER NOT NULL,
    "bruttoScore" INTEGER NOT NULL,
    "nettoScore" INTEGER NOT NULL,
    "mulligans" INTEGER NOT NULL,
    "putts" INTEGER NOT NULL,
    "drinks" INTEGER NOT NULL,

    CONSTRAINT "holescore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "holescore" ADD CONSTRAINT "holescore_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holescore" ADD CONSTRAINT "holescore_holeId_fkey" FOREIGN KEY ("holeId") REFERENCES "hole"("holeId") ON DELETE RESTRICT ON UPDATE CASCADE;
