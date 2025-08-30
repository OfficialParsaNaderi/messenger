import prisma from "@/app/libs/prisma_db";

import GetSession from "./GetSession";

const GetUsers = async () => {
    const session = await GetSession();

    if (!session?.user?.email) {
        return [];
    };

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                NOT: {
                    email: session.user.email,
                }
            }
        });

        return users;
    } catch (error) {
        console.error("Error in GetUsers:", error);
        return [];
    };
};

export default GetUsers;