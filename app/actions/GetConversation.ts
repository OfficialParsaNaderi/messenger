import prisma from '@/app/libs/prisma_db';
import GetCurrentUser from './GetCurrentUser';

const GetConversations = async () => {
    const currentUser = await GetCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                users: {
                    some: {
                        id: currentUser.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        });

        return conversations;

    } catch (error) {
        console.log('Error getting conversations', error);
        return [];
    }
};

export default GetConversations;