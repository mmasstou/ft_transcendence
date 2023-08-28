'ser server'
// import { Socket, io } from 'socket.io-client';

// // create socket whit name space 'chat'
//   const socket = io(`${process.env.NEXT_PUBLIC_CHAT_URL_WS}`, {
//     transports: ['websocket'],
//     auth: {
//       token: token,
//     },
//   });

import { RoomsType } from '@/types/types';
import { io } from 'socket.io-client';

const InitSocket = (token: string, room : RoomsType) => {
  // Configure the URL for your Socket.IO server
  const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
    auth: {
      token, // Pass the token as an authentication parameter
    },
  });

  socket.emit('accessToroom', room)
  return socket;
};

export default InitSocket;
