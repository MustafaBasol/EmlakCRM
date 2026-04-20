"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  History, 
  Home, 
  LogOut, 
  Settings, 
  Users, 
  Building2, 
  CheckSquare, 
  UserCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["ADMIN", "AGENT"] },
  { name: "Portföyler", href: "/dashboard/properties", icon: Building2, roles: ["ADMIN", "AGENT"] },
  { name: "Müşteriler", href: "/dashboard/customers", icon: Users, roles: ["ADMIN", "AGENT"] },
  { name: "Görevler", href: "/dashboard/tasks", icon: CheckSquare, roles: ["ADMIN", "AGENT"] },
  { name: "Aktivite Kayıtları", href: "/dashboard/activity", icon: History, roles: ["ADMIN"] },
  { name: "Danışmanlar", href: "/dashboard/users", icon: UserCircle, roles: ["ADMIN"] },
  { name: "Ayarlar", href: "/dashboard/settings", icon: Settings, roles: ["ADMIN", "AGENT"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "AGENT";

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-full flex-col bg-[#0B1730] text-[#CBD5E1]">
      {/* Logo Area */}
      <div className="flex h-20 items-center px-6 mb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D4ED8] shadow-lg shadow-blue-900/30">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Emlak CRM</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4">
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#1D4ED8] text-white shadow-md shadow-blue-900/25"
                    : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#CBD5E1]"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-[18px] w-[18px] flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-[#94A3B8] group-hover:text-[#CBD5E1]"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="mt-auto p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#12203D] border border-white/[0.06] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D4ED8]/20 border border-[#1D4ED8]/30 shrink-0">
            <UserCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate">{session?.user?.name}</p>
            <p className="text-[11px] font-medium text-[#94A3B8] truncate">
              {userRole === "ADMIN" ? "Yönetici" : "Danışman"}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Oturumu Kapat"
            type="button"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
