import type {
  Server as HttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import uWS, { type TemplatedApp as uWSTemplatedApp } from 'uWebSockets.js';
import { v4 } from 'uuid';

import { CHANNELS } from '../constants/channels.ts';
import { ENGINE, ENGINE_KEY } from '../constants/engine.ts';
import { APP_HOST_URL, BASE_PORT, HTTP_INFO } from '../constants/envtouse.ts';
import { ROOMS, type ROOMS_VALUES } from '../constants/rooms.ts';
import { jsonParse } from '../helpers/jsonParse.ts';
import {
  BaseWSManager,
  type BaseWebSocketClient,
  type MESSAGE,
  WebSocket,
  WebSocketServer,
  type uWSWebSocket,
} from './baseWSManager.ts';

export class WSServerManager extends BaseWSManager {
  private decoder = new TextDecoder('utf-8');
  private clientList = new Set<BaseWebSocketClient>();

  private sendAllGivenRoom(
    room: ROOMS_VALUES,
    message: string,
    extraMessageParams = {}
  ) {
    if (!this.clientSize) return false;

    this.clientList.forEach((client: WebSocket) => {
      if (client.joinedRooms.has(room)) {
        client.send(
          JSON.stringify([
            room,
            {
              ...extraMessageParams,
              message,
              message_room: room,
              server_id: this.serverUUID,
              server_engine: this.wsInfo.ENGINE,
              server_message_created_at: Date.now(),
            },
          ])
        );
      }
    });
  }

  private sendMessageToRoom(message: string, serverRecievedTime: number) {
    if (!this.hasMessageRoomMembers) return;
    this.sendAllGivenRoom(ROOMS.MESSAGE, message, {
      server_recieved_time: serverRecievedTime,
    });
  }

  private onTimeoutCalled(message: string) {
    if (!this.hasBenchmarkRoomMembers) return;
    this.sendAllGivenRoom(ROOMS.BENCHMARK, message);
  }

  private onOpenConnection(socketClient: BaseWebSocketClient) {
    socketClient.id = v4();
    socketClient.joinedRooms = new Set([ROOMS.PING]);
    this.clientList.add(socketClient);

    // console.log(`Connected ${socketClient.id}`);
    console.log(`Client Size: ${this.clientSize}`);
    return JSON.stringify([
      CHANNELS.ME,
      { clientId: socketClient.id, serverId: this.serverUUID },
    ]);
  }

  private onMessage(socketClient: BaseWebSocketClient, data: ArrayBuffer) {
    const mess = this.decoder.decode(data);
    const [channel, value] = jsonParse<MESSAGE<ROOMS_VALUES>>(mess);

    switch (channel) {
      case CHANNELS.JOIN:
        socketClient.joinedRooms.add(value);
        return;
      case CHANNELS.LEAVE:
        socketClient.joinedRooms.delete(value);
        return;
    }

    console.log('received:', channel, value);
  }

  private onClose(socketClient: BaseWebSocketClient, reason?: string) {
    this.clientList.delete(socketClient);
    // console.log([`Closed ${socketClient.id}`, reason].join(' '));
    console.log(`Client Size: ${this.clientSize}`);
  }

  private onDisconnect(socketClient: BaseWebSocketClient, reason?: string) {
    this.clientList.delete(socketClient);
    // console.log([`Disconnected ${socketClient.id}`, reason].join(' '));
    console.log(`Client Size: ${this.clientSize}`);
  }

  private joinChannel() {
    this.socket.on(CHANNELS.CONNECTION, (socketClient: WebSocket) => {
      socketClient.on(CHANNELS.MESSAGE, (data: ArrayBuffer) => {
        this.onMessage(socketClient, data);
      });

      socketClient.on(CHANNELS.CLOSE, () => this.onClose(socketClient));
      socketClient.on(CHANNELS.DISCONNECT, () =>
        this.onDisconnect(socketClient)
      );
      socketClient.send(this.onOpenConnection(socketClient));
    });
  }

  public get hasBenchmarkRoomMembers(): boolean {
    if (!this.clientSize) return false;
    return Array.from(this.clientList).some((wsClient) =>
      wsClient.joinedRooms.has(ROOMS.BENCHMARK)
    );
  }

  public get hasMessageRoomMembers(): boolean {
    if (!this.clientSize) return false;
    return Array.from(this.clientList).some((wsClient) =>
      wsClient.joinedRooms.has(ROOMS.MESSAGE)
    );
  }

  public override get clientSize() {
    return this.clientList.size;
  }

  override sendMessageRoomToMessage(data: string, serverRecievedTime: number) {
    this.sendMessageToRoom(data, serverRecievedTime);
  }

  override startBenchmark() {
    this.benchmark.startBenchmarkRoomLoop(this.onTimeoutCalled.bind(this));
  }

  expressServerGenerate(
    httpServer: HttpServer<typeof IncomingMessage, typeof ServerResponse>
  ) {
    this.wsInfo = {
      PORT: BASE_PORT.WS_EXPRESS,
      ENGINE: ENGINE[ENGINE_KEY.ws],
      URL: `ws://${APP_HOST_URL}:${BASE_PORT.WS_EXPRESS}`,
    };

    this.socket = new WebSocketServer({ port: this.wsInfo.PORT });
    this.joinChannel();

    httpServer.listen(HTTP_INFO.PORT, () => {
      console.log(`Socket.io Express server is running on`);
      console.log(`Socket URl -> ${this.wsInfo.URL}`);
      console.log(`HTTP URl -> ${HTTP_INFO.URL}`);
    });
  }

  uWebSocketServerGenerate(uWebSocketApp: uWSTemplatedApp) {
    const parentThis = this;

    this.wsInfo = {
      PORT: BASE_PORT.WS_U_WEBSOCKET,
      ENGINE: ENGINE[ENGINE_KEY.wsuWebSocket],
      URL: `ws://${APP_HOST_URL}:${BASE_PORT.WS_U_WEBSOCKET}`,
    };

    const wsApp = uWebSocketApp.ws('/*', {
      compression: uWS.SHARED_COMPRESSOR,
      open(socketClient: uWSWebSocket) {
        socketClient.send(parentThis.onOpenConnection(socketClient));
      },
      message(socketClient: uWSWebSocket, data: ArrayBuffer) {
        parentThis.onMessage(socketClient, data);
      },
      close(socketClient: uWSWebSocket, code: number, message: ArrayBuffer) {
        parentThis.onClose(
          socketClient,
          `${code} ${parentThis.decoder.decode(message)}`
        );
      },
    });
    wsApp.listen(this.wsInfo.PORT, () => {});

    uWebSocketApp.listen(HTTP_INFO.PORT, (token) => {
      console.log(`uWebSockets is working, token is -> `, token);
      console.log(`Socket URl -> ${this.wsInfo.URL}`);
      console.log(`HTTP URl -> ${HTTP_INFO.URL}`);
    });
  }
}
