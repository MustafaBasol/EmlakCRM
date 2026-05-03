import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";
import {
  generateRealEstateContent,
  getAuthorizedListingForAi,
  saveAiGeneratedContent,
} from "@/lib/services/ai/real-estate-content-generator-service";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return true;

  current.count += 1;
  return false;
}

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

  if (isRateLimited(`${user.id}:${id}`)) {
    return NextResponse.json(
      { error: "Çok kısa sürede fazla istek gönderdiniz. Lütfen biraz bekleyin." },
      { status: 429 }
    );
  }

  try {
    const listing = await getAuthorizedListingForAi(id, user.role, user.id);
    if (!listing) {
      return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const shouldSave = body?.save === true;
    const result = await generateRealEstateContent(listing);
    const saved = shouldSave
      ? await saveAiGeneratedContent(id, result.provider, result.model, result.content)
      : null;

    return NextResponse.json({
      content: result.content,
      provider: result.provider,
      model: result.model,
      savedContentId: saved?.id ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI içerik üretilemedi.";
    const status = message.includes("yetkiniz") ? 403 : message.includes("API anahtarı") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
