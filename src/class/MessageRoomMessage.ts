import type { IMessage } from '../@types/message.ts';
import type { ENGINE_VALUES } from '../constants/engine.ts';
import type { ROOMS_VALUES } from '../constants/rooms.ts';

export interface IMessageRoomMessage extends IMessage {
  server_recieved_time: number;
}

export class MessageRoomMessage implements IMessageRoomMessage {
  message: string;
  stringified: string;
  client_id: string;
  server_id: string;
  client_recieved_at: number;
  message_room: ROOMS_VALUES;
  server_engine: ENGINE_VALUES;
  server_recieved_time: number;
  server_message_created_at: number;

  constructor({
    message,
    client_id,
    server_id,
    message_room,
    ...data
  }: IMessageRoomMessage) {
    this.message = message;
    this.message_room = message_room;
    this.client_id = client_id;
    this.server_id = server_id;
    
    this.server_engine = data.server_engine;
    this.client_recieved_at = data.client_recieved_at;
    this.server_recieved_time = data.server_recieved_time;
    this.server_message_created_at = data.server_message_created_at;

    this.stringified = JSON.stringify(data);
  }
}
