"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ListingStatus, PropertyType } from "@prisma/client";

export function ListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.replace(pathname);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Portfory ara (başlık, bölge...)"
          className="pl-9"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          defaultValue={searchParams.get("status")?.toString() || "all"}
          onValueChange={(v) => handleFilterChange("status", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sayı: Tümü</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="DRAFT">Taslak</SelectItem>
            <SelectItem value="RESERVED">Rezerve</SelectItem>
            <SelectItem value="SOLD">Satıldı</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("type")?.toString() || "all"}
          onValueChange={(v) => handleFilterChange("type", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Mülk Tipi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tip: Tümü</SelectItem>
            <SelectItem value="APARTMENT">Daire</SelectItem>
            <SelectItem value="VILLA">Villa</SelectItem>
            <SelectItem value="LAND">Arsa</SelectItem>
            <SelectItem value="COMMERCIAL">Ticari</SelectItem>
          </SelectContent>
        </Select>

        {searchParams.toString() && (
          <Button variant="ghost" onClick={clearFilters} className="px-2">
            <X className="mr-2 h-4 w-4" /> Temizle
          </Button>
        )}
      </div>
    </div>
  );
}
