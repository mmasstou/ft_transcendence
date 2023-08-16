// import { Socket, io } from 'socket.io-client';

// // create socket whit name space 'chat'
//   const socket = io(`${process.env.NEXT_PUBLIC_CHAT_URL_WS}`, {
//     transports: ['websocket'],
//     auth: {
//       token: token,
//     },
//   });

import { io } from 'socket.io-client';

const InitSocket = (token: string) => {
  // Configure the URL for your Socket.IO server
  const socket = io(`${process.env.NEXT_PUBLIC_CHAT_URL_WS}`, {
    auth: {
      token, // Pass the token as an authentication parameter
    },
  });

  return socket;
};

export default InitSocket;
