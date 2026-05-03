import { z } from "zod";

export const aiGeneratedContentSchema = z.object({
  longDescription: z.string().default(""),
  shortDescription: z.string().default(""),
  instagramPost: z.string().default(""),
  facebookPost: z.string().default(""),
  linkedinPost: z.string().default(""),
  whatsappMessage: z.string().default(""),
  storyTexts: z.array(z.string()).length(5).default(["", "", "", "", ""]),
  seoTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  hashtags: z.array(z.string()).length(15).default([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]),
  alternativeTitles: z.array(z.string()).length(3).default(["", "", ""]),
});

export type AiGeneratedContent = z.infer<typeof aiGeneratedContentSchema>;

export interface AiProviderResult {
  content: AiGeneratedContent;
  rawText: string;
  provider: string;
  model: string;
}

