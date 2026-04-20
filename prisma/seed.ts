import { PrismaClient, UserRole, ListingStatus, PropertyType, CustomerCategory, CustomerStatus, TaskStatus, TaskPriority } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.listingPhoto.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("admin123", salt);
  const agentPasswordHash = await bcrypt.hash("agent123", salt);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      fullName: "Ahmet Yılmaz",
      email: "admin@emlak.com",
      passwordHash: passwordHash,
      role: UserRole.ADMIN,
      phone: "0532 111 22 33",
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      fullName: "Mehmet Demir",
      email: "mehmet@emlak.com",
      passwordHash: agentPasswordHash,
      role: UserRole.AGENT,
      phone: "0533 222 33 44",
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      fullName: "Selin Kaya",
      email: "selin@emlak.com",
      passwordHash: agentPasswordHash,
      role: UserRole.AGENT,
      phone: "0534 333 44 55",
    },
  });

  console.log("Users created.");

  // 2. Create Listings
  const listing1 = await prisma.listing.create({
    data: {
      title: "Boğaz Manzaralı Lüks Villa",
      description: "Bebek sahiline 5 dakika mesafede, geniş bahçeli ve havuzlu modern villa.",
      propertyType: PropertyType.VILLA,
      status: ListingStatus.ACTIVE,
      price: 45000000,
      areaSizeM2: 450,
      roomCount: 6,
      bathroomCount: 4,
      buildingAge: 5,
      city: "İstanbul",
      district: "Beşiktaş",
      neighborhood: "Bebek",
      addressText: "Bebek Mah. Manolya Sok. No:12",
      createdById: admin.id,
      assignedAgentId: agent1.id,
      photos: {
        create: [
          { imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", sortOrder: 0 },
        ],
      },
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      title: "Merkezi Konumda Modern 3+1 Daire",
      description: "Ulaşıma yakın, alışveriş merkezlerinin ortasında, yeni binada ferah daire.",
      propertyType: PropertyType.APARTMENT,
      status: ListingStatus.ACTIVE,
      price: 8500000,
      areaSizeM2: 145,
      roomCount: 3,
      bathroomCount: 2,
      buildingAge: 0,
      city: "İstanbul",
      district: "Şişli",
      neighborhood: "Kurtuluş",
      addressText: "Kurtuluş Cad. Ergenekon Sok. No:45 D:8",
      createdById: agent1.id,
      assignedAgentId: agent1.id,
    },
  });

  console.log("Listings created.");

  // 3. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      fullName: "Caner Özkan",
      phone: "0555 123 45 67",
      email: "caner@email.com",
      category: CustomerCategory.BUYER,
      desiredPropertyType: PropertyType.APARTMENT,
      budgetMin: 7000000,
      budgetMax: 10000000,
      preferredCity: "İstanbul",
      preferredDistrict: "Şişli",
      status: CustomerStatus.FOLLOW_UP,
      createdById: agent1.id,
      assignedAgentId: agent1.id,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      fullName: "Ayşe Erden",
      phone: "0544 987 65 43",
      email: "ayse@email.com",
      category: CustomerCategory.INVESTOR,
      desiredPropertyType: PropertyType.LAND,
      budgetMin: 2000000,
      budgetMax: 5000000,
      preferredCity: "Çanakkale",
      status: CustomerStatus.NEW,
      createdById: admin.id,
      assignedAgentId: agent2.id,
    },
  });

  console.log("Customers created.");

  // 4. Create Tasks
  await prisma.task.create({
    data: {
      title: "Boğaz Manzaralı Villa Gösterimi",
      description: "Müşteri Caner Bey vidayı görmek istiyor.",
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      priority: TaskPriority.HIGH,
      status: TaskStatus.TODO,
      createdById: admin.id,
      assignedToId: agent1.id,
      listingId: listing1.id,
      customerId: customer1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Yeni İlan girişini yap",
      description: "Şişli'deki dairenin fotoğraflarını yükle.",
      dueDate: new Date(),
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
      createdById: agent1.id,
      assignedToId: agent1.id,
      listingId: listing2.id,
    },
  });

  console.log("Tasks created.");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
