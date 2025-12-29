import { v4 } from 'uuid';

import type { WS_INFO } from '../@types/wsinfo.ts';
import { SocketBenchmark } from './SocketBenchmark.ts';

export abstract class BaseSocketServerManager<T> {
  abstract socket: T;
  abstract wsInfo: WS_INFO;
  abstract stopBenchmark();
  abstract startBenchmark();
  abstract clientSize: number;
  abstract benchmark: SocketBenchmark;
  abstract generateSocketClient(url: string);
  abstract sendMessageRoomToMessage(
    message: string,
    serverRecievedTime: number
  );
}

export class SocketServerManager<T> extends BaseSocketServerManager<T> {
  private _socket: T;
  private _serverUUID = v4();
  protected _wsInfo: BaseSocketServerManager<T>['wsInfo'];

  protected _socketBenchmark = new SocketBenchmark();

  public set wsInfo(v: typeof this._wsInfo) {
    this._wsInfo = v;
  }

  public get wsInfo() {
    return Object.assign({}, this._wsInfo, {
      CLIENT_COUNT: this.clientSize,
      BENCHMARK_INFO: this._socketBenchmark.info,
    });
  }

  public get serverUUID() {
    return this._serverUUID;
  }

  public get benchmark() {
    return this._socketBenchmark;
  }

  public get socket(): T {
    return this._socket;
  }

  public set socket(v: T) {
    this._socket = v;
  }

  public get clientSize() {
    return 0;
  }

  public processExit() {
    process.exit(0);
  }

  override startBenchmark() {
    throw new Error('Method not implemented.');
  }

  generateSocketClient(url: string) {
    throw new Error('Method not implemented.');
  }

  sendMessageRoomToMessage(message: string, serverRecievedTime: number) {
    throw new Error('Method not implemented.');
  }

  override stopBenchmark() {
    this._socketBenchmark.stopBenchmarkRoomLoop();
  }
}
