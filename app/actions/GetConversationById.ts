import prisma from "@/app/libs/prisma_db";
import GetCurrentUser from "./GetCurrentUser";

const GetConversationById = async (conversationId: string) => {
    console.log(`\n--- [DEBUG] Starting GetConversationById for ID: ${conversationId} ---`);

    try {
        if (!conversationId) {
            console.log("[DEBUG] FAILED: No conversationId was provided.");
            return null;
        }

        const currentUser = await GetCurrentUser();

        if (!currentUser?.email) {
            console.log("[DEBUG] FAILED at Step 1: Current user not found or has no email (User not logged in).");
            return null;
        }
        console.log(`[DEBUG] Step 1 PASSED: Found current user -> ${currentUser.email}`);

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        });

        if (!conversation) {
            console.log("[DEBUG] FAILED at Step 2: Conversation with this ID not found in the database.");
            return null;
        }
        const participantEmails = conversation.users.map(user => user.email).join(', ');
        console.log(`[DEBUG] Step 2 PASSED: Found conversation. Participants are: [${participantEmails}]`);

        const isMember = conversation.users.some(
            (user) => user.email === currentUser.email
        );

        if (!isMember) {
            console.log("[DEBUG] FAILED at Step 3: Security Check Failed. The current user is NOT a member of this conversation.");
            return null;
        }
        
        console.log("[DEBUG] Step 3 PASSED: Security check passed. User is a member.");
        console.log("--- [DEBUG] Function finished successfully. Returning conversation. ---\n");
        return conversation;
        
    } catch (error) {
        console.error("[DEBUG] CRITICAL ERROR in try-catch block:", error);
        return null;
    }
};

export default GetConversationById;