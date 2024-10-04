// pages/api/players.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const players = await prisma.player.findMany();
        return NextResponse.json(players, {status: 201});
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching players' }, {status: 404});
    }

}

export async function POST(req: NextRequest) {
    try {
        const { name, handicap, flight, gender } = await req.json();
        const newPlayer = await prisma.player.create({
            data: { name: name, handicap: Number(handicap), flight: Number(flight), gender: gender },
        });
        return NextResponse.json(newPlayer, {status:201})
    } catch (error) {
        return NextResponse.json({ error: 'Error creating player' }, {status: 404});
    }
}