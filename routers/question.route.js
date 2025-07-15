import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

const router = express.Router();

const qa = async (question, history = []) => {
    if (!question || typeof question !== "string") {
        throw new Error("Invalid question provided.");
    }

    const chatHistory = new ChatMessageHistory();
    for (const msg of history) {
        if (msg.role === 'user') {
            await chatHistory.addUserMessage(msg.text);
        } else if (msg.role === 'bot') {
            await chatHistory.addAIChatMessage(msg.text);
        }
    }

    const memory = new BufferMemory({ chatHistory, returnMessages: true });
    const model = new ChatOpenAI({
        temperature: 0,
        modelName: 'gpt-4o-mini',
        apiKey: process.env.OPEN_AI_KEY
    });

    const chain = new ConversationChain({ llm: model, memory });

    try {
        const res = await chain.call({ input: question });
        return res.response;
    } catch (error) {
        console.error("Error during QA processing:", error);
        throw new Error("Failed to process the question. Please try again.");
    }
};

router.post("/", async (req, res) => {
    const { question, conversation } = req.body;

    try {
        if (!question) {
            throw new Error("Question is required.");
        }
        
        const answer = await qa(question, Array.isArray(conversation) ? conversation : []);
        res.status(201).json({
            success: true,
            data: answer,
            message: "Question resolved successfully"
        });
    } catch (error) {
        console.error("Error in route:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Question not resolved"
        });
    }
});

export default router;
