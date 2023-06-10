import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & { namespace?: string; server?: any },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
}

export default SocketAdapter;
