import { Listing, Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/db/db";
import { propertyTypeLabels } from "@/lib/constants/enum-labels";
import { generateAiContent } from "@/lib/services/ai/ai-provider-service";
import type { AiGeneratedContent } from "@/lib/services/ai/ai-content-types";

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

  return `Sen profesyonel bir emlak pazarlama ve sosyal medya içerik uzmanısın.

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

Kurallar:
- Kesin yatırım getirisi, garanti kazanç, kesin değer artışı gibi yasal risk oluşturabilecek ifadeler kullanma.
- Gerçek olmayan özellik ekleme.
- Eksik bilgileri uydurma.
- Emlak ilanına uygun profesyonel ve güven veren bir dil kullan.
- Sosyal medya metinlerinde emoji ölçülü kullan.
- Metinler Türkçe olsun.
- Cevabı sadece geçerli JSON olarak döndür.
- Markdown kullanma.
- JSON dışında açıklama yazma.

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

export async function getAuthorizedListingForAi(propertyId: string, role: UserRole, userId: string) {
  const listing = await prisma.listing.findUnique({ where: { id: propertyId } });
  if (!listing) return null;

  if (role === UserRole.AGENT && listing.assignedAgentId !== userId) {
    throw new Error("Bu ilan için yetkiniz yok.");
  }

  return listing;
}

export async function generateRealEstateContent(listing: ListingForAi) {
  return generateAiContent(buildPrompt(listing));
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
