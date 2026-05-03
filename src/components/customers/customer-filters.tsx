"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { CustomerCategory, CustomerStatus } from "@prisma/client";
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
  customerCategoryLabels,
  customerStatusLabels,
} from "@/lib/constants/enum-labels";

export function CustomerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") ?? "";
  const statusValue = searchParams.get("status") ?? "all";
  const categoryValue = searchParams.get("category") ?? "all";

  const statusItems = Object.values(CustomerStatus).map((status) => ({
    value: status,
    label: customerStatusLabels[status],
  }));

  const categoryItems = Object.values(CustomerCategory).map((category) => ({
    value: category,
    label: customerCategoryLabels[category],
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
          placeholder="Müşteri ara (ad, telefon, e-posta...)"
          className="pl-9"
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          items={[
            { value: "all", label: "Durum: Tümü" },
            ...statusItems,
          ]}
          value={statusValue}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[160px]">
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
          items={[
            { value: "all", label: "Kategori: Tümü" },
            ...categoryItems,
          ]}
          value={categoryValue}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kategori: Tümü</SelectItem>
            {categoryItems.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
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
