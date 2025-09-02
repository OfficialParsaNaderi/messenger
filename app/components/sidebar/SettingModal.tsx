'use client';

import { User } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Image from "next/image";
import Button from "@/app/components/ui/button/Button";
import Input from "@/app/components/ui/inputs/Input";
import { toast } from "react-hot-toast";
import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Fragment } from 'react';

interface SettingModelProps {
    isOpen?: boolean;
    onClose: () => void;
    currentUser: User;
}

export default function SettingModel({ currentUser, isOpen, onClose }: SettingModelProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image,
        }
    });

    const image = watch('image');

    const handleUpload = (result: CloudinaryUploadWidgetResults) => {
        if (typeof result.info === 'object' && result.info !== null) {
            setValue('image', result.info.secure_url, { shouldDirty: true });
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/settings', data)
            .then(() => {
                router.refresh();
                toast.success('Profile successfully updated!');
                onClose();
            })
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
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

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="space-y-12">
                                        <div className="border-b border-gray-900/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                                Profile
                                            </h2>
                                            <p className="mt-1 text-sm leading-3 text-gray-600">
                                                Edit your public information.
                                            </p>
                                            <div className="mt-5 mb-5 flex flex-col gap-y-0">
                                                <Input
                                                    disabled={isLoading}
                                                    label="Name"
                                                    id="name"
                                                    errors={errors}
                                                    required
                                                    register={register}
                                                />
                                                <div>
                                                    <label className="block mt-5 text-sm font-medium leading-6 text-gray-900">
                                                        Photo
                                                    </label>
                                                    <div className="mt-2 flex items-center gap-x-3">
                                                        <Image
                                                            width="48"
                                                            height="48"
                                                            className="rounded-full"
                                                            src={image || currentUser?.image || '/images/PlaceHolder.png'}
                                                            alt="Avatar"
                                                        />
                                                        <CldUploadWidget onSuccess={handleUpload} uploadPreset="jynw04o0">
                                                            {({ open }) => {
                                                                return (
                                                                    <Button disabled={isLoading} secondary type="button" onClick={() => open?.()}>
                                                                        Change
                                                                    </Button>
                                                                );
                                                            }}
                                                        </CldUploadWidget>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-end gap-x-5">
                                        <Button disabled={isLoading} secondary onClick={onClose}>
                                            Cancel
                                        </Button>
                                        <Button disabled={isLoading} type="submit" fullWidth>
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};