import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateCode(prompt) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-codex", // or whatever Codex model is available
    messages: [{ role: "user", content: prompt }]
  });
  return completion.choices[0].message.content;
}
