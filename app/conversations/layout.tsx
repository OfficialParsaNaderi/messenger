import GetConversations from "../actions/GetConversation";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationLayout({ children } : {children: React.ReactNode}) {
    const conversation = await GetConversations();

    return (
        <>
            <Sidebar>
                <div className="h-full">
                    <ConversationList initialItems={conversation} />
                    {children}
                </div>
            </Sidebar>
        </>
    )
}