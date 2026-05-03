import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  MapPin,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import { authOptions } from "@/lib/auth/auth-options";
import { getListingById } from "@/lib/queries/listings/get-listings";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { ListingPhotoGallery } from "@/components/listings/listing-photo-gallery";
import { listingStatusLabels, propertyTypeLabels } from "@/lib/constants/enum-labels";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const user = session.user as any;

  const listing = await getListingById(id, user.role, user.id);
  if (!listing) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/properties" className="hover:text-foreground">
          Portföyler
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="max-w-[200px] truncate text-foreground">{listing.title}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/properties" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{listing.title}</h2>
        </div>
        <Link href={`/dashboard/properties/${listing.id}/edit`} className={cn(buttonVariants())}>
          <Pencil className="mr-2 h-4 w-4" /> Düzenle
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mülk Özeti</CardTitle>
              <Badge>{listingStatusLabels[listing.status]}</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Fiyat</p>
                  <p className="text-lg font-bold">{formatCurrency(listing.price)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Tip</p>
                  <p className="text-lg font-bold">{propertyTypeLabels[listing.propertyType]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Alan</p>
                  <p className="text-lg font-bold">{listing.areaSizeM2?.toString() || "-"} m²</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Oda</p>
                  <p className="text-lg font-bold">{listing.roomCount || "-"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4 text-slate-500" /> Konum
                </h4>
                <p className="text-slate-600">
                  {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
                  {listing.district}, {listing.city}
                </p>
                <p className="text-sm text-muted-foreground">{listing.addressText}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Açıklama</h4>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-600">
                  {listing.description || "Açıklama girilmemiş."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fotoğraflar</CardTitle>
            </CardHeader>
            <CardContent>
              <ListingPhotoGallery photos={listing.photos} title={listing.title} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İlan Yönetimi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Atanan Danışman</p>
                  <p className="font-bold">{listing.assignedAgent?.fullName || "-"}</p>
                  {listing.assignedAgent?.phone && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" /> {listing.assignedAgent.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Oluşturulma
                  </span>
                  <span className="font-medium">{formatDate(listing.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> Ada / Parsel
                  </span>
                  <span className="font-medium">
                    {listing.islandNo || "-"}/{listing.parcelNo || "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
