import { CHANNELS } from './channels.ts';

export const ROOMS = {
  ME: 'me',
  PING: 'ping',
  MESSAGE: 'message',
  BENCHMARK: 'benchmark',
} as const;

export type ROOMS_KEYS = keyof typeof ROOMS;
export type ROOMS_VALUES = (typeof ROOMS)[ROOMS_KEYS];

export const ROOM_KEYWORDS = [CHANNELS.JOIN, CHANNELS.LEAVE];
