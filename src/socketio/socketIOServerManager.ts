import type {
  Server as HttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import { type TemplatedApp as uWSTemplatedApp } from 'uWebSockets.js';

import { ServerLogMessage } from '../class/ServerLogMessage.ts';
import { CHANNELS, type CHANNELS_VALUES } from '../constants/channels.ts';
import { EXPRESS_IO_CONFIG } from '../constants/config.ts';
import { ENGINE, ENGINE_KEY } from '../constants/engine.ts';
import { APP_HOST_URL, BASE_PORT, HTTP_INFO } from '../constants/envtouse.ts';
import { ROOMS, type ROOMS_VALUES } from '../constants/rooms.ts';
import { LoggerInstance } from '../service/Logger.ts';
import {
  BaseSocketIOManager,
  type SocketClient,
  SocketServer,
} from './baseSocketIOManager.ts';

export class SocketIOServerManager extends BaseSocketIOManager {
  private sendAllGivenRoom(
    room: ROOMS_VALUES,
    message: string,
    extraMessageParams = {}
  ) {
    if (!this.clientSize) return false;

    const generatedMessage: any = Object.assign({}, extraMessageParams, {
      message,
      message_room: room,
      server_id: this.serverUUID,
      server_engine: this.wsInfo.ENGINE,
      server_message_created_at: Date.now(),
    });

    const serverLogMessage = new ServerLogMessage(generatedMessage);

    this.socket.to(room).emit(room, serverLogMessage.stringifiedAll);
    LoggerInstance.serverLog(serverLogMessage);
  }

  private sendMessageToRoom(message: string, serverRecievedTime: number) {
    if (!this.socket.sockets.adapter.rooms.get(ROOMS.MESSAGE)?.size) return;
    this.sendAllGivenRoom(ROOMS.MESSAGE, message, {
      server_recieved_time: serverRecievedTime,
    });
  }

  private onTimeoutCalled(message: string) {
    if (!this.socket.sockets.adapter.rooms.get(ROOMS.BENCHMARK)?.size) return;
    this.sendAllGivenRoom(ROOMS.BENCHMARK, message);
  }

  private joinChannel() {
    this.socket.on(CHANNELS.CONNECTION, (socketClient: SocketClient) => {
      socketClient.on(CHANNELS.JOIN, (data) => {
        socketClient.join(data);
      });

      socketClient.on(CHANNELS.LEAVE, (data) => {
        socketClient.leave(data);
      });

      socketClient.on(CHANNELS.DISCONNECT, () => {
        // console.log(`Disconnected ${socketClient.id}`);
        console.log(`Client Size: ${this.clientSize}`);
      });

      socketClient.on(CHANNELS.CLOSE, () => {
        // console.log(`Closed ${socketClient.id}`);
        console.log(`Client Size: ${this.clientSize}`);
      });

      socketClient.emit(
        CHANNELS.ME,
        JSON.stringify({ clientId: socketClient.id, serverId: this.serverUUID })
      );

      // console.log(`Connected ${socketClient.id}`);
      console.log(`Client Size: ${this.clientSize}`);
    });
  }

  public override get clientSize() {
    return this.socket.sockets.sockets.size;
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
    this.socket = new SocketServer(httpServer, EXPRESS_IO_CONFIG);
    this.joinChannel();

    this.wsInfo = {
      PORT: BASE_PORT.WS_IO_EXPESS,
      ENGINE: ENGINE[ENGINE_KEY.io],
      URL: `ws://${APP_HOST_URL}:${BASE_PORT.WS_IO_EXPESS}`,
    };

    this.socket.listen(this.wsInfo.PORT);

    httpServer.listen(HTTP_INFO.PORT, () => {
      console.log(`Socket.io Express server is running on`);
      console.log(`Socket URL -> ${this.wsInfo.URL}`);
      console.log(`HTTP URL -> ${HTTP_INFO.URL}`);
    });
  }

  uWebSocketServerGenerate(uWebSocketApp: uWSTemplatedApp) {
    this.socket = new SocketServer(EXPRESS_IO_CONFIG);
    this.joinChannel();

    this.wsInfo = {
      PORT: BASE_PORT.WS_IO_U_WEBSOCKET,
      ENGINE: ENGINE[ENGINE_KEY.iouWebSocket],
      URL: `ws://${APP_HOST_URL}:${BASE_PORT.WS_IO_U_WEBSOCKET}`,
    };

    this.socket.listen(this.wsInfo.PORT);

    uWebSocketApp.listen(HTTP_INFO.PORT, (token) => {
      console.log(`uWebSockets is working, token is -> `, token);
      console.log(`Socket URL -> ${this.wsInfo.URL}`);
      console.log(`HTTP URL -> ${HTTP_INFO.URL}`);
    });
  }
}
