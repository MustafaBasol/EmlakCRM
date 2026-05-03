"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListingPhoto {
  id: string;
  imageUrl: string;
}

interface ListingPhotoGalleryProps {
  photos: ListingPhoto[];
  title: string;
}

export function ListingPhotoGallery({ photos, title }: ListingPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return current === 0 ? photos.length - 1 : current - 1;
        });
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return current === photos.length - 1 ? 0 : current + 1;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, photos.length]);

  function showPrevious() {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === 0 ? photos.length - 1 : current - 1;
    });
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === photos.length - 1 ? 0 : current + 1;
    });
  }

  if (photos.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-slate-50 text-sm text-muted-foreground">
        Henüz fotoğraf eklenmemiş.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white text-left"
          >
            <img
              src={photo.imageUrl}
              alt={`${title} fotoğrafı ${index + 1}`}
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/65 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="text-sm font-medium text-white">
                {index + 1} / {photos.length}
              </span>
              <span className="rounded-full bg-white/15 p-2 text-white backdrop-blur-sm">
                <Expand className="h-4 w-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {isOpen && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/92 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div className="relative flex h-full w-full max-w-7xl flex-col justify-center" onClick={(event) => event.stopPropagation()}>
            <div className="absolute right-0 top-0 z-10 flex items-center gap-2">
              <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                {activeIndex + 1} / {photos.length}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setActiveIndex(null)}
                className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Kapat</span>
              </Button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showPrevious}
                className="absolute left-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white sm:left-6"
              >
                <ChevronLeft className="h-7 w-7" />
                <span className="sr-only">Önceki fotoğraf</span>
              </Button>

              <img
                src={photos[activeIndex].imageUrl}
                alt={`${title} büyük fotoğrafı ${activeIndex + 1}`}
                className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={showNext}
                className="absolute right-2 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white sm:right-6"
              >
                <ChevronRight className="h-7 w-7" />
                <span className="sr-only">Sonraki fotoğraf</span>
              </Button>
            </div>

            {photos.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3 overflow-x-auto pb-2">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "overflow-hidden rounded-xl border-2 transition-all",
                      index === activeIndex ? "border-white shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={`${title} küçük önizleme ${index + 1}`}
                      className="h-16 w-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
