/*
  Warnings:

  - A unique constraint covering the columns `[playerid,holeid]` on the table `holescore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "holescore_playerid_holeid_key" ON "holescore"("playerid", "holeid");
