// server.js or routes/message.js
import express from "express";
import weaviate from "weaviate-ts-client";
import { client } from "../config/db";

const router = express.Router();


// POST /api/message
router.post("/message", async (req, res) => {
  const { name, email, info, message } = req.body;

  if (!name || !email || !info || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const weaviateRes = await client.data
      .creator()
      .withClassName("Message")
      .withProperties({
        name,
        email,
        phone,
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .do();

    res.status(201).json({
      success: true,
      weaviateId: weaviateRes.id,
      message: "Message stored successfully",
    });
  } catch (err) {
    console.error("Weaviate insert error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
