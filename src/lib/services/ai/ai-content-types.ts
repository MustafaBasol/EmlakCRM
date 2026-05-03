import { z } from "zod";

function normalizeStringArray(value: unknown, length: number) {
  const items = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, index) => {
    const item = items[index];
    return typeof item === "string" ? item : item == null ? "" : String(item);
  });
}

export const aiGeneratedContentSchema = z.object({
  longDescription: z.string().default(""),
  shortDescription: z.string().default(""),
  instagramPost: z.string().default(""),
  facebookPost: z.string().default(""),
  linkedinPost: z.string().default(""),
  whatsappMessage: z.string().default(""),
  storyTexts: z.preprocess((value) => normalizeStringArray(value, 5), z.array(z.string()).length(5)),
  seoTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  hashtags: z.preprocess((value) => normalizeStringArray(value, 15), z.array(z.string()).length(15)),
  alternativeTitles: z.preprocess((value) => normalizeStringArray(value, 3), z.array(z.string()).length(3)),
});

export type AiGeneratedContent = z.infer<typeof aiGeneratedContentSchema>;

export interface AiProviderResult {
  content: AiGeneratedContent;
  rawText: string;
  provider: string;
  model: string;
}
