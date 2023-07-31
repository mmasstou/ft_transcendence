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
    login: 'aboulhaj',
    email: 'aboulhaj@prisma.io',
    password: 'aboulhaj',
    bg_color: ['#bebebe', '#878683', '#444444'],
    paddle_color: '#FFFFFF',
    ball_color: '#FFFFFF',
    image: "pngavatar.png",
    is_active: true,
  },
  {
    login: 'aboulhaj2',
    email: 'aboulhaj2@prisma.io',
    password: 'aboulhaj2',
    bg_color: ['#000000', '#000000', '#000000'],
    paddle_color: '#0000FF',
    ball_color: '#0000FF',
    image: "pngavatar2.png",
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
