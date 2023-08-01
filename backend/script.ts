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

let _data = [
  {
    login: 'aboulhaj1',
    email: 'aboulhaj1@prisma.io',
    password: 'aboulhaj1',
    image: "https://cdn.intra.42.fr/users/c9a6f9f9009e4112128b97aaa41460b3/aboulhaj.jpg",
    is_active: true,
  },
  {
    login: 'mmasstou1',
    email: 'mmasstou1@prisma.io',
    password: 'mmasstou1',
    bg_color: ['#B6F1E4', '#00AEA9'],
    paddle_color: '#E0E0E0',
    ball_color: '#E0E0E0',
    image: "https://cdn.intra.42.fr/users/5f10eb429fc9ed4eb28c5850095a14cb/mmasstou.jpg",
    is_active: true,
  },
  {
    login: 'aboulhaj2',
    email: 'aboulhaj2@prisma.io',
    password: 'aboulhaj2',
    image: "pngavatar2.png",
    is_active: true,
  },
  {
    login: 'mmasstou2',
    email: 'mmasstou2@prisma.io',
    password: 'mmasstou2',
    image: "pngavatar.png",
    is_active: true,
  },
  {
    login: 'mmasstou',
    email: 'mmasstou@prisma.io',
    password: 'mmasstou012345_',
    is_active: true,
  },
  // Add more user objects as needed
];
for (let index = 0; index < 12; index++) {
  const obj = {
    login: 'user' + index.toString(),
    email: 'user' + index.toString() + '@example.com',
    password: 'password' + index.toString(),
    is_active: true,
  };
  _data.push(obj);
}

console.log(_data);

async function createUsers(users: any[]) {
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { login: user.login },
    });
    existingUser && console.log('User already exists: ' + existingUser.login);
    if (!existingUser) {
      const createdUser = await prisma.user.create({ data: user });
      console.log('Created user with id: ' + createdUser.login);
      setTimeout(() => {
        console.log('Created user with id: ' + createdUser.login);
      }, 1000);
    }
  }
}

createUsers(_data)
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
