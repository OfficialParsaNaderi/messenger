import GetCurrentUser from "@/app/actions/GetCurrentUser";
import prisma from "@/app/libs/prisma_db";
import { NextResponse } from "next/server";

interface IParams {
    conversationId: string;
}

export async function DELETE( request: Request, { params }: { params: IParams } ) {
    try {
        const { conversationId } = params;
        const currentUser = await GetCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });

        if (!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        if (!existingConversation.users.find(user => user.id === currentUser.id)) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
            },
        });

        return NextResponse.json(deletedConversation);

    } catch (error) {
        console.log("ERROR_SETTING", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
};