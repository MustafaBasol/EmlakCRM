"use client";

import { useState } from "react";
import { Check, Clipboard, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AiGeneratedContent } from "@/lib/services/ai/ai-content-types";

interface AiContentGeneratorProps {
  propertyId: string;
  onApplyDescription?: (description: string) => void;
}

type CopyKey = keyof AiGeneratedContent | "hashtagsText" | "storyTextsText" | "alternativeTitlesText";

function formatList(items: string[]) {
  return items.filter(Boolean).join("\n");
}

function ContentBlock({
  title,
  value,
  copyKey,
  copiedKey,
  onCopy,
}: {
  title: string;
  value: string;
  copyKey: CopyKey;
  copiedKey: CopyKey | null;
  onCopy: (key: CopyKey, value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[#0F172A]">{title}</h4>
        <Button type="button" size="sm" variant="outline" onClick={() => onCopy(copyKey, value)}>
          {copiedKey === copyKey ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
          Kopyala
        </Button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-6 text-[#475569]">{value || "-"}</p>
    </div>
  );
}

export function AiContentGenerator({ propertyId, onApplyDescription }: AiContentGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<AiGeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<CopyKey | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/properties/${propertyId}/generate-ai-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ save: true }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "AI içerik üretilemedi.");
      }

      setContent(data.content);
      toast.success("AI içerik üretildi.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI içerik üretilemedi.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(key: CopyKey, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
      toast.success("İçerik kopyalandı.");
    } catch {
      toast.error("Kopyalama başarısız oldu.");
    }
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>AI İçerik Üretici</CardTitle>
        <Button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          AI ile İçerik Üret
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {loading && (
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-6 text-sm text-[#475569]">
            İçerikler hazırlanıyor...
          </div>
        )}

        {content && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onApplyDescription?.(content.longDescription)}
                disabled={!onApplyDescription}
              >
                İlan açıklamasına uygula
              </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ContentBlock
                title="Uzun ilan açıklaması"
                value={content.longDescription}
                copyKey="longDescription"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="Kısa ilan açıklaması"
                value={content.shortDescription}
                copyKey="shortDescription"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="Instagram postu"
                value={content.instagramPost}
                copyKey="instagramPost"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="Facebook postu"
                value={content.facebookPost}
                copyKey="facebookPost"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="LinkedIn postu"
                value={content.linkedinPost}
                copyKey="linkedinPost"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="WhatsApp mesajı"
                value={content.whatsappMessage}
                copyKey="whatsappMessage"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="Story metinleri"
                value={formatList(content.storyTexts)}
                copyKey="storyTextsText"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="SEO başlık"
                value={content.seoTitle}
                copyKey="seoTitle"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="Meta açıklama"
                value={content.metaDescription}
                copyKey="metaDescription"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="Hashtagler"
                value={content.hashtags.filter(Boolean).join(" ")}
                copyKey="hashtagsText"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <ContentBlock
                title="Alternatif başlıklar"
                value={formatList(content.alternativeTitles)}
                copyKey="alternativeTitlesText"
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
