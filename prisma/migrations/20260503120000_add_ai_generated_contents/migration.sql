-- CreateTable
CREATE TABLE "ai_generated_contents" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "instagramPost" TEXT NOT NULL,
    "facebookPost" TEXT NOT NULL,
    "linkedinPost" TEXT NOT NULL,
    "whatsappMessage" TEXT NOT NULL,
    "storyTexts" JSONB NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "hashtags" JSONB NOT NULL,
    "alternativeTitles" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_generated_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_generated_contents_propertyId_idx" ON "ai_generated_contents"("propertyId");

-- AddForeignKey
ALTER TABLE "ai_generated_contents" ADD CONSTRAINT "ai_generated_contents_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
