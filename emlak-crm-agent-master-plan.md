# Emlak CRM Projesi – Agent Başlangıç ve Uygulama Planı

Bu dosya, projeyi geliştirecek agent için ana referans dokümandır. Amaç, emlak ofisi için geliştirilecek web tabanlı CRM / portföy / saha takip sisteminin **nereden başlayacağını**, **hangi sırayla ilerleyeceğini**, **ilk sürümde nelerin yapılacağını** ve **teknik kararların nasıl alınacağını** netleştirmektir.

---

## 1. Proje Özeti

Bu proje; emlak ofisinin portföylerini, müşterilerini, danışman aktivitelerini ve yer gösterme süreçlerini merkezi olarak yönetmesini sağlayan özel bir yazılım sistemidir.

Sistem aşağıdaki temel ihtiyaçları karşılamalıdır:

- Portföy / ilan yönetimi
- Müşteri yönetimi (CRM)
- Danışman bazlı yetkilendirme
- Aktivite logları
- Görev ve hatırlatıcı yapısı
- Yönetici dashboard’u ve performans takibi
- Mobil uyumlu saha kullanımı
- İleri fazda WhatsApp paylaşımı, GPS doğrulama ve OTP ile dijital yer gösterme

---

## 2. Ürün Vizyonu

Ürün vizyonu: **Şeffaf emlakçılık**

Sistem sadece kayıt tutan bir panel olmamalı; aynı zamanda:

- danışman faaliyetlerini ölçebilmeli,
- yöneticiye görünürlük sağlamalı,
- saha operasyonunu dijitalleştirmeli,
- müşteri-portföy eşleşmesini hızlandırmalı,
- ileride başka emlak ofislerine de uyarlanabilecek şekilde ürünleşebilir olmalıdır.

---

## 3. Ürün Stratejisi

Projeyi tek seferde tam kapsamlı geliştirmeye çalışmak yerine **faz bazlı** ilerlemek gerekir.

### Faz 1 – Çalışan Çekirdek Sistem (MVP)
Bu fazda sistem canlı kullanılabilir hale gelmelidir.

Kapsam:
- Kimlik doğrulama ve oturum yönetimi
- Rol bazlı yetkilendirme (Yönetici / Danışman)
- Portföy yönetimi
- Müşteri yönetimi
- Portföy-müşteri eşleştirme
- Aktivite logları
- Görev / hatırlatıcı altyapısı
- Yönetici dashboard’u
- Mobil uyumlu responsive arayüz

### Faz 2 – Operasyonel Güçlendirme
Kapsam:
- WhatsApp paylaşım modülü
- Harita ve konum alanları
- Gelişmiş raporlama
- Veri dışa aktarma yetki kontrolü

### Faz 3 – İleri Saha Doğrulama
Kapsam:
- GPS doğrulamalı yer gösterme
- OTP kod gönderimi
- SMS / WhatsApp entegrasyonu
- Yer gösterme denetim ekranları

> Agent önce Faz 1’i bitirmelidir. Faz 2 ve Faz 3 için altyapı tasarlanmalı ama uygulama Faz 1 tamamlandıktan sonra başlamalıdır.

---

## 4. Teknik Yaklaşım

### Önerilen Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend**
- Next.js server actions + route handlers
- veya ihtiyaç büyürse NestJS’ye ayrıştırılabilecek servis yapısı

**Database**
- PostgreSQL

**ORM**
- Prisma

**Authentication**
- Auth.js veya Clerk
- İlk tercih: **Auth.js + Prisma + role-based access**

**Storage**
- S3 uyumlu obje depolama veya Supabase Storage
- İlk geliştirme aşamasında lokal/dev storage kabul edilebilir, production-ready abstraction şart

**Maps**
- Mapbox veya Google Maps
- Faz 1’de sadece `latitude/longitude` alanları hazır olabilir, tam harita entegrasyonu Faz 2

