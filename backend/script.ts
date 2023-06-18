import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      login: 'mmasstou',
      email: 'mmasstou@prisma.io',
      password: 'mmasstou012345_',
      is_active: true,
    },
  });
  await prisma.user.create({
    data: {
      login: 'user01',
      email: 'user01@prisma.io',
      password: 'mmasstou012345_',
      is_active: true,
    },
  });
  // console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
