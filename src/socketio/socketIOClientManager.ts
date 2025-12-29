import type { WS_INFO } from '../@types/wsinfo.ts';
import { onBenchmarkMessage } from '../benchmark_helpers/onBenchmarkMessage.ts';
import { onMessage } from '../benchmark_helpers/onMessage.ts';
import { CHANNELS } from '../constants/channels.ts';
import { ROOMS } from '../constants/rooms.ts';
import { CLIENT_LIVE_TIME } from '../constants/settings.ts';
import { getWSInfo } from '../helpers/getWSInfo.ts';
import { jsonParse } from '../helpers/jsonParse.ts';
import { BaseSocketIOManager } from '../socketio/baseSocketIOManager.ts';

export class SocketIOClientManager {
  private manager = new BaseSocketIOManager();
  private me: { clientId: string; serverId: string } = {
    clientId: 'client',
    serverId: 'server',
  };
  private socketio: ReturnType<typeof this.manager.generateSocketClient>;

  private connectRoomListener() {
    this.socketio.on(CHANNELS.CONNECT, () => {
      this.socketio.emit(CHANNELS.JOIN, ROOMS.MESSAGE);
      this.socketio.emit(CHANNELS.JOIN, ROOMS.BENCHMARK);

      if (CLIENT_LIVE_TIME) {
        setTimeout(() => {
          this.socketio.close();
        }, CLIENT_LIVE_TIME);
      }
    });
  }

  private meRoomListener() {
    this.socketio.off(CHANNELS.ME).on(CHANNELS.ME, (data) => {
      this.me = jsonParse<typeof this.me>(data);
    });
  }

  private benchmarkRoomlistener() {
    this.socketio.off(ROOMS.BENCHMARK).on(ROOMS.BENCHMARK, (data) => {
      const parsed = jsonParse(data);
      if (!parsed) return;

      onBenchmarkMessage(
        Object.assign(parsed, {
          client_id: this.me.clientId,
          client_recieved_at: Date.now(),
        })
      );
    });
  }

  private messageRoomlistener() {
    this.socketio.off(ROOMS.MESSAGE).on(ROOMS.MESSAGE, (data) => {
      const parsed = jsonParse(data);
      if (!parsed) return;

      onMessage(
        Object.assign(parsed, {
          client_id: this.me.clientId,
          client_recieved_at: Date.now(),
        })
      );
    });
  }

  private closeRoomListener() {
    this.socketio.on(CHANNELS.CLOSE, (reason) => {
      console.log(`${this.me.clientId} closed. Reason: ${reason}`);
      this.manager.processExit();
    });
  }
  private disconnectRoomListener() {
    this.socketio.on(CHANNELS.DISCONNECT, (reason) => {
      if (reason !== 'io client disconnect') {
        console.log(`${this.me.clientId} disconnected. Reason: ${reason}`);
      }
      this.manager.processExit();
    });
  }

  private roomListeners() {
    this.connectRoomListener();
    this.meRoomListener();
    this.benchmarkRoomlistener();
    this.messageRoomlistener();
    this.closeRoomListener();
    this.disconnectRoomListener();
  }

  private deconstructor() {
    this.socketio.close();
    console.log(`${this.me.clientId} connection cleared`);
  }

  private async init(wsUrl: WS_INFO['URL']) {
    let _wsUrl = wsUrl;
    if (!_wsUrl) {
      _wsUrl = (await getWSInfo()).URL;
    }

    this.socketio = this.manager.generateSocketClient(_wsUrl);
    this.roomListeners();
    this.socketio.connect();
  }

  constructor(wsUrl?: WS_INFO['URL']) {
    this.init(wsUrl);
  }

  [Symbol.dispose]() {
    this.deconstructor();
  }
  [Symbol.asyncDispose]() {
    this.deconstructor();
  }
}
