import {
  CustomerCategory,
  CustomerStatus,
  ListingStatus,
  PropertyType,
  TaskPriority,
  TaskStatus,
  UserRole,
} from "@prisma/client";

export const propertyTypeLabels: Record<PropertyType, string> = {
  LAND: "Arsa",
  APARTMENT: "Daire",
  HOUSE: "Müstakil Ev",
  VILLA: "Villa",
  COMMERCIAL: "Ticari",
  OFFICE: "Ofis",
  SHOP: "Dükkan",
  FARM: "Çiftlik",
  OTHER: "Diğer",
};

export const listingStatusLabels: Record<ListingStatus, string> = {
  DRAFT: "Taslak",
  ACTIVE: "Aktif",
  RESERVED: "Rezerve",
  SOLD: "Satıldı",
  ARCHIVED: "Arşiv",
};

export const customerCategoryLabels: Record<CustomerCategory, string> = {
  BUYER: "Alıcı",
  SELLER: "Satıcı",
  INVESTOR: "Yatırımcı",
  TENANT: "Kiracı",
  LANDLORD: "Mülk Sahibi",
  OTHER: "Diğer",
};

export const customerStatusLabels: Record<CustomerStatus, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişim Kuruldu",
  FOLLOW_UP: "Takipte",
  VISIT_PLANNED: "Yer Gösterme Planlandı",
  NEGOTIATION: "Pazarlık Aşamasında",
  CLOSED: "Tamamlandı",
  LOST: "Kaybedildi",
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: "Yapılacak",
  IN_PROGRESS: "Devam Ediyor",
  DONE: "Tamamlandı",
  CANCELED: "İptal Edildi",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  URGENT: "Acil",
};

export const userRoleLabels: Record<UserRole, string> = {
  ADMIN: "Yönetici",
  AGENT: "Danışman",
};

export const userStatusOptions = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "PASSIVE", label: "Pasif" },
] as const;
