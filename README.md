# Emlak CRM - Modern Emlak Ofisi Yönetim Sistemi

Bu proje, emlak ofisleri için geliştirilmiş, modern, hızlı ve kullanıcı dostu bir CRM (Müşteri İlişkileri Yönetimi) sistemidir. Next.js 15, Prisma ve Tailwind CSS v4 teknolojileri ile inşa edilmiştir.

## 🚀 Özellikler

- **Gelişmiş Dashboard**: Ofis metrikleri, yaklaşan görevler ve son aktivitelerin canlı özeti.
- **Portföy Yönetimi**: Gayrimenkul ilanlarının oluşturulması, düzenlenmesi ve filtrelenmesi.
- **CRM / Müşteri Yönetimi**: Alıcı, satıcı ve yatırımcı leadlerinin takibi, bütçe ve tercih yönetimi.
- **Görev & Ajanda**: Randevular, yer göstermeler ve hatırlatıcıların yönetimi.
- **Kimlik Doğrulama & Yetkilendirme**: Role-based access control (Admin/Agent) ve güvenli giriş sistemi.
- **Denetim Kaydı (Audit Log)**: Sistem üzerindeki tüm işlemlerin yöneticiler tarafından takibi.
- **Mobil Uyumlu**: Tamamen responsive tasarım ve mobil navigasyon desteği.

## 🛠️ Teknoloji Yığını

- **Framework**: Next.js 15 (App Router)
- **Veritabanı**: PostgreSQL & Prisma ORM
- **Kimlik Doğrulama**: Auth.js (NextAuth)
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Form Yönetimi**: React Hook Form & Zod
- **Diller**: TypeScript

## 📦 Kurulum ve Çalıştırma

### 1. Gereksinimler
- Node.js 18+ 
- PostgreSQL veritabanı

### 2. Kurulum
```bash
npm install
```

### 3. Veritabanı Yapılandırması
`.env.example` dosyasını `.env` olarak kopyalayın ve veritabanı bağlantı dizginizi (`DATABASE_URL`) ekleyin.

```bash
npx prisma migrate dev --name init
```

### 4. Demo Verilerini Yükleme
Sistemi test etmek için hazır verileri yükleyebilirsiniz:
```bash
npx prisma db seed
```

### 5. Uygulamayı Başlatma
```bash
npm run dev
```

## 🔐 Test Kullanıcıları

| Rol | E-posta | Şifre |
| :--- | :--- | :--- |
| **Yönetici (Admin)** | admin@emlak.com | admin123 |
| **Danışman (Agent)** | mehmet@emlak.com | agent123 |

---

*Geliştiren: Antigravity AI Assistant*
