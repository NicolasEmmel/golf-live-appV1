import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface PatchObj{
    hid: number,
    pid: number,
    inc: number
}

export async function PATCH(request: NextRequest){
    const patchObj: PatchObj = await request.json();

    try {
        const hId = parseInt(patchObj.hid.toString());
        const pId = parseInt(patchObj.pid.toString());
        const inc = parseInt(patchObj.inc.toString());

        await prisma.holescore.update({
            where:{
                playerid_holeid:{
                    playerid: pId,
                    holeid: hId
                }
            },
            data:{
                strokes:{
                    increment: inc
                }
            }
        })

        return NextResponse.json("Updated", {status: 201});
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ error: 'Error in players' }, {status: 404});
    }
}