**Notifications**
- Faz 1: panel içi bildirim / görev tarihi mantığı
- Faz 2/3: WhatsApp / SMS sağlayıcı entegrasyonu

**Deployment**
- Vercel (frontend + API) veya VPS/Docker
- DB için managed PostgreSQL önerilir

---

## 5. Mimari Prensipler

Agent aşağıdaki prensiplere uyarak ilerlemelidir:

1. **Önce çalışır çekirdek sistem** yaklaşımı
2. **Modüler klasör yapısı**
3. **Role-based access** her ekranda ve API seviyesinde kontrol edilir
4. **Audit trail / log** kritik aksiyonlarda zorunludur
5. **Soft delete** tercih edilir; fiziksel silme minimumda tutulur
6. **Production-grade validation** (zod / server validation)
7. **Responsive-first** tasarım
8. **Form-heavy UX** olduğundan sade ve hızlı veri girişi önceliklidir
9. **Future-ready** alanlar şimdiden veri modeline eklenebilir, ama UI sadece Faz 1 kapsamını göstermeli

---

## 6. İlk Sürümde Yapılacak Modüller

### 6.1 Kimlik Doğrulama ve Kullanıcı Yönetimi
Roller:
- ADMIN
- AGENT

Temel ihtiyaçlar:
- giriş / çıkış
- kullanıcı listesi (admin)
- kullanıcı oluşturma (admin)
- rol atama
- aktif/pasif kullanıcı

### 6.2 Portföy Yönetimi
Temel alanlar:
- id
- başlık
- açıklama
- fiyat
- m2
- odaSayisi
- binaYasi
- mulkTipi
- durum (aktif, satıldı, pasif, taslak)
- adaNo
- parselNo
- adres
- il
- ilce
- mahalle
- latitude
- longitude
- sahibiAdi
- sahibiTelefonu
- atananDanismanId
- createdById
- createdAt / updatedAt

Portföy özellikleri:
- listeleme
- detay sayfası
- oluşturma
- güncelleme
- filtreleme
- danışman bazlı görünürlük

### 6.3 Portföy Fotoğrafları
Alanlar:
- propertyId
- imageUrl
- sortOrder
- isCover

İlk sürümde çoklu yükleme desteklenmeli. Görseller optimize edilerek listede hızlı gösterilmeli.

### 6.4 CRM / Müşteri Yönetimi
Alanlar:
- id
- adSoyad
- telefon
- email
- musteriTipi (ALICI / SATICI / YATIRIMCI)
- ilgilenenBolge
- minButce
- maxButce
- mulkTipiTercihi
- notlar
- atananDanismanId
- durum (yeni, aranacak, aktif, pasif, satış oldu)
- createdById
- createdAt / updatedAt

Fonksiyonlar:
- müşteri listesi
- müşteri detayı
- müşteri ekleme / düzenleme
- danışmana atama
- müşteriye not ekleme

### 6.5 Otomatik Eşleştirme
Yeni portföy veya müşteri detayında sistem şu alanlara göre öneri üretsin:
- bölge
- mülk tipi
- bütçe aralığı

İlk sürümde bu kural tabanlı olabilir. AI gerekmez.

### 6.6 Aktivite Logları
Loglanacak işlemler:
- kullanıcı girişi
- portföy oluşturma / güncelleme
- müşteri oluşturma / güncelleme
- görev oluşturma / tamamlama
- kritik kayıt görüntüleme (opsiyonel)

Alanlar:
- actorUserId
- entityType
- entityId
- actionType
- metaJson
- createdAt

### 6.7 Görev ve Hatırlatıcılar
Alanlar:
- başlık
- açıklama
- dueDate
- status
- assignedToUserId
- relatedEntityType
- relatedEntityId

Fonksiyonlar:
- görev oluşturma
- görev listesi
- geciken görevler
- tamamlandı işaretleme

### 6.8 Dashboard
Admin dashboard kartları:
- toplam aktif portföy
- toplam aktif müşteri
- bu hafta eklenen portföy
- bu hafta eklenen müşteri
- danışman bazlı portföy sayısı
- danışman bazlı müşteri sayısı
- görev özeti

