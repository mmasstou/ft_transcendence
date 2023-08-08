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

const _data = [
  {
    id: '8d739fe5-6d95-4aa9-a7e3-eae358b6c199',
    login: 'aouhadou',
    email: 'aouhadou@student.1337.ma',
    password: null,
    name: 'Azedine Ouhadou',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/9f70a3652c2bc7d286d9f652f1e667b4/aouhadou.jpg',
    location: 'e3r3p7',
    intraId: 91238,
    banner: '',
    is_active: false,
    created_at: '2023-08-01T13:05:39.229Z',
    updated_at: '2023-08-01T13:05:39.229Z',
    cursusId: '222b3fde-1203-4da7-91ce-14fa29766470',
    Rooms: [
      {
        id: 'c8c20aa5-0ea0-4b03-b60b-16b510c86b7d',
        name: 'general',
        type: 'PUBLIC',
        viewedmessage: 0,
        password: '',
        accesspassword: '',
        created_at: '2023-08-01T13:08:59.958Z',
        updated_at: '2023-08-01T13:08:59.958Z',
      },
    ],
    directMessage: [],
    cursus_users: {
      id: '222b3fde-1203-4da7-91ce-14fa29766470',
      grade: 'Learner',
      level: 8.89,
      blackholed_at: '2023-10-15T09:58:00.000Z',
    },
  },
  {
    id: 'd008897a-627f-466b-9152-bd7f36123740',
    login: 'mmasstou',
    email: 'mmasstou@student.1337.ma',
    password: null,
    name: 'Mohamed Masstour',
    kind: 'student',
    avatar:
      'https://cdn.intra.42.fr/users/5f10eb429fc9ed4eb28c5850095a14cb/mmasstou.jpg',
    location: 'e3r3p3',
    intraId: 90221,
    banner: '',
    is_active: false,
    created_at: '2023-08-01T13:07:14.105Z',
    updated_at: '2023-08-01T13:07:14.105Z',
    cursusId: 'a33ab288-347f-4f66-9a05-13650c3bd699',
    Rooms: [
      {
        id: 'c8c20aa5-0ea0-4b03-b60b-16b510c86b7d',
        name: 'general',
        type: 'PUBLIC',
        viewedmessage: 0,
        password: '',
        accesspassword: '',
        created_at: '2023-08-01T13:08:59.958Z',
        updated_at: '2023-08-01T13:08:59.958Z',
      },
    ],
    directMessage: [],
    cursus_users: {
      id: 'a33ab288-347f-4f66-9a05-13650c3bd699',
      grade: 'Learner',
      level: 8.93,
      blackholed_at: '2023-09-11T08:00:00.000Z',
    },
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
            cursus_users: {
              create: {
                grade: user.cursus_users.grade,
                level: user.cursus_users.level,
                blackholed_at: user.cursus_users.blackholed_at,
              },
            },
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
