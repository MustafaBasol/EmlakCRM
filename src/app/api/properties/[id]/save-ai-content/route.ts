import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";
import { aiGeneratedContentSchema } from "@/lib/services/ai/ai-content-types";
import {
  getAuthorizedListingForAi,
  saveAiGeneratedContent,
} from "@/lib/services/ai/real-estate-content-generator-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, ctx: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const user = session.user as { id: string; role: "ADMIN" | "AGENT" };

  try {
    const listing = await getAuthorizedListingForAi(id, user.role, user.id);
    if (!listing) {
      return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
    }

    const body = await request.json();
    const content = aiGeneratedContentSchema.parse(body.content);
    const provider = typeof body.provider === "string" ? body.provider : process.env.AI_PROVIDER || "gemini";
    const model = typeof body.model === "string" ? body.model : process.env.AI_MODEL || "gemma:2b";
    const saved = await saveAiGeneratedContent(id, provider, model, content);

    return NextResponse.json({ id: saved.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI içerik kaydedilemedi.";
    const status = message.includes("yetkiniz") ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
