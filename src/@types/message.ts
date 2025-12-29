import type { ENGINE_VALUES } from '../constants/engine.ts';
import type { ROOMS_VALUES } from '../constants/rooms.ts';

export interface IMessage {
  stringified: string;
  message: string;
  client_id: string;
  server_id: string;
  message_room: ROOMS_VALUES;
  client_recieved_at: number;
  server_engine: ENGINE_VALUES;
  server_recieved_time?: number;
  server_message_created_at: number;
}
