import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { loadQARefineChain } from "langchain/chains";
import { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from '@langchain/openai';

const router = express.Router();

const qa = async (question, contextMessages = []) => {
    // Ensure that the question is valid
    if (!question || typeof question !== "string") {
        throw new Error("Invalid question provided.");
    }

    const content = `You are a helpful AI assistant for ${contextMessages.slice(0, 3).join(" ")}`;

    const docs = [new Document({
        pageContent: content,
    })];

    const model = new ChatOpenAI({
        temperature: 0,
        modelName: 'gpt-4o-mini',
        apiKey: process.env.OPEN_AI_KEY
    });

    const chain = loadQARefineChain(model);
    
    // Embeddings creation
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPEN_AI_KEY
    });

    try {
        // MemoryVectorStore expects an array of documents
        const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

        // Perform similarity search using the question
        const relevantDocs = await store.similaritySearch(question);

        if (relevantDocs.length === 0) {
            return "No relevant documents found to answer the question.";
        }

        const res = await chain.invoke({
            input_documents: relevantDocs,
            question,
        });

        return res.output_text;

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
