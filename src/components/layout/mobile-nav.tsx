"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import Sidebar from "./sidebar";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b bg-slate-900 px-4 py-4 md:hidden">
      <h1 className="text-xl font-bold text-white">Emlak CRM</h1>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-white hover:bg-slate-800")}>
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-slate-900 border-none w-72">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigasyon Menüsü</SheetTitle>
          </SheetHeader>
          <div onClick={() => setOpen(false)} className="h-full">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
