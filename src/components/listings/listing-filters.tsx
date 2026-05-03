"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListingStatus, PropertyType } from "@prisma/client";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  listingStatusLabels,
  propertyTypeLabels,
} from "@/lib/constants/enum-labels";

export function ListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") ?? "";
  const statusValue = searchParams.get("status") ?? "all";
  const typeValue = searchParams.get("type") ?? "all";

  const statusItems = Object.values(ListingStatus).map((status) => ({
    value: status,
    label: listingStatusLabels[status],
  }));

  const propertyTypeItems = Object.values(PropertyType).map((type) => ({
    value: type,
    label: propertyTypeLabels[type],
  }));

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
          placeholder="Portföy ara (başlık, bölge...)"
          className="pl-9"
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={[{ value: "all", label: "Durum: Tümü" }, ...statusItems]}
          value={statusValue}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Durum: Tümü</SelectItem>
            {statusItems.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={[{ value: "all", label: "Tip: Tümü" }, ...propertyTypeItems]}
          value={typeValue}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Mülk Tipi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tip: Tümü</SelectItem>
            {propertyTypeItems.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
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
