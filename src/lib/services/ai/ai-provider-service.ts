import { aiGeneratedContentSchema, type AiProviderResult } from "@/lib/services/ai/ai-content-types";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

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

export async function generateAiContent(prompt: string): Promise<AiProviderResult> {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  switch (provider) {
    case "gemini":
      return generateWithGemini(prompt);
    case "openrouter":
    case "groq":
    case "deepseek":
    case "ollama":
      throw new Error(`${provider} provider henüz yapılandırılmadı.`);
    default:
      throw new Error(`Desteklenmeyen AI provider: ${provider}`);
  }
}

