'use client';

import { User } from '@/app/generated/prisma';

import UserBox from './UserBox';

interface UserListProps {
    items: User[];
}

export default function UserList({ items } : UserListProps) {
    return (
        <>
        <aside className='fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0'>
            <div className='px-5 py-3'>
                <div className='flex-col'>
                    <div className='text-2xl font-bold text-natural-800 py-4'>مردم</div>
                </div>
                {items.map((item) => (
                    <UserBox key={item.id} data={item} />
                ))}
            </div>
        </aside>
        </>
    );
};