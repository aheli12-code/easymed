import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { search } from "../rag/vectorstore.js";

export const chatRouter = Router();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SAFETY_SYSTEM_PROMPT = `You are EasyMed's symptom-checker assistant.
Rules:
- You NEVER provide a diagnosis or claim certainty about a condition.
- You ALWAYS recommend the user consult a licensed doctor for anything beyond
  general information, and explicitly for emergency symptoms.
- Ground your answer in the provided context snippets where relevant; if the
  context doesn't cover the question, say so rather than inventing facts.
- Keep responses concise and in plain language.`;

chatRouter.post("/", async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "`message` is required" });
    }

    const context = search(message);
    const contextBlock = context.length
      ? context.map((c) => `- ${c.text}`).join("\n")
      : "(no matching context found)";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: SAFETY_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Context:\n${contextBlock}\n\nUser question: ${message}`,
        },
      ],
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    res.json({ reply: text, groundedOn: context.map((c) => c.id) });
  } catch (err) {
    next(err);
  }
});
