import { Listing, Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/db/db";
import { propertyTypeLabels } from "@/lib/constants/enum-labels";
import { generateAiContent } from "@/lib/services/ai/ai-provider-service";
import type { AiGeneratedContent, AiProviderResult } from "@/lib/services/ai/ai-content-types";

type ListingForAi = Listing;

function valueOrMissing(value: unknown) {
  if (value === null || value === undefined || value === "") return "belirtilmedi";
  if (typeof value === "number" && Number.isNaN(value)) return "belirtilmedi";
  return String(value);
}

function formatDecimal(value: Prisma.Decimal | null) {
  if (!value) return "belirtilmedi";
  return value.toString();
}

function buildPrompt(listing: ListingForAi) {
  const location = [listing.city, listing.district, listing.neighborhood]
    .map(valueOrMissing)
    .join(" / ");

  return `Sen profesyonel bir emlak pazarlama, ilan metni yazarlığı, SEO ve sosyal medya içerik uzmanısın.

Aşağıdaki ilan bilgilerine göre Türkçe, doğal, ikna edici ama abartısız içerikler üret.

İlan bilgileri:
- İlan tipi: belirtilmedi
- Emlak tipi: ${propertyTypeLabels[listing.propertyType] ?? listing.propertyType}
- İlan başlığı: ${valueOrMissing(listing.title)}
- Konum: ${location}
- Adres: ${valueOrMissing(listing.addressText)}
- Oda sayısı: ${valueOrMissing(listing.roomCount)}
- Metrekare: ${formatDecimal(listing.areaSizeM2)}
- Fiyat: ${formatDecimal(listing.price)} TL
- Kat bilgisi: belirtilmedi
- Bina yaşı: ${valueOrMissing(listing.buildingAge)}
- Banyo sayısı: ${valueOrMissing(listing.bathroomCount)}
- Balkon: belirtilmedi
- Otopark: belirtilmedi
- Asansör: belirtilmedi
- Isıtma tipi: belirtilmedi
- Eşyalı durumu: belirtilmedi
- Ada / parsel: ${valueOrMissing(listing.islandNo)} / ${valueOrMissing(listing.parcelNo)}
- Öne çıkan özellikler: belirtilmedi
- Mevcut açıklama: ${valueOrMissing(listing.description)}

Zorunlu kalite kuralları:
- Bütün metinler Türkçe olmalı. İngilizce cümle, İngilizce başlık, "Introducing", "Move right in", "ApartmentForSale", "ModernLiving" gibi İngilizce pazarlama ifadeleri kullanma.
- Markdown, görsel placeholder, image.jpg, ![](), ## başlık formatı veya JSON dışında metin kullanma.
- "belirtilmedi" olan bilgileri metinde hiç anma; bilinmeyen özellikleri uydurma.
- Kesin yatırım getirisi, garanti kazanç, kesin değer artışı gibi yasal risk oluşturabilecek ifadeler kullanma.
- Gerçek olmayan özellik ekleme.
- Eksik bilgileri uydurma.
- Emlak ilanına uygun profesyonel, güven veren, modern ve satış odaklı bir dil kullan.
- Sosyal medya metinlerinde emoji ölçülü kullan.
- Cevabı sadece geçerli JSON olarak döndür.
- Markdown kullanma.
- JSON dışında açıklama yazma.

Alan uzunlukları:
- longDescription: 3-5 paragraf, en az 900 karakter. Konum, fiyat, metrekare, oda sayısı ve varsa mevcut açıklamayı doğal şekilde işle. Müşteriyi iletişime geçmeye davet eden profesyonel kapanış ekle.
- shortDescription: 180-260 karakter, tek paragraf.
- instagramPost: 450-700 karakter, sıcak ve dikkat çekici Türkçe metin, 2-4 ölçülü emoji, net iletişim çağrısı.
- facebookPost: 450-750 karakter, daha açıklayıcı ve samimi Türkçe metin.
- linkedinPost: 400-650 karakter, daha kurumsal ve profesyonel Türkçe ton.
- whatsappMessage: 220-380 karakter, danışmanın müşteriye direkt gönderebileceği kısa ve net Türkçe mesaj.
- storyTexts: Tam 5 adet; her biri 60-120 karakter, kısa story cümlesi.
- seoTitle: 50-65 karakter, Türkçe ve ilan odaklı.
- metaDescription: 140-160 karakter, Türkçe SEO açıklaması.
- hashtags: Tam 15 adet; hepsi # ile başlasın, Türkçe veya emlak sektöründe doğal kullanılan etiketler olsun.
- alternativeTitles: Tam 3 adet; her biri 35-80 karakter, ilanın gerçek bilgilerine dayalı Türkçe başlık.

JSON formatı:

{
  "longDescription": "",
  "shortDescription": "",
  "instagramPost": "",
  "facebookPost": "",
  "linkedinPost": "",
  "whatsappMessage": "",
  "storyTexts": ["", "", "", "", ""],
  "seoTitle": "",
  "metaDescription": "",
  "hashtags": ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  "alternativeTitles": ["", "", ""]
}`;
}

function hasEnglishMarketingLanguage(value: string) {
  return /\b(apartment|for sale|introducing|move right|modern living|city views|don't miss|breathtaking|amenities|property investment|lifestyle)\b/i.test(
    value
  );
}

function collectQualityIssues(content: AiGeneratedContent) {
  const issues: string[] = [];
  const combinedText = [
    content.longDescription,
    content.shortDescription,
    content.instagramPost,
    content.facebookPost,
    content.linkedinPost,
    content.whatsappMessage,
    content.metaDescription,
    content.seoTitle,
    ...content.storyTexts,
    ...content.hashtags,
    ...content.alternativeTitles,
  ].join(" ");

  if (content.longDescription.trim().length < 700) issues.push("longDescription çok kısa; en az 900 karakter olmalı.");
  if (content.shortDescription.trim().length < 140) issues.push("shortDescription çok kısa.");
  if (content.instagramPost.trim().length < 320) issues.push("instagramPost çok kısa.");
  if (content.facebookPost.trim().length < 320) issues.push("facebookPost çok kısa.");
  if (content.linkedinPost.trim().length < 280) issues.push("linkedinPost çok kısa.");
  if (content.whatsappMessage.trim().length < 160) issues.push("whatsappMessage çok kısa.");
  if (content.storyTexts.some((item) => item.trim().length < 45)) issues.push("storyTexts içinde çok kısa veya boş metin var.");
  if (content.hashtags.filter((item) => item.trim().startsWith("#")).length < 15) {
    issues.push("hashtags tam 15 adet # ile başlayan etiket içermeli.");
  }
  if (content.alternativeTitles.some((item) => item.trim().length < 25)) {
    issues.push("alternativeTitles içinde çok kısa veya boş başlık var.");
  }
  if (hasEnglishMarketingLanguage(combinedText)) issues.push("Çıktıda İngilizce pazarlama ifadeleri var; tüm metinler Türkçe olmalı.");
  if (/!\[|\]\(|image\.jpg|#{2,}/i.test(combinedText)) issues.push("Markdown veya görsel placeholder kullanılmış.");

  return issues;
}

function buildRevisionPrompt(originalPrompt: string, content: AiGeneratedContent, issues: string[]) {
  return `${originalPrompt}

Önceki cevabın kalite kontrolünden geçmedi.

Hatalar:
${issues.map((issue) => `- ${issue}`).join("\n")}

Önceki JSON:
${JSON.stringify(content)}

Şimdi aynı ilan için tüm alanları yeniden yaz.
Kısa özet üretme; belirtilen minimum uzunluklara uy.
Tüm metinler sadece Türkçe olsun.
Eksik bilgileri uydurma.
Cevabı sadece geçerli JSON olarak döndür.`;
}

export async function getAuthorizedListingForAi(propertyId: string, role: UserRole, userId: string) {
  const listing = await prisma.listing.findUnique({ where: { id: propertyId } });
  if (!listing) return null;

  if (role === UserRole.AGENT && listing.assignedAgentId !== userId) {
    throw new Error("Bu ilan için yetkiniz yok.");
  }

  return listing;
}

export async function generateRealEstateContent(listing: ListingForAi) {
  const prompt = buildPrompt(listing);
  const firstResult = await generateAiContent(prompt);
  const issues = collectQualityIssues(firstResult.content);

  if (issues.length === 0) {
    return firstResult;
  }

  const revisedResult = await generateAiContent(buildRevisionPrompt(prompt, firstResult.content, issues));
  return {
    ...revisedResult,
    rawText: `${firstResult.rawText}\n\n---REVISION---\n\n${revisedResult.rawText}`,
  } satisfies AiProviderResult;
}

export async function saveAiGeneratedContent(propertyId: string, provider: string, model: string, content: AiGeneratedContent) {
  return prisma.aiGeneratedContent.create({
    data: {
      propertyId,
      provider,
      model,
      longDescription: content.longDescription,
      shortDescription: content.shortDescription,
      instagramPost: content.instagramPost,
      facebookPost: content.facebookPost,
      linkedinPost: content.linkedinPost,
      whatsappMessage: content.whatsappMessage,
      storyTexts: content.storyTexts,
      seoTitle: content.seoTitle,
      metaDescription: content.metaDescription,
      hashtags: content.hashtags,
      alternativeTitles: content.alternativeTitles,
    },
  });
}
