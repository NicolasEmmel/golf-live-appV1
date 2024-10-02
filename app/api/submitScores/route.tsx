import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    // Parse the incoming request and extract holeScores
    const { holeScores } = await req.json();

    if (!holeScores || !Array.isArray(holeScores)) {
        return NextResponse.json({ error: 'Invalid data format, expected an array of holeScores' });
    }

    try {
        // Loop through each player's scores in the holeScores array
        for (const score of holeScores) {
            const { playerId, holeId, strokes, putts, mulligans } = score;

            // Use Prisma upsert to insert or update the HoleScore
            await prisma.holescore.upsert({
                where: {
                    playerid_holeid: {
                        playerid: playerId,
                        holeid: holeId,
                    },
                },
                update: {
                    strokes,
                    putts,
                    mulligans,
                },
                create: {
                    playerid: playerId,
                    holeid: holeId,
                    strokes,
                    bruttoscore: 0, // Set other values to 0 initially
                    nettoscore: 0,
                    putts,
                    mulligans,
                    drinks: 0,
                },
            });
        }

        return NextResponse.json({ message: 'Scores successfully updated.' });
    } catch (error) {
        console.error('Error updating scores:', error);
        return NextResponse.json({ error: 'Failed to update scores.' });
    }
}
