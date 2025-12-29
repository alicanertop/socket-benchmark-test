import type { IMessage } from '../@types/message.ts';
import type { ENGINE_VALUES } from '../constants/engine.ts';
import type { ROOMS_VALUES } from '../constants/rooms.ts';

export interface IBenchmarkRoomMessage extends IMessage {}

export class BenchmarkRoomMessage implements IBenchmarkRoomMessage {
  message: string;
  stringified: string;
  client_id: string;
  server_id: string;
  client_recieved_at: number;
  message_room: ROOMS_VALUES;
  server_engine: ENGINE_VALUES;
  server_message_created_at: number;

  constructor({
    message,
    client_id,
    server_id,
    message_room,
    ...data
  }: IBenchmarkRoomMessage) {
    this.message = message;
    this.client_id = client_id;
    this.server_id = server_id;
    this.message_room = message_room;

    this.server_engine = data.server_engine;
    this.client_recieved_at = data.client_recieved_at;
    this.server_message_created_at = data.server_message_created_at;

    this.stringified = JSON.stringify(data);
  }
}
