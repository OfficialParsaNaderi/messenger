'use client';

import useConversation from "@/app/hooks/useConversation";
import { useEffect, useRef, useState } from "react";
import { FullMessageType } from "@/app/types";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
    initialMessages: FullMessageType[];
}

export default function Body({ initialMessages }: BodyProps) {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRof = useRef<HTMLDivElement>(null);
    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        bottomRof?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);

        const HandleMessage = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);
            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }
                return [...current, message];
            });
        };

        const HandleUpdate = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id) {
                    return newMessage;
                }
                return currentMessage;
            }));
        };

        pusherClient.bind('message:new', HandleMessage);
        pusherClient.bind('message:update', HandleUpdate);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('message:new', HandleMessage);
            pusherClient.unbind('message:update', HandleUpdate);
        };
    }, [conversationId, messages]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox isLast={i === messages.length - 1} key={message.id} data={message} />
            ))}
            <div ref={bottomRof} className="pt-24" />
        </div>
    );
};