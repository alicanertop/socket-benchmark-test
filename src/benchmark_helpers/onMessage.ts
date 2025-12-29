import {
  type IMessageRoomMessage,
  MessageRoomMessage,
} from '../class/MessageRoomMessage.ts';
import { LoggerInstance } from '../service/Logger.ts';

export const onMessage = (message: IMessageRoomMessage) => {
  const roomMes = new MessageRoomMessage(message);
  LoggerInstance.log(roomMes);
};
