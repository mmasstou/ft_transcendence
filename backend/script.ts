// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.user.create({
//     data: {
//       login: 'mmasstou02',
//       email: 'mmasstou02@prisma.io',
//       password: 'mmasstou012345_',
//       is_active: true,
//     },
//   });
//   // console.log(user);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUsers() {
  const users = [
    {
      login: 'mmasstou',
      email: 'mmasstou@prisma.io',
      password: 'mmasstou012345_',
      is_active: true,
    },
    {
      login: 'mmasstou02',
      email: 'mmasstou02@prisma.io',
      password: 'mmasstou012345_',
      is_active: true,
    },
    {
      login: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      is_active: true,
    },
    {
      login: 'user2',
      email: 'user2@example.com',
      password: 'password2',
      is_active: true,
    },
    // Add more user objects as needed
  ];

  const createdUsers = [];

  for (const user of users) {
    const createdUser = await prisma.user.create({ data: user });
    createdUsers.push(createdUser);
  }
}

createUsers()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
