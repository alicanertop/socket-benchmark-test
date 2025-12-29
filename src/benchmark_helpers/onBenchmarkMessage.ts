import {
  BenchmarkRoomMessage,
  type IBenchmarkRoomMessage,
} from '../class/BenchmarkRoomMessage.ts';
import { LoggerInstance } from '../service/Logger.ts';

export const onBenchmarkMessage = (message: IBenchmarkRoomMessage) => {
  const roomMes = new BenchmarkRoomMessage(message);
  LoggerInstance.log(roomMes);
};
