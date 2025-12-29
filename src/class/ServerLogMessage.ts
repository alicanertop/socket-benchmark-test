import type { IMessage } from '../@types/message.ts';
import type { ENGINE_VALUES } from '../constants/engine.ts';
import type { ROOMS_VALUES } from '../constants/rooms.ts';

export interface IServerLogMessage extends Omit<
  IMessage,
  'client_recieved_at' | 'client_id'
> {}

export class ServerLogMessage implements IServerLogMessage {
  stringified: string;
  stringifiedAll: string;

  message: string;
  server_id: string;
  message_room: ROOMS_VALUES;
  server_engine: ENGINE_VALUES;
  server_recieved_time: number;
  server_message_created_at: number;

  constructor(params: IServerLogMessage) {
    const { message, ...data } = params;
    this.message = message;

    this.server_id = data.server_id;
    this.message_room = data.message_room;
    this.server_engine = data.server_engine;
    this.server_recieved_time = data.server_recieved_time;
    this.server_message_created_at = data.server_message_created_at;

    this.stringified = JSON.stringify(data);
    this.stringifiedAll = JSON.stringify(params);
  }
}
