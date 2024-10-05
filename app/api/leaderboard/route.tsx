import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Fetch all players with their hole scores and hole data
    const players = await prisma.player.findMany({
      include: {
        holescores: {
          include: {
            hole: true, // Include hole data to access par and stroke index
          },
        },
      },
    });

    // Build leaderboard data
    const leaderboard = players.map((player) => {
      // Initialize calculated values
      let toPar = 0;
      let bruttoScore = 0;
      let nettoScore = 0;
      let totalPutts = 0;
      let totalMulligans = 0;
      let totalDrinks = 0;
      let holesPlayed = player.holescores.length;

      // Calculate the player's course handicap
      const handicap = player.handicap || 0;
      const courseHandicap = player.gender === 'Female'
        ? (-1 * Math.round((-1* parseFloat(handicap.toString())) * 131 / 113 - 73.8 + 72))
        : (-1 * Math.round((-1* parseFloat(handicap.toString())) * 133 / 113 - 71.8 + 72));

      // Iterate over player's hole scores to calculate toPar, bruttoScore, and nettoScore
      player.holescores.forEach((holeScore, index) => {
        const par = holeScore.hole.par;
        const strokeIndex = holeScore.hole.strokeindex;
        const strokes = holeScore.strokes;
        const diffToPar = strokes - par;

        // Calculate "To Par" (brutto score)
        toPar += diffToPar;

        // Calculate "Brutto Score"
        if (diffToPar === -3) bruttoScore += 5;
        else if (diffToPar === -2) bruttoScore += 4;
        else if (diffToPar === -1) bruttoScore += 3;
        else if (diffToPar === 0) bruttoScore += 2;
        else if (diffToPar === 1) bruttoScore += 1;

        // Calculate extra strokes for this hole based on the player's course handicap and stroke index
        let extraStrokes = 0;
        if (courseHandicap > 0) {
          if (courseHandicap >= strokeIndex) {
            extraStrokes = Math.floor(courseHandicap / 18) + (courseHandicap % 18 >= strokeIndex ? 1 : 0);
          }
        }

        if (courseHandicap < 0) {
          // Add strokes to the easiest holes
          const adjustedHandicap = Math.abs(courseHandicap);
          if (index < adjustedHandicap) {
            extraStrokes = -1; // Add one extra stroke to the easiest holes
          }
        }

        console.log(extraStrokes);

        // Calculate "Netto Score" for this hole
        const nettoDiffToPar = strokes - extraStrokes - par;
        if (nettoDiffToPar === -3) nettoScore += 5;
        else if (nettoDiffToPar === -2) nettoScore += 4;
        else if (nettoDiffToPar === -1) nettoScore += 3;
        else if (nettoDiffToPar === 0) nettoScore += 2;
        else if (nettoDiffToPar === 1) nettoScore += 1;

        // Sum up putts and mulligans
        totalPutts += holeScore.putts;
        totalMulligans += holeScore.mulligans;
        totalDrinks += holeScore.drinks;
      });

      return {
        name: player.name,
        toPar,
        bruttoScore,
        nettoScore,
        holesPlayed,
        totalPutts,
        totalMulligans,
        totalDrinks
      };
    });

    // Sort by 'To Par', then 'Netto Score', then 'Brutto Score'
    leaderboard.sort((a, b) => {
      if (a.toPar === b.toPar) {
        if (a.nettoScore === b.nettoScore) {
          return b.bruttoScore - a.bruttoScore; // Tiebreaker by Brutto Score
        }
        return b.nettoScore - a.nettoScore; // Sort by Netto Score if To Par is tied
      }
      return a.toPar - b.toPar; // Sort ascending by To Par (lower is better)
    });

    // Set Cache-Control header to ensure no caching
    const response = NextResponse.json(leaderboard);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
