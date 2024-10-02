/*
  Warnings:

  - The primary key for the `hole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `holeId` on the `hole` table. All the data in the column will be lost.
  - You are about to drop the column `strokeIndex` on the `hole` table. All the data in the column will be lost.
  - You are about to drop the column `bruttoScore` on the `holescore` table. All the data in the column will be lost.
  - You are about to drop the column `holeId` on the `holescore` table. All the data in the column will be lost.
  - You are about to drop the column `nettoScore` on the `holescore` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `holescore` table. All the data in the column will be lost.
  - Added the required column `strokeindex` to the `hole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bruttoscore` to the `holescore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `holeid` to the `holescore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nettoscore` to the `holescore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerid` to the `holescore` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "holescore" DROP CONSTRAINT "holescore_holeId_fkey";

-- DropForeignKey
ALTER TABLE "holescore" DROP CONSTRAINT "holescore_playerId_fkey";

-- AlterTable
ALTER TABLE "hole" DROP CONSTRAINT "hole_pkey",
DROP COLUMN "holeId",
DROP COLUMN "strokeIndex",
ADD COLUMN     "holeid" SERIAL NOT NULL,
ADD COLUMN     "strokeindex" INTEGER NOT NULL,
ADD CONSTRAINT "hole_pkey" PRIMARY KEY ("holeid");

-- AlterTable
ALTER TABLE "holescore" DROP COLUMN "bruttoScore",
DROP COLUMN "holeId",
DROP COLUMN "nettoScore",
DROP COLUMN "playerId",
ADD COLUMN     "bruttoscore" INTEGER NOT NULL,
ADD COLUMN     "holeid" INTEGER NOT NULL,
ADD COLUMN     "nettoscore" INTEGER NOT NULL,
ADD COLUMN     "playerid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "holescore" ADD CONSTRAINT "holescore_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holescore" ADD CONSTRAINT "holescore_holeid_fkey" FOREIGN KEY ("holeid") REFERENCES "hole"("holeid") ON DELETE RESTRICT ON UPDATE CASCADE;
