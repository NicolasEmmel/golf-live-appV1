import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { players } = await req.json();

    if (!players || players.length === 0) {
        return NextResponse.json({ message: 'No players provided' });
    }

    try {
        // Clear existing data in all tables
        await prisma.holescore.deleteMany();
        await prisma.player.deleteMany();

        // Assuming holes are static and you don't want to delete them
        const holes = await prisma.hole.findMany(); // Fetch existing holes

        // Add new players
        const newPlayers = await Promise.all(
            players.map(async (player: { name: string; handicap: string; flightNumber: string }) => {
                return prisma.player.create({
                    data: {
                        name: player.name,
                        handicap: player.handicap,
                        flight: parseInt(player.flightNumber),
                    },
                });
            })
        );

        // Add initial entries in HoleScore for each player and each hole
        // await Promise.all(
        //     newPlayers.map(async (player) => {
        //         return Promise.all(
        //             holes.map((hole) => {
        //                 return prisma.holescore.create({
        //                     data: {
        //                         playerid: player.id,
        //                         holeid: hole.holeid,
        //                         strokes: 0,
        //                         bruttoscore: 0,
        //                         nettoscore: 0,
        //                         mulligans: 0,
        //                         putts: 0,
        //                         drinks: 0,
        //                     },
        //                 });
        //             })
        //         );
        //     })
        // );

        return NextResponse.json({ message: 'Tournament initialized successfully' });
    } catch (error) {
        console.error('Error initializing tournament:', error);
        return NextResponse.json({ message: 'Internal Server Error' });
    }

}
