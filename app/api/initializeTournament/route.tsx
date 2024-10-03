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

        // Add new players
        const newPlayers = await Promise.all(
            players.map(async (player: { name: string; handicap: string; flightNumber: string, gender: string }) => {
                return prisma.player.create({
                    data: {
                        name: player.name,
                        handicap: player.handicap,
                        gender: player.gender,
                        flight: parseInt(player.flightNumber),
                    },
                });
            })
        );

        return NextResponse.json({ message: 'Tournament initialized successfully' });
    } catch (error) {
        console.error('Error initializing tournament:', error);
        return NextResponse.json({ message: 'Internal Server Error' });
    }

}
