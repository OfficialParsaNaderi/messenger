'use client';

import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition, DialogPanel, TransitionChild } from '@headlessui/react';
import { IoClose } from 'react-icons/io5';
import { HiTrash } from 'react-icons/hi2';
import { format } from "date-fns";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import { Conversation, User } from "@/app/generated/prisma";
import ConfirmModal from "./ConfirmModel";

interface ProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (conversationId: string) => void;
    data: Conversation & {
        users: User[];
    };
}

export default function ProfileDrawer({ data, isOpen, onClose }: ProfileDrawerProps) {
    const otherUser = useOtherUser(data);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const joinedDate = useMemo(() => {
        if (!otherUser?.createdAt) return '';
        return format(new Date(otherUser.createdAt), 'PP');
    }, [otherUser?.createdAt]);

    const title = useMemo(() => {
        return data.name || otherUser?.name || 'Unnamed';
    }, [data.name, otherUser?.name]);

    const statusText = useMemo(() => {
        if (data.isGroup) {
            return `${data.users?.length || 0} members`;
        }
        return 'Active';
    }, [data]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            />
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                                <TransitionChild
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-300"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-200"
                                    leaveFrom="translate-x-full"
                                    leaveTo="translate-x-full"
                                >
                                    <DialogPanel className="pointer-events-auto w-screen max-w-md bg-white">
                                        <div className="flex h-full flex-col overflow-y-auto bg-gradient-to-b from-gray-50 to-white py-6 shadow-2xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                                                    <button
                                                        type="button"
                                                        className="rounded-lg p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <IoClose size={24} aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-4 flex flex-wrap justify-center gap-2">
                                                        {data.isGroup ? (
                                                            data.users.slice(0, 3).map((user) => (
                                                                <Avatar key={user.id} user={user} />
                                                            ))
                                                        ) : (
                                                            <Avatar user={otherUser} />
                                                        )}
                                                        {data.isGroup && data.users.length > 3 && (
                                                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                                                                +{data.users.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xl font-bold text-gray-900">{title}</div>
                                                    <div className="text-sm text-gray-500">{statusText}</div>
                                                    <div className="mt-6 w-full rounded-lg bg-gray-50 p-4">
                                                        <dl className="space-y-4">
                                                            {data.isGroup && (
                                                                <div>
                                                                    <dt className="text-sm font-medium text-gray-500">Emails</dt>
                                                                    <dd className="mt-1 text-sm text-gray-900">
                                                                        {data.users.map((user) => user.email || 'No email').join(', ')}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            {!data.isGroup && otherUser && (
                                                                <div>
                                                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                                    <dd className="mt-1 text-sm text-gray-900">
                                                                        {otherUser.email || 'No email'}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                            {!data.isGroup && otherUser && (
                                                                <div>
                                                                    <dt className="text-sm font-medium text-gray-500">Joined</dt>
                                                                    <dd className="mt-1 text-sm text-gray-900">
                                                                        <time dateTime={joinedDate}>
                                                                            {joinedDate || 'Unknown'}
                                                                        </time>
                                                                    </dd>
                                                                </div>
                                                            )}
                                                        </dl>
                                                        <button
                                                            type="button"
                                                            className="mt-6 flex w-full items-center justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                            onClick={() => setConfirmOpen(true)}
                                                        >
                                                            <HiTrash size={20} className="mr-2" />
                                                            Delete conversation
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};