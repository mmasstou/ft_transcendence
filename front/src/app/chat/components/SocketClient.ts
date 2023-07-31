// components/SocketClient.js
import { useEffect } from 'react';
import io from 'socket.io-client';

const SocketClient = () => {
  useEffect(() => {
    // Replace 'http://your-socket-server' with the actual URL of your socket server.
    const socket = io('http://localhost/chat');

    // Handle socket events here
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return null; // SocketClient component doesn't render anything
};

export default SocketClient;