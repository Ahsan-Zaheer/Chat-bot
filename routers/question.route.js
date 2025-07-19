import express from "express";
import { qa } from "../utils/qa.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { question, conversation, model, webContent } = req.body;

    try {
        if (!question) {
            throw new Error("Question is required.");
        }
        
        const answer = await qa(
            question,
            Array.isArray(conversation) ? conversation : [],
            typeof model === 'string' ? model : 'gpt-4o',
            typeof webContent === 'string' ? webContent : ''
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
