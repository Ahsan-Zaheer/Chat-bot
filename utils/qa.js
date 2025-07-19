import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

export const qa = async (question, history = [], modelChoice = "gpt-4o", webContent = "") => {
  if (!question || typeof question !== "string") {
    throw new Error("Invalid question provided.");
  }

  const chatHistory = new ChatMessageHistory();

  if (webContent) {
    await chatHistory.addSystemMessage(`Website content:\n${webContent}`);
  }

  for (const msg of history) {
    if (msg.role === 'user') {
      await chatHistory.addUserMessage(msg.text);
    } else if (msg.role === 'bot') {
      await chatHistory.addAIChatMessage(msg.text);
    }
  }

  await chatHistory.addSystemMessage('When responding, include the chat history, the website content, and the user message.');

  const memory = new BufferMemory({ chatHistory, returnMessages: true });
  let model;
  if (modelChoice === 'gemini') {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("Missing GOOGLE_API_KEY");
    }
    model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0,
    });
  } else {
    model = new ChatOpenAI({
      temperature: 0,
      modelName: 'gpt-4o-mini',
      apiKey: process.env.OPEN_AI_KEY,
    });
  }

  const chain = new ConversationChain({ llm: model, memory });

  try {
    const res = await chain.call({ input: question });
    return res.response;
  } catch (error) {
    console.error('Error during QA processing:', error);
    throw new Error('Failed to process the question. Please try again.');
  }
};
