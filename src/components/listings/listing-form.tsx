"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListingStatus, PropertyType } from "@prisma/client";
import {
  createListingAction,
  updateListingAction,
} from "@/server/actions/listing-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { AgentAssigneeSelect } from "@/components/listings/agent-assignee-select";
import { AiContentGenerator } from "@/components/listings/ai-content-generator";
import {
  listingStatusLabels,
  propertyTypeLabels,
} from "@/lib/constants/enum-labels";

interface AgentOption {
  id: string;
  fullName: string;
  email: string;
}

interface ListingFormProps {
  initialData?: any;
  isAdmin: boolean;
  agents?: AgentOption[];
}

export function ListingForm({
  initialData,
  isAdmin,
  agents = [],
}: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
  const existingPhotos = initialData?.photos ?? [];
  const propertyTypeItems = Object.values(PropertyType).map((type) => ({
    value: type,
    label: propertyTypeLabels[type],
  }));
  const statusItems = Object.values(ListingStatus).map((status) => ({
    value: status,
    label: listingStatusLabels[status],
  }));

  useEffect(() => {
    return () => {
      for (const preview of newPhotoPreviews) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [newPhotoPreviews]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (initialData) {
        await updateListingAction(initialData.id, formData);
        toast.success("Portföy başarıyla güncellendi.");
      } else {
        await createListingAction(formData);
        toast.success("Yeni portföy başarıyla oluşturuldu.");
      }

      router.push("/dashboard/properties");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    for (const preview of newPhotoPreviews) {
      URL.revokeObjectURL(preview);
    }

    const files = Array.from(event.target.files ?? []);
    setNewPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                İlan Başlığı
              </label>
              <Input
                name="title"
                required
                defaultValue={initialData?.title ?? ""}
                placeholder="Örn: Boğaz manzaralı lüks villa"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Açıklama
              </label>
              <Textarea
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Mülk hakkında detaylı bilgi girin..."
                className="min-h-[140px]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">
                  Mülk Tipi
                </label>
                <Select
                  name="propertyType"
                  items={propertyTypeItems}
                  defaultValue={
                    initialData?.propertyType ?? PropertyType.APARTMENT
                  }
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {propertyTypeItems.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">
                  Durum
                </label>
                <Select
                  name="status"
                  items={statusItems}
                  defaultValue={initialData?.status ?? ListingStatus.DRAFT}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {statusItems.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">
                  Fiyat (TL)
                </label>
                <Input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  defaultValue={initialData?.price ?? ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Özellikler</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Alan (m²)
              </label>
              <Input
                name="areaSizeM2"
                type="number"
                min="0"
                step="0.01"
                defaultValue={initialData?.areaSizeM2 ?? ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Oda Sayısı
              </label>
              <Input
                name="roomCount"
                type="number"
                min="0"
                step="1"
                defaultValue={initialData?.roomCount ?? ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Banyo Sayısı
              </label>
              <Input
                name="bathroomCount"
                type="number"
                min="0"
                step="1"
                defaultValue={initialData?.bathroomCount ?? ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Bina Yaşı
              </label>
              <Input
                name="buildingAge"
                type="number"
                min="0"
                step="1"
                defaultValue={initialData?.buildingAge ?? ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Konum</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Şehir
              </label>
              <Input name="city" defaultValue={initialData?.city ?? ""} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                İlçe
              </label>
              <Input name="district" defaultValue={initialData?.district ?? ""} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Mahalle
              </label>
              <Input
                name="neighborhood"
                defaultValue={initialData?.neighborhood ?? ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Ada No
              </label>
              <Input name="islandNo" defaultValue={initialData?.islandNo ?? ""} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Parsel No
              </label>
              <Input name="parcelNo" defaultValue={initialData?.parcelNo ?? ""} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Enlem
              </label>
              <Input
                name="latitude"
                type="number"
                step="0.000001"
                defaultValue={initialData?.latitude ?? ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Boylam
              </label>
              <Input
                name="longitude"
                type="number"
                step="0.000001"
                defaultValue={initialData?.longitude ?? ""}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#0F172A]">
                Açık Adres
              </label>
              <Textarea
                name="addressText"
                defaultValue={initialData?.addressText ?? ""}
                placeholder="Adres detayını girin..."
                className="min-h-[96px]"
              />
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="relative z-20 overflow-visible md:col-span-2">
            <CardHeader>
              <CardTitle>Yönetim</CardTitle>
            </CardHeader>
            <CardContent className="overflow-visible">
              <AgentAssigneeSelect
                agents={agents}
                defaultValue={initialData?.assignedAgentId ?? ""}
              />
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fotoğraflar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center transition-colors hover:border-[#1D4ED8] hover:bg-[#EFF6FF]">
              <div className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
                <ImagePlus className="h-7 w-7 text-[#1D4ED8]" />
              </div>
              <p className="font-semibold text-[#0F172A]">
                {initialData
                  ? "Galeriye yeni fotoğraflar ekleyin"
                  : "Portföy fotoğraflarını yükleyin"}
              </p>
              <p className="mt-1 text-sm text-[#64748B]">
                JPG, PNG veya WEBP. Birden fazla dosya seçebilirsiniz.
              </p>
              <input
                type="file"
                name="photos"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            {existingPhotos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#0F172A]">
                  Mevcut Fotoğraflar
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {existingPhotos.map((photo: any) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={initialData?.title ?? "Portföy fotoğrafı"}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newPhotoPreviews.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#0F172A]">
                  Yeni Seçilen Fotoğraflar
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {newPhotoPreviews.map((preview) => (
                    <div
                      key={preview}
                      className="overflow-hidden rounded-xl border border-[#BFDBFE] bg-[#EFF6FF]"
                    >
                      <img
                        src={preview}
                        alt="Yeni portföy fotoğrafı"
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {initialData?.id && (
          <AiContentGenerator
            propertyId={initialData.id}
            onApplyDescription={setDescription}
          />
        )}
      </div>

      <div className="flex justify-end gap-4 border-t border-[#E2E8F0] pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          İptal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Kaydediliyor..."
            : initialData
              ? "Değişiklikleri Kaydet"
              : "Portföyü Oluştur"}
        </Button>
      </div>
    </form>
  );
}
