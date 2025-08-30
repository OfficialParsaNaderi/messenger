'use client';

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiMiniPaperAirplane, HiMiniPaperClip } from "react-icons/hi2";
import MessageInput from "./MessageInput";

import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';

export default function Form() {
    const { conversationId } = useConversation();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });
        axios.post('/api/messages', {
            ...data,
            conversationId
        });
    };

    const HandleUpload = (result: CloudinaryUploadWidgetResults) => {
        if (typeof result.info === 'object' && result.info !== null) {
            axios.post('/api/messages', {
                image: result.info.secure_url,
                conversationId
            });
        }
    };

    return (
        <>
            <div className="py-4 px-4 bg-white border-t border-gray-200 flex items-center gap-2 lg:gap-4 w-full">
                <CldUploadButton
                    options={{ maxFiles: 2 }}
                    onSuccess={HandleUpload}
                    uploadPreset="jynw04o0"
                >
                    <HiMiniPaperClip size={28} className="text-black " />
                </CldUploadButton>
                <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
                    <MessageInput id="message" register={register} errors={errors} required placeholder="Type a message" />
                    <button type="submit" className="bg-black hover:bg-black text-white font-bold py-2 px-2 rounded-full transition">
                        <HiMiniPaperAirplane size={24} />
                    </button>
                </form>
            </div>
        </>
    );
};