'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import Image from 'next/image';

import { FullMessageType } from "@/app/types";
import Avatar from "@/app/components/Avatar";
import ImageModal from './ImageModal';

interface MessageBoxProps {
    data: FullMessageType,
    isLast?: boolean
}

export default function MessageBox({ data, isLast }: MessageBoxProps) {
    const session = useSession();
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const isOwn = session.data?.user?.email === data?.sender?.email;

    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(', ');

    const containerClasses = clsx(
        'flex gap-3 p-4',
        isOwn && 'justify-end'
    );

    const avatarClasses = clsx(isOwn && "order-2");

    const bodyClasses = clsx(
        'flex flex-col gap-2',
        isOwn && 'items-end'
    );

    const messageClasses = clsx(
        'text-sm w-fit overflow-hidden',
        isOwn ? 'bg-gray-200 text-black' : 'bg-gray-100',
        data.image ? 'rounded-md p-0' : 'rounded-xl py-2 px-3'
    );

    return (
        <div className={containerClasses}>
            <ImageModal 
                src={data.image}
                isOpen={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
            />
            <div className={avatarClasses}>
                <Avatar user={data.sender} />
            </div>
            <div className={bodyClasses}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={messageClasses}>
                    {data.image ? (
                        <Image
                            onClick={() => setImageModalOpen(true)}
                            alt="Image"
                            height="288"
                            width="288"
                            src={data.image}
                            className="
                                object-cover 
                                cursor-pointer 
                                hover:scale-110 
                                transition
                            "
                        />
                    ) : (
                        <div>{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-gray-500">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
};