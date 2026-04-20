import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const RANDOM_AVATARS = [
  "https://i.pravatar.cc/150?img=11",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=47",
  "https://i.pravatar.cc/150?img=59",
  "https://i.pravatar.cc/150?img=60",
];

async function main() {
  const users = await prisma.user.findMany();
  
  console.log(`Found ${users.length} users. Seeding random avatars...`);
  
  for (let i = 0; i < users.length; i++) {
    const avatar = RANDOM_AVATARS[i % RANDOM_AVATARS.length];
    await prisma.user.update({
      where: { id: users[i].id },
      data: { image: avatar }
    });
    console.log(`Updated ${users[i].fullName} with avatar ${avatar}`);
  }
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
