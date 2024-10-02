import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest){
    try {
        const holes = await prisma.hole.findMany({orderBy:{holeid: "asc"}});

        return NextResponse.json(holes);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Error fetching leaderboard' });
      }
}
