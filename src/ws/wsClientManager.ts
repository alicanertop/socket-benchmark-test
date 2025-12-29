import type { WS_INFO } from '../@types/wsinfo.ts';
import { onBenchmarkMessage } from '../benchmark_helpers/onBenchmarkMessage.ts';
import { onMessage } from '../benchmark_helpers/onMessage.ts';
import { CHANNELS } from '../constants/channels.ts';
import { ROOMS } from '../constants/rooms.ts';
import { CLIENT_LIVE_TIME } from '../constants/settings.ts';
import { getWSInfo } from '../helpers/getWSInfo.ts';
import { jsonParse } from '../helpers/jsonParse.ts';
import { BaseWSManager, type MESSAGE } from '../ws/baseWSManager.ts';

export class WSClientManager {
  private manager = new BaseWSManager();
  private wsClient: ReturnType<typeof this.manager.generateSocketClient>;
  private me: { clientId: string; serverId: string } = {
    clientId: 'client',
    serverId: 'server',
  };

  private openRoomListener() {
    this.wsClient.on(CHANNELS.OPEN, () => {
      this.wsClient.send(JSON.stringify([CHANNELS.JOIN, ROOMS.MESSAGE]));
      this.wsClient.send(JSON.stringify([CHANNELS.JOIN, ROOMS.BENCHMARK]));

      if (CLIENT_LIVE_TIME > 0) {
        setTimeout(() => {
          this.wsClient.close();
        }, CLIENT_LIVE_TIME);
      }
    });
  }

  private messageRoomListener() {
    this.wsClient.on(CHANNELS.MESSAGE, (message: Buffer) => {
      const [room, data] = jsonParse<MESSAGE>(String(message));

      switch (room) {
        case ROOMS.ME: {
          this.me = data as typeof this.me;
          return;
        }

        case ROOMS.BENCHMARK: {
          onBenchmarkMessage(
            Object.assign(data as any, {
              client_id: this.me.clientId,
              client_recieved_at: Date.now(),
            })
          );
          return;
        }

        case ROOMS.MESSAGE: {
          onMessage(
            Object.assign(data as any, {
              client_id: this.me.clientId,
              client_recieved_at: Date.now(),
            })
          );
          return;
        }

        default:
          break;
      }

      console.log(`Server send: `, room, data);
    });
  }

  private closeRoomListener() {
    this.wsClient.on(CHANNELS.CLOSE, (reason) => {
      console.log(`${this.me.clientId} closed. Reason: ${reason}`);
      this.manager.processExit();
    });
  }

  private disconnectRoomListener() {
    this.wsClient.on(CHANNELS.DISCONNECT, (reason) => {
      if (reason !== 'io client disconnect') {
        console.log(`${this.me.clientId} disconnected. Reason: ${reason}`);
        this.manager.processExit();
      }
    });
  }

  private errorRoomListener() {
    this.wsClient.on(CHANNELS.ERROR, (reason) => {
      console.log(`${this.me.clientId} has error happen. Reason: ${reason}`);
      this.manager.processExit();
    });
  }

  private roomListeners() {
    this.openRoomListener();
    this.messageRoomListener();
    this.closeRoomListener();
    this.disconnectRoomListener();
    this.errorRoomListener();
  }

  private deconstructor() {
    this.wsClient.close();
    console.log(`${this.me.clientId} connection cleared`);
    this.manager.processExit();
  }

  private async init(wsUrl: WS_INFO['URL']) {
    let _wsUrl = wsUrl;
    if (!_wsUrl) {
      _wsUrl = (await getWSInfo()).URL;
    }
    this.wsClient = this.manager.generateSocketClient(_wsUrl);
    this.roomListeners();
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
