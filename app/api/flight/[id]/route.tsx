import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface Props{
    params: {id: number}
}

export async function GET(request: NextRequest, props: Props){
    try {
        // Fetch the latest leaderboard data using Prisma
        const flight = await prisma.player.findMany({
            where: { flight: parseInt(props.params.id.toString()) }
        });

        return NextResponse.json(flight, {status: 201});
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Error fetching leaderboard' }, {status: 404});
    }
}