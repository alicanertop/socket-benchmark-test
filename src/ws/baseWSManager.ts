import type { CHANNELS_VALUES } from 'src/constants/channels.ts';
import uWS from 'uWebSockets.js';
import WebSocket, { WebSocketServer } from 'ws';

import type { ROOMS_VALUES } from '../constants/rooms.ts';
import { SocketServerManager } from '../service/BaseSocketServerManager.ts';

export type MESSAGE<T = unknown> = [CHANNELS_VALUES, T];
export { WebSocket, WebSocketServer } from 'ws';

export interface BaseWebSocketClient {
  id: string;
  joinedRooms: Set<ROOMS_VALUES>;
}

declare module './baseWSManager.ts' {
  export interface WebSocketClient extends BaseWebSocketClient {}
  export interface WebSocket extends BaseWebSocketClient {}
  export interface uWSWebSocket
    extends BaseWebSocketClient, uWS.WebSocket<unknown> {}
}

export class BaseWSManager<T = WebSocketServer> extends SocketServerManager<T> {
  public generateSocketClient(url: string) {
    return new WebSocket(url);
  }
}
