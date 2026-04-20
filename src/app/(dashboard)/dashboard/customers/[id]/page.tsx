import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { 
  ArrowLeft, 
  Building2,
  Calendar, 
  ChevronRight, 
  Mail, 
  MapPin, 
  Pencil, 
  Phone, 
  User,
  Tags,
  DollarSign,
  ClipboardList
} from "lucide-react";
import { authOptions } from "@/lib/auth/auth-options";
import { getCustomerById } from "@/lib/queries/customers/get-customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const user = session.user as any;

  const customer = await getCustomerById(id, user.role, user.id);
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/customers" className="hover:text-foreground">Müşteriler</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">{customer.fullName}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{customer.fullName}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/customers/${customer.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" /> Düzenle
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Müşteri Profili</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{customer.category}</Badge>
                <Badge>{customer.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase flex items-center gap-2">
                    <User className="h-4 w-4" /> İletişim Bilgileri
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 font-medium">
                      <Phone className="h-4 w-4 text-slate-500" /> {customer.phone}
                    </p>
                    {customer.email && (
                      <p className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-4 w-4 text-slate-500" /> {customer.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase flex items-center gap-2">
                    <Tags className="h-4 w-4" /> Tercihler
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-slate-600">
                      <Building2 className="h-4 w-4 text-slate-500" /> 
                      {customer.desiredPropertyType || "Belirtilmemiş"}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-500" /> 
                      {customer.preferredCity || "-"} / {customer.preferredDistrict || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Bütçe Aralığı
                </h4>
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  {customer.budgetMin ? formatCurrency(customer.budgetMin) : "0"} 
                  <span className="text-muted-foreground font-normal mx-1">-</span>
                  {customer.budgetMax ? formatCurrency(customer.budgetMax) : "∞"}
                </div>
              </div>

              <div className="pt-6 border-t">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> Genel Notlar
                </h4>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {customer.notes || "Henüz not eklenmemiş."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info & Tasks */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Yönetim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Atanan Danışman</p>
                  <p className="font-bold">{customer.assignedAgent?.fullName || "-"}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Kayıt Tarihi
                  </span>
                  <span className="font-medium">{formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" /> Bekleyen Görevler
                  </span>
                  <span className="font-medium">{customer.tasks?.filter((t: any) => t.status === "TODO").length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button className="w-full" variant="secondary" asChild>
            <Link href={`/dashboard/tasks/new?customerId=${customer.id}`}>
              Hızlı Görev Ekle
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