Agent dashboard kartları:
- bana ait portföyler
- bana ait müşteriler
- bugünkü görevler
- geciken görevler

---

## 7. Faz 2 ve Faz 3 İçin Şimdiden Hazırlanacak Altyapı

Agent Faz 1’de aşağıdaki geleceğe dönük alanları veri modeline eklemeyi düşünebilir:

### Property
- whatsappShareEnabled
- showingVerificationRadiusMeters

### Showing / Yer Gösterme Kaydı
İlk etapta tablo oluşturulabilir ama tam kullanım sonradan açılır:
- propertyId
- customerId
- agentUserId
- scheduledAt
- startedAt
- completedAt
- agentLat
- agentLng
- otpCodeHash
- otpSentAt
- otpVerifiedAt
- verificationStatus

> Eğer bu tablo şimdiden açılırsa ileride Faz 3 daha temiz eklenir.

---

## 8. Kullanıcı Akışları

### Admin Akışı
1. Sisteme giriş yapar
2. Dashboard’u görür
3. Kullanıcıları yönetir
4. Portföyleri görüntüler / düzenler
5. Müşterileri görüntüler / filtreler
6. Danışman aktivitelerini izler
7. Raporlara bakar

### Danışman Akışı
1. Sisteme giriş yapar
2. Kendi dashboard’unu görür
3. Portföy ekler / günceller
4. Kendine atanan müşterileri yönetir
5. Görevlerini görür ve tamamlar
6. İlgili portföy / müşteri eşleşmelerine bakar

---

## 9. Önerilen Sayfa Yapısı

### Auth
- `/login`

### Dashboard
- `/dashboard`

### Portföyler
- `/properties`
- `/properties/new`
- `/properties/[id]`
- `/properties/[id]/edit`

### Müşteriler
- `/customers`
- `/customers/new`
- `/customers/[id]`
- `/customers/[id]/edit`

### Görevler
- `/tasks`
- `/tasks/new`

### Kullanıcılar (admin)
- `/users`
- `/users/new`

### Loglar (admin)
- `/activity-logs`

### Raporlar (admin)
- `/reports`

---

## 10. Önerilen Klasör Yapısı

```txt
src/
  app/
    (auth)/
    (dashboard)/
      dashboard/
      properties/
      customers/
      tasks/
      users/
      reports/
      activity-logs/
    api/
  components/
    ui/
    layout/
    forms/
    properties/
    customers/
    dashboard/
  lib/
    auth/
    db/
    permissions/
    validations/
    utils/
    services/
  server/
    actions/
    queries/
  prisma/
```

---

## 11. Veri Modeli – Önerilen Ana Tablolar

### User
- id
- name
- email
- passwordHash / auth provider
- role
- isActive
- createdAt
- updatedAt

### Property
- id
- title
- description
- price
- squareMeters
- roomCount
- buildingAge
- propertyType
- status
- islandNo
- parcelNo
- address
- city
- district
- neighborhood
- latitude
- longitude
- ownerName
- ownerPhone
- assignedAgentId
- createdById
- createdAt
- updatedAt
- deletedAt

### PropertyImage
- id
- propertyId
- imageUrl
- sortOrder
- isCover
- createdAt

### Customer
- id
- fullName
- phone
- email
- customerType
- interestedCity
- interestedDistrict
- interestedNeighborhood
- minBudget
- maxBudget
- preferredPropertyType
- notes
- status
- assignedAgentId
- createdById
- createdAt
- updatedAt
- deletedAt

### CustomerNote
- id
- customerId
- body
- createdById
- createdAt

### Task
- id
- title
- description
- dueDate
- status
- assignedToUserId
- relatedEntityType
- relatedEntityId
- createdById
- createdAt
- updatedAt

### ActivityLog
- id
- actorUserId
- entityType
- entityId
- actionType
- metaJson
- createdAt

