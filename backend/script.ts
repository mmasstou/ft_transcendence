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
import { async } from 'rxjs';

const prisma = new PrismaClient();

const _data = [
  {
    login: 'aboulhaj1',
    email: 'aboulhaj1@prisma.io',
    password: 'aboulhaj1',
    image:
      'https://cdn.intra.42.fr/users/c9a6f9f9009e4112128b97aaa41460b3/aboulhaj.jpg',
    is_active: true,
  },
  {
    login: 'mmasstou1',
    email: 'mmasstou1@prisma.io',
    password: 'mmasstou1',
    bg_color: ['#B6F1E4', '#00AEA9'],
    paddle_color: '#E0E0E0',
    ball_color: '#E0E0E0',
    image:
      'https://cdn.intra.42.fr/users/5f10eb429fc9ed4eb28c5850095a14cb/mmasstou.jpg',
    is_active: true,
  },
  {
    login: 'aboulhaj2',
    email: 'aboulhaj2@prisma.io',
    password: 'aboulhaj2',
    image: 'pngavatar2.png',
    is_active: true,
  },
  {
    login: 'mmasstou2',
    email: 'mmasstou2@prisma.io',
    password: 'mmasstou2',
    image: 'pngavatar.png',
    is_active: true,
  },
  {
    login: 'mmasstou',
    email: 'mmasstou@student.1337.ma',
    password: 'mmasstou012345_',
    name: 'Mohamed Masstour',
    kind: null,
    avatar:
      'https://cdn.intra.42.fr/users/5f10eb429fc9ed4eb28c5850095a14cb/mmasstou.jpg',
    intraId: 90221,
    banner: '',
    is_active: false,
  },
  {
    login: 'aouhadou',
    email: 'aouhadou@student.1337.ma',
    password: 'aouhadou012345_',
    name: 'Azedine Ouhadou',
    kind: null,
    avatar:
      'https://cdn.intra.42.fr/users/9f70a3652c2bc7d286d9f652f1e667b4/aouhadou.jpg',
    intraId: 91238,
    banner: '',
    is_active: false,
  },
  {
    login: 'aboulhaj',
    email: 'aboulhaj@student.1337.ma',
    password: 'aboulhaj012345_',
    name: 'Ali Boulhajat',
    kind: null,
    avatar:
      'https://cdn.intra.42.fr/users/c9a6f9f9009e4112128b97aaa41460b3/aboulhaj.jpg',
    intraId: 90188,
    banner: '',
    is_active: false,
  },
  {
    login: 'zmakhkha',
    email: 'zmakhkha@student.1337.ma',
    password: 'zmakhkha012345_',
    name: 'Zakaria Makhkhas',
    kind: null,
    avatar:
      'https://cdn.intra.42.fr/users/fe126cc601d93b711a24bbd332f6184b/zmakhkha.jpg',
    intraId: 91247,
    banner: '',
    is_active: false,
  },
];
console.log(_data);

async function createUsers(users: any[]) {
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { login: user.login },
    });
    existingUser && console.log('User already exists: ' + existingUser.login);
    if (!existingUser) {
      setTimeout(async () => {
        const createdUser = await prisma.user.create({ data: user });
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
