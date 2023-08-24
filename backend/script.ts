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
import { type } from 'os';
import { userType } from 'src/users/user.type';

const prisma = new PrismaClient();

// define user type :
type User = {
  login: string;
  email: string;
  password: string;
  name: string;
  kind: string;
  avatar: string;
  location: string;
  intraId: number;
  banner: string;
  is_active: boolean;
  Rooms: any[];
  directMessage: any[];
};
type kskjsd = {
  login: string;
  email: string;
  password: any;
  name: string;
  kind: string;
  avatar: string;
  location: string;
  intraId: number;
  banner: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cursusId: string;
  Rooms: [];
  directMessage: any[];
};
const _data = [];
for (let index = 0; index < 12; index++) {
  const user: User = {
    login: 'mmasstou' + index,
    email: 'mmasstou' + index + '@student.1337.ma',
    password: 'password' + index,
    name: 'user id:' + index,
    avatar:
      'https://cdn.intra.42.fr/users/5f10eb429fc9ed4eb28c5850095a14cb/mmjasstou.jpg',
    location: 'e3r3p3',
    intraId: 902213 + index,
    banner: '',
    kind: 'student',
    is_active: false,
    Rooms: [],
    directMessage: [],
  };
  _data.push(user);
}

async function createUsers(users: any[]) {
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { login: user.login },
    });
    existingUser && console.log('User already exists: ' + existingUser.login);
    if (!existingUser) {
      setTimeout(async () => {
        const createdUser = await prisma.user.create({
          data: {
            login: user.login,
            email: user.email,
            password: user.password,
            name: user.name,
            kind: user.kind,
            avatar: user.avatar,
            location: user.location,
            intraId: user.intraId,
            banner: user.banner,
            is_active: user.is_active,
          },
        });
        console.log('Created user with id: ' + createdUser.login);
      }, 2000);
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
