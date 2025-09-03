'use client';

import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import Link from "next/link";
import { Conversation, User } from "@/app/generated/prisma";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    };
}

export default function Header({ conversation }: HeaderProps) {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} User`;
        }
        return 'Active';
    }, [conversation]);

    return (
        <>
            <ProfileDrawer data={conversation} isOpen={drawerOpen} onDelete={() => setDrawerOpen(false)} onClose={() => setDrawerOpen(false)} />
            <div className="bg-white w-full flex border-b-[1px] border-gray-200 sm:px-4 py-3 px-4 lg:px-4 justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center">
                    <Link href={'/conversations'} className="lg:hidden block text-blue-500 hover:text-blue-600 transition cursor-pointer">
                        <HiChevronLeft size={32} />
                    </Link>
                    <Avatar user={otherUser} />
                    <div className="flex flex-col">
                        <div>
                            {conversation.name || otherUser?.name || 'No Name'}
                        </div>
                        <div className="text-sm font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal size={32} onClick={() => setDrawerOpen(true)} className="text-blue-500 cursor-pointer transition" />
            </div>
        </>
    );
}