import express from "express";
import dotenv from "dotenv";

import messageRoutes from "./routers/message.route.js";
import questionRoute from "./routers/question.route.js";
import chatRoute from "./routers/chat.route.js";
import cors from "cors";





dotenv.config();



const app = express();

app.use(express.json());

app.use(cors({
  origin: '*', // Allow Vite dev server origin
}));

// app.use(cors({
//   origin: ['https://www.geniusai.biz'], // allow only this origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));



app.use("/api/message", messageRoutes);
app.use("/api/question", questionRoute);
app.use("/api/chat", chatRoute);



app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

