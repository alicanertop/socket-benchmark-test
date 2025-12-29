import {
  type DefaultEventsMap,
  type Server,
  type Socket as SocketClient,
} from 'socket.io';
import { io } from 'socket.io-client';

import { SocketServerManager } from '../service/BaseSocketServerManager.ts';

export { Server as SocketServer } from 'socket.io';
export type { SocketClient };

export class BaseSocketIOManager<
  T = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
> extends SocketServerManager<T> {
  public generateSocketClient(url: string) {
    return io(url, {
      timeout: 2000,
      autoConnect: false,
      reconnection: false,
      reconnectionDelay: 10000,
      reconnectionDelayMax: 60000,
      reconnectionAttempts: Infinity,
      transports: ['websocket', 'polling'],
    });
  }
}
