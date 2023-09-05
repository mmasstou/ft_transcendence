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
  email?: string;
  password?: any;
  name?: string;
  kind?: string;
  avatar?: string;
  location?: string;
  intraId?: number;
  banner?: string;
  is_active?: boolean;
  bg_color?: string[];
  paddle_color?: string;
  ball_color?: string;
  status?: string;
  TotalWin?: number;
  TotalLose?: number;
  TotalDraw?: number;
  cleanSheet?: boolean;
  Machine?: boolean;
  TotalMatch?: number;
  Level?: number;
  twoFactorAuthenticationSecret?: string;
  twoFA?: boolean;
  logedFirstTime?: boolean;
  Rooms: [];
  directMessage: any[];
};
const _data: kskjsd[] = [
  {
    login: 'mmasstou',
    email: 'mmasstou@student.1337.ma',
    password: null,
    name: 'Mohamed Masstour',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/5f10eb429fc9ed4eb28c5850095a14cb/mmasstou.jpg',
    bg_color: ['#918CA9', '#211F2F'],
    paddle_color: '#E0E0E0',
    ball_color: '#E0E0E0',
    status: 'online',
    TotalWin: 1,
    TotalLose: 0,
    TotalDraw: 0,
    cleanSheet: false,
    Machine: false,
    TotalMatch: 1,
    Level: 0.1,
    location: 'e3r2p1',
    intraId: 90221,
    banner: '',
    is_active: false,
    twoFactorAuthenticationSecret: null,
    twoFA: false,
    logedFirstTime: true,
    Rooms: [],
    directMessage: [],
  },
  {
    login: 'sqatim',
    email: 'sqatim@student.1337.ma',
    password: null,
    name: 'Samir Qatim',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/58005f95512e7ea050a9dff17670987d/sqatim.jpg',
    bg_color: ['#918CA9', '#211F2F'],
    paddle_color: '#E0E0E0',
    ball_color: '#E0E0E0',
    status: 'offline',
    TotalWin: 0,
    TotalLose: 0,
    TotalDraw: 0,
    cleanSheet: false,
    Machine: false,
    TotalMatch: 0,
    Level: 0,
    location: 'e3r2p3',
    intraId: 62196,
    banner: '',
    is_active: false,
    twoFactorAuthenticationSecret: null,
    twoFA: false,
    logedFirstTime: true,
    Rooms: [],
    directMessage: [],
  },
  {
    login: 'aouhadou',
    email: 'aouhadou@student.1337.ma',
    password: null,
    name: 'Azedine Ouhadou',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/9f70a3652c2bc7d286d9f652f1e667b4/aouhadou.jpg',
    bg_color: ['#918CA9', '#211F2F'],
    paddle_color: '#E0E0E0',
    ball_color: '#E0E0E0',
    status: 'offline',
    TotalWin: 1,
    TotalLose: 2,
    TotalDraw: 0,
    cleanSheet: false,
    Machine: false,
    TotalMatch: 3,
    Level: 0.3,
    location: 'e3r3p2',
    intraId: 91238,
    banner: '',
    is_active: false,
    twoFactorAuthenticationSecret: null,
    twoFA: false,
    logedFirstTime: false,
    Rooms: [],
    directMessage: [],
  },
  {
    login: 'eagoumi',
    email: 'eagoumi@student.1337.ma',
    password: null,
    name: 'El Mehdi Agoumi',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/e062d82dcd551fbc896f9ea6e0930986/eagoumi.jpg',
    bg_color: ['#918CA9', '#211F2F'],
    paddle_color: '#E0E0E0',
    ball_color: '#E0E0E0',
    status: 'offline',
    TotalWin: 0,
    TotalLose: 0,
    TotalDraw: 0,
    cleanSheet: false,
    Machine: false,
    TotalMatch: 0,
    Level: 0,
    location: 'e3r5p8',
    intraId: 95249,
    banner: '',
    is_active: false,
    twoFactorAuthenticationSecret: null,
    twoFA: false,
    logedFirstTime: false,
    Rooms: [],
    directMessage: [],
  },
  {
    login: 'sdfdsafs',
    email: 'aboulhaj@student.1337.ma',
    password: null,
    name: 'Ali Boulhajat',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/c9a6f9f9009e4112128b97aaa41460b3/aboulhaj.jpg',
    bg_color: ['#779DBE', '#123E64'],
    paddle_color: '#000000',
    ball_color: '#000000',
    status: 'offline',
    TotalWin: 5,
    TotalLose: 2,
    TotalDraw: 0,
    cleanSheet: false,
    Machine: false,
    TotalMatch: 7,
    Level: 1.3,
    location: 'e3r1p3',
    intraId: 90188,
    banner: '',
    is_active: false,
    twoFactorAuthenticationSecret: null,
    twoFA: false,
    logedFirstTime: false,
    Rooms: [],
    directMessage: [],
  },
  {
    login: 'aybouras',
    email: 'ayoubbrs@gmail.com',
    password: null,
    name: 'Ayoub Bouras',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/420c9962ed38f7ae7b69c39ba70f713d/aybouras.jpg',
    bg_color: ['#D397FA', '#6642DB'],
    paddle_color: '#000000',
    ball_color: '#000000',
    status: 'offline',
    TotalWin: 1,
    TotalLose: 4,
    TotalDraw: 0,
    cleanSheet: false,
    Machine: true,
    TotalMatch: 5,
    Level: 0,
    location: 'e3r1p2',
    intraId: 48916,
    banner: '',
    is_active: false,
    twoFactorAuthenticationSecret: null,
    twoFA: false,
    logedFirstTime: true,
    Rooms: [],
    directMessage: [],
  },
];
// for (let index = 0; index < 5; index++) {
//   const user: kskjsd = {
//     login: 'mmasstou' + index,
//     email: 'mmasstou' + index + '@student.1337.ma',
//     password: 'password' + index,
//     name: 'user id:' + index,
//     avatar:
//       'https://cdn.intra.42.fr/users/5f10eb429fc9ed4eb28c5850095a14cb/mmjasstou.jpg',
//     location: 'e3r3p3',
//     intraId: 902213 + index,
//     banner: '',
//     kind: 'student',
//     is_active: false,
//     Rooms: [],
//     directMessage: [],
//   };
//   _data.push(user);
// }

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
