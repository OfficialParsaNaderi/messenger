import prisma from '@/app/libs/prisma_db';
import GetSession from '@/app/actions/GetSession';
import { User } from '@/app/generated/prisma';

const GetCurrentUser = async (): Promise<User | null> => {
    try {
        const session = await GetSession();

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        if (!currentUser) {
            return null;
        }

        return currentUser;
    } catch (error) {
        console.error("Error in GetCurrentUser:", error);
        return null;
    }
};

export default GetCurrentUser;