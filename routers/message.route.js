import express from "express";
import Message from "../models/message.model.js";

const router = express.Router();


  router.post("/", async (req, res) => {
    const message = req.body;
    if (!message.name || !message.email || !message.phone || !message.message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      })
    }
  
    const newMessage = new Message(message);
  
    try {
      await newMessage.save();
      res.status(201).json({
        success: true,
        data: newMessage,
        message: "Message sent successfully"
      })
  
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Message not sent"
      })
  
    }
  });
  
  router.get('/', async (req, res) => {
    try {
      const messages = await Message.find({});
  
      res.status(200).json({
        success: true,
        data: messages
      });
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: "Server Error"
      });
  
    }
  })

  export default router;