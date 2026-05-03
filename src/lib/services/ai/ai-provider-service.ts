import { aiGeneratedContentSchema, type AiProviderResult } from "@/lib/services/ai/ai-content-types";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const OLLAMA_DEFAULT_BASE_URL = "http://localhost:11434";

function extractJsonText(text: string) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

export function parseAiContentJson(rawText: string) {
  const jsonText = extractJsonText(rawText);
  const parsed = JSON.parse(jsonText);
  return aiGeneratedContentSchema.parse(parsed);
}

async function generateWithGemini(prompt: string): Promise<AiProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.AI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error("Gemini API anahtarı tanımlı değil.");
  }

  const response = await fetch(`${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini content generation failed:", {
      status: response.status,
      statusText: response.statusText,
      body: errorBody.slice(0, 500),
    });
    throw new Error("AI içerik üretimi başarısız oldu.");
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text)
    .filter(Boolean)
    .join("\n");

  if (!rawText) {
    throw new Error("AI boş cevap döndürdü.");
  }

  return {
    content: parseAiContentJson(rawText),
    rawText,
    provider: "gemini",
    model,
  };
}

async function generateWithOllama(prompt: string): Promise<AiProviderResult> {
  const baseUrl = process.env.OLLAMA_BASE_URL || OLLAMA_DEFAULT_BASE_URL;
  const model = process.env.AI_MODEL || "gemma:2b";

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: "json",
      options: {
        temperature: 0.45,
        num_predict: 2600,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Ollama content generation failed:", {
      status: response.status,
      statusText: response.statusText,
      body: errorBody.slice(0, 500),
    });
    throw new Error("Ollama ile AI içerik üretimi başarısız oldu.");
  }

  const data = await response.json();
  const rawText = data?.response;

  if (!rawText || typeof rawText !== "string") {
    throw new Error("Ollama boş cevap döndürdü.");
  }

  return {
    content: parseAiContentJson(rawText),
    rawText,
    provider: "ollama",
    model,
  };
}

export async function generateAiContent(prompt: string): Promise<AiProviderResult> {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  switch (provider) {
    case "gemini":
      return generateWithGemini(prompt);
    case "ollama":
      return generateWithOllama(prompt);
    case "openrouter":
    case "groq":
    case "deepseek":
      throw new Error(`${provider} provider henüz yapılandırılmadı.`);
    default:
      throw new Error(`Desteklenmeyen AI provider: ${provider}`);
  }
}
