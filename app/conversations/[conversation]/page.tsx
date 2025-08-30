import GetConversationById from "@/app/actions/GetConversationById";
import GetMessages from "@/app/actions/GetMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface IParams {
    conversation: string;
}

const ConversationPage = async ({ params }: { params: IParams }) => {

    const conversation = await GetConversationById(params.conversation);
    const messages = await GetMessages(params.conversation);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        );
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    );
}

export default ConversationPage;