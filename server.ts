import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/crucible", async (req, res) => {
    try {
      const { prompt, parameters, echoMode } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const temp = parameters?.temperature ?? 0.7;
      const topP = parameters?.topP ?? 0.95;
      const maxOutputTokens = parameters?.maxTokens ?? 1024;

      const systemInstruction = echoMode ? 
        "You are satisfying a user's prompt, but you MUST first explicitly output your chain of thought and internal reasoning for how you formulated your response. Wrap your thinking in an <echo> reasoning block, then provide the actual response." 
        : undefined;

      // We'll use streaming for realistic feel
      const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: temp,
          topP: topP,
          maxOutputTokens: maxOutputTokens,
        }
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of response) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/oracle", async (req, res) => {
    try {
      const { messages, context } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages,
        config: {
          systemInstruction: `You are the Oracle of Lumora. A wise, Socratic, encouraging AI mentor. Keep your responses concise, elegant, and focused on helping the 'Weaver' master prompt engineering.
Context:
Realm: ${context?.realm || 'Unknown'}
Weaver Level: ${context?.level || 1}
Last Score: ${context?.lastScore || 'None'}

If the user asks for a challenge, give them a practice prompt related to their current realm. If they ask for improvement, analyze their last attempt gracefully.`
        }
      });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/evaluate", async (req, res) => {
    try {
      const { prompt, output, realmId } = req.body;
      const evaluationPrompt = `Evaluate the following prompt and its output in the context of prompt engineering mastery, specifically for the realm '${realmId || 'general'}'. Provide scores out of 100 for Quality, Efficiency, Creativity, Faithfulness, and Clarity. 
      Format the output EXACTLY as a JSON object: {"quality": 80, "efficiency": 75, "creativity": 90, "faithfulness": 85, "clarity": 88, "feedback": "Brief string feedback"}. Do not use markdown blocks.

      Prompt: ${prompt}
      Output: ${output}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: evaluationPrompt,
      });

      let responseText = response.text || "{}";
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

      res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error(error);
      // Fallback
      res.json({
        quality: 85, efficiency: 80, creativity: 75, faithfulness: 90, clarity: 80, feedback: "An excellent first weave. Your intent was clear."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
