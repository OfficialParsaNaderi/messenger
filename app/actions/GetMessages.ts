import prisma from "@/app/libs/prisma_db";

const GetMessages = async (conversationId: string) => {
    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        return messages;
    } catch (error) {
        console.error("Error in GetMessage:", error);
        return [];
    }
};

export default GetMessages;