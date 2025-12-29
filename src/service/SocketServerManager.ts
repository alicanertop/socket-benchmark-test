import { ENGINE_KEY, type ENGINE_KEYS } from '../constants/engine.ts';
import { SocketIOServerManager } from '../socketio/socketIOServerManager.ts';
import { WSServerManager } from '../ws/wsServerManager.ts';

export class SocketServerManager {
  private engineKey: ENGINE_KEYS = ENGINE_KEY.io;
  private _manager: SocketIOServerManager | WSServerManager;

  constructor() {
    const engine =
      (process.argv[2] as unknown as ENGINE_KEYS) ?? this.engineKey;

    switch (engine) {
      case ENGINE_KEY.io: {
        this._manager = new SocketIOServerManager();
        return;
      }
      case ENGINE_KEY.ws: {
        this._manager = new WSServerManager();
        return;
      }

      default:
        return;
    }
  }

  public get manager() {
    return this._manager;
  }
}
