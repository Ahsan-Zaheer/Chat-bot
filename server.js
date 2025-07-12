import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import messageRoutes from "./routers/message.route.js";
import questionRoute from "./routers/question.route.js";
import cors from "cors";





dotenv.config();



const app = express();

app.use(express.json());

app.use(cors({
  origin: '*', // Allow Vite dev server origin
}));



app.use("/api/message", messageRoutes);
app.use("/api/question", questionRoute);



app.listen(3000, () => {
  connectDB();
  console.log("Server is running on http://localhost:3000");
});