### Showing (future-ready)
- id
- propertyId
- customerId
- agentUserId
- scheduledAt
- startedAt
- completedAt
- agentLatitude
- agentLongitude
- otpCodeHash
- otpSentAt
- otpVerifiedAt
- verificationStatus
- createdAt

---

## 12. Yetkilendirme Kuralları

### ADMIN
- tüm kayıtları görebilir
- tüm kayıtları oluşturabilir / düzenleyebilir
- kullanıcıları yönetebilir
- logları ve raporları görebilir
- dışa aktarma yapabilir

### AGENT
- sadece kendi oluşturduğu veya kendine atanan kayıtları görür
- kendi portföylerini ve müşterilerini yönetir
- kullanıcı yönetemez
- tüm loglara erişemez
- dışa aktarma yapamaz

> Bu kurallar yalnızca UI’da değil, sunucu tarafında da zorunlu olarak uygulanmalıdır.

---

## 13. Uygulama Sırası

Agent aşağıdaki sırayla ilerlemelidir.

### Adım 1 – Proje İskeleti
- Next.js + TypeScript + Tailwind + shadcn/ui kurulumu
- Prisma + PostgreSQL bağlantısı
- temel layout ve route yapısı
- env yapısının hazırlanması

### Adım 2 – Auth ve Role System
- login ekranı
- session yönetimi
- role-based layout guard
- admin ve agent için farklı görünüm

### Adım 3 – Database Schema ve Seed
- Prisma schema oluştur
- temel tabloları aç
- örnek admin ve 1-2 danışman seed et
- örnek portföy / müşteri seed verileri ekle

### Adım 4 – Portföy Modülü
- property create/list/detail/edit
- filtreleme
- fotoğraf ilişkisi
- yetki kontrolü

### Adım 5 – CRM / Müşteri Modülü
- customer create/list/detail/edit
- müşteri notları
- danışmana atama
- yetki kontrolü

### Adım 6 – Görev Modülü
- görev oluşturma ve listeleme
- gecikmiş / yaklaşan görev görünümleri
- ilgili müşteri/portföy ile bağlantı

### Adım 7 – Aktivite Logları
- kritik CRUD işlemlerinde log üret
- admin ekranında log listesini göster

### Adım 8 – Dashboard
- admin dashboard
- agent dashboard
- temel sayısal kartlar ve grafikler

### Adım 9 – Eşleştirme Motoru
- müşteri ve portföy için rule-based matching
- öneri listesi göster

### Adım 10 – Faz 1 Stabilizasyonu
- form validation iyileştirmeleri
- responsive düzeltmeler
- permission testleri
- seed ve demo verileri iyileştirme

### Adım 11 – Faz 2 Hazırlıkları
- whatsapp share alanları
- konum alanlarını UI’da hazırla
- harita abstraction katmanı tasarla

### Adım 12 – Faz 2 Uygulaması
- whatsapp paylaşım akışı
- harita / konum ekranları
- gelişmiş raporlama

### Adım 13 – Faz 3 Tasarım ve Uygulama
- showing tablosu
- GPS doğrulama akışı
- OTP mantığı
- entegrasyon servis adaptörleri

---

## 14. MVP Tanımı

Bir sürümün MVP sayılabilmesi için aşağıdakiler tamamlanmış olmalıdır:

- Admin ve agent giriş yapabiliyor
- Rol bazlı erişim çalışıyor
- Portföy CRUD tamam
- Müşteri CRUD tamam
- Görev CRUD temel seviyede tamam
- Aktivite logları oluşuyor
- Dashboard’da temel metrikler görünüyor
- Responsive kullanım kabul edilebilir durumda
- Seed ile demo ortamı hazırlanmış

MVP dışında kalanlar:
- gerçek WhatsApp entegrasyonu
- gerçek SMS / OTP entegrasyonu
- canlı GPS doğrulama
- PDF / Excel export
- push notification

---

