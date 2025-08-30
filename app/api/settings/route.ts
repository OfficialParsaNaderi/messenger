import { NextResponse } from 'next/server';
import GetCurrentUser from '@/app/actions/GetCurrentUser';
import prisma from '@/app/libs/prisma_db';

export async function POST(request: Request) {
    try {
        const currentUser = await GetCurrentUser();
        const body = await request.json();
        const { name, image } = body;

        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: name,
                image: image
            }
        });

        return NextResponse.json(updatedUser);

    } catch(error) {
        console.log("ERROR_SETTING", error);
        return new NextResponse('Internal Error', { status: 500 });
    };
};