import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

const router = express.Router();

const qa = async (question, history = [], modelChoice = "gpt-4o") => {
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
    let model;
    if (modelChoice === 'gemini') {
         if (!process.env.GOOGLE_API_KEY) {
        throw new Error("Missing GOOGLE_API_KEY");
    }
        model = new ChatGoogleGenerativeAI({
            model: 'gemini-pro',
            apiKey: process.env.GOOGLE_API_KEY,
            temperature: 0,
        });
    } else {
        model = new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4o-mini',
            apiKey: process.env.OPEN_AI_KEY
        });
    }

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
    const { question, conversation, model } = req.body;

    try {
        if (!question) {
            throw new Error("Question is required.");
        }
        
        const answer = await qa(
            question,
            Array.isArray(conversation) ? conversation : [],
            typeof model === 'string' ? model : 'gpt-4o'
        );
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
