-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "handicap" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hole" (
    "holeId" SERIAL NOT NULL,
    "par" INTEGER NOT NULL,
    "strokeIndex" INTEGER NOT NULL,

    CONSTRAINT "Hole_pkey" PRIMARY KEY ("holeId")
);

-- CreateTable
CREATE TABLE "HoleScore" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "holeId" INTEGER NOT NULL,
    "strokes" INTEGER NOT NULL,
    "bruttoScore" INTEGER NOT NULL,
    "nettoScore" INTEGER NOT NULL,
    "mulligans" INTEGER NOT NULL,
    "putts" INTEGER NOT NULL,
    "drinks" INTEGER NOT NULL,

    CONSTRAINT "HoleScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HoleScore" ADD CONSTRAINT "HoleScore_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoleScore" ADD CONSTRAINT "HoleScore_holeId_fkey" FOREIGN KEY ("holeId") REFERENCES "Hole"("holeId") ON DELETE RESTRICT ON UPDATE CASCADE;
