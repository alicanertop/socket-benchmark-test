import { BASE_ENGINE_KEY, getEngineFromValue } from '../constants/engine.ts';
import { getWSInfo } from '../helpers/getWSInfo.ts';
import { SocketIOClientManager } from '../socketio/socketIOClientManager.ts';
import { WSClientManager } from '../ws/wsClientManager.ts';

export class SocketClientManager {
  private async init() {
    const wsInfo = await getWSInfo();
    const engine = getEngineFromValue(wsInfo?.ENGINE);

    switch (engine) {
      case BASE_ENGINE_KEY.io:
        return new SocketIOClientManager(wsInfo.URL);
      case BASE_ENGINE_KEY.ws:
        return new WSClientManager(wsInfo.URL);

      default:
        console.error('Engine not found');
        return;
    }
  }

  constructor() {
    this.init();
  }
}

const startSocketIOClient = () => {
  let length = Number(process.argv[2]);
  if (Number.isNaN(length) || typeof length === 'undefined') {
    length = 1;
  }

  Array.from({ length }).forEach(() => {
    new SocketClientManager();
  });
};

startSocketIOClient();
