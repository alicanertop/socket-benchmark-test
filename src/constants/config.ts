import type { ServerOptions } from 'socket.io';

export const EXPRESS_IO_CONFIG: Partial<ServerOptions> = {
  cors: { origin: '*' },
};