## 15. UI / UX İlkeleri

- Saha danışmanı hızlı veri girişi yapabilmeli
- Tek ekranda gereksiz yoğunluk olmamalı
- Liste ekranlarında hızlı filtre şart
- Mobil görünümde ana aksiyonlar görünür olmalı
- Formlar section bazlı ve okunabilir olmalı
- Yönetici panelinde özet, danışmanda aksiyon ön planda olmalı

---

## 16. Teknik Borç Oluşturmamak İçin Kurallar

Agent şu kurallara uymalıdır:

- `any` kullanımı minimumda tutulmalı
- tüm inputlar validate edilmeli
- server tarafı permission check zorunlu olmalı
- tekrar eden business logic `lib/services` içine taşınmalı
- UI bileşenleri reusable tasarlanmalı
- magic string yerine enum kullanılmalı
- status ve role alanları typed enum olarak tutulmalı

---

## 17. Raporlama ve Telemetri Hazırlığı

Faz 1’de minimal olsa da aşağıdakilere zemin hazırlanmalı:
- danışman bazlı sayaçlar
- tarih aralığına göre filtrelenebilir sorgular
- haftalık / aylık aggregation

Agent; dashboard query’lerini tek yerde toplamaya çalışmalıdır.

---

## 18. Test Öncelikleri

En azından aşağıdaki kritik akışlar doğrulanmalıdır:

1. Admin login
2. Agent login
3. Agent’ın başka danışmana ait kaydı görememesi
4. Portföy oluşturma / güncelleme
5. Müşteri oluşturma / güncelleme
6. Görev oluşturma / tamamlama
7. Aktivite log üretimi
8. Dashboard sayaçlarının doğru görünmesi

---

## 19. Agent İçin Çalışma Kuralları

1. Önce iskelet ve veri modeli kur
2. Sonra auth ve role system’i bitir
3. Sonra property ve customer CRUD’larını tamamla
4. Sonra task ve logs modülünü ekle
5. Sonra dashboard’u oluştur
6. Son aşamada eşleştirme mantığını ekle
7. Faz 1 bitmeden Faz 3 entegrasyonlarına girme
8. Her ana modül tamamlandığında kısa bir changelog bırak
9. Geliştirme sırasında örnek seed data üret
10. Tüm kararları bu dokümandaki scope’a göre ver; scope dışı genişletmeleri varsayılan olarak yapma

---

## 20. İlk İş Paketi (Agent için Hemen Başlanacak Sprint)

Agent aşağıdaki ilk sprint ile başlamalıdır:

### Sprint 0 / Sprint 1
- Next.js proje kurulumu
- Tailwind + shadcn kurulumu
- Prisma + PostgreSQL kurulumu
- temel env örneği
- auth sistemi kurulumu
- User / Property / Customer / Task / ActivityLog schema’ları
- seed script
- temel dashboard layout
- login ekranı
- sidebar ve navigation

Sprint sonunda beklenen çıktı:
- çalışan proje iskeleti
- login olan kullanıcı
- rol bazlı korunan dashboard
- veritabanı migrate edilmiş temel schema

---

## 21. Faz 1 Sonrası Beklenen Geliştirme Notu

Faz 1 tamamlandıktan sonra sistem demo için kullanılabilir hale gelmelidir.
Bu aşamada müşteri ile tekrar kapsam gözden geçirilerek:
- WhatsApp paylaşım detayları
- OTP sağlayıcısı seçimi
- konum doğrulama hassasiyeti
- rapor ekranı detayları

netleştirilir.

---

## 22. Son Karar

Bu proje **önce CRM + portföy + görev + log + dashboard** ekseninde kurulmalıdır.

**Başlangıç noktası:**
1. teknik iskelet
2. auth ve role system
3. veri modeli
4. property/customer modülleri

**En doğru sıra budur.**

Agent projeye bu dosyayı referans alarak başlamalı ve önceliği Faz 1 MVP’ye vermelidir.
