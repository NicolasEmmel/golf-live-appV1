import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient();

export async function GET(request: NextRequest){
    try {
        // Fetch the latest leaderboard data using Prisma
        const players = await prisma.player.findMany({
            select: {
              flight: true,
              name: true,
              id: true
            },
          });
      
          const flightsWithPlayers: { [key: number]: { flight: number; players: { name: string, id: number }[] } } = {};

          // Group players by flightNumber
          players.forEach((player) => {
            const { flight, name, id } = player;
      
            if (!flightsWithPlayers[flight]) {
              flightsWithPlayers[flight] = {
                flight,
                players: [],
              };
            }
            flightsWithPlayers[flight].players.push({ name, id });
          });
      
          // Convert the result into an array of flights
          const flightArray = Object.values(flightsWithPlayers);

        return NextResponse.json(flightArray, {status: 201});
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Error fetching leaderboard' }, {status: 404});
    }
}