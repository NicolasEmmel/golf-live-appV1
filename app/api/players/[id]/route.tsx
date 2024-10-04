import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define a PUT and DELETE handler
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const playerId = params.id; // Get the player ID from params
  const { name, handicap, flight, gender } = await req.json();

  try {
    const updatedPlayer = await prisma.player.update({
      where: { id: Number(playerId) },
      data: { name, handicap, flight, gender },
    });
    return NextResponse.json(updatedPlayer);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update player' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const playerId: number = parseInt(params.id); // Get the player ID from params

  try {
    await prisma.player.delete({
      where: { id: Number(playerId) },
    });
    return NextResponse.json({ message: 'Player deleted successfully' }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete player' }, { status: 500 });
  }
}
