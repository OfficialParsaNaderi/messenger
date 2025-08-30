'use client';

import { User } from '@/app/generated/prisma';
import Image from 'next/image';

interface AvatarProps {
    user?: User | null;
}

export default function Avatar({ user }: AvatarProps) {
    return (
        <>
            <div className="relative">
                <div className='relative inline-block rounded-full lg:rounded-2xl overflow-hidden h-9 w-9 md:h-11 md:w-11'>
                    <Image src={user?.image || '/images/PlaceHolder.png'} alt='Avatar' fill />
                </div>
                <span className='absolute block rounded-2xl bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3'></span>
            </div>
        </>
    )
}