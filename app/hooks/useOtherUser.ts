import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FullConversationType } from '@/app/types';
import { User } from '@/app/generated/prisma';

const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
    const session = useSession();

    const otherUser = useMemo(() => {
        const currentUserEmail = session.data?.user?.email;

        const otherUser = conversation.users.find((user) => user.email !== currentUserEmail);

        return otherUser;
    }, [session.data?.user?.email, conversation.users]);

    return otherUser;
};

export default useOtherUser;