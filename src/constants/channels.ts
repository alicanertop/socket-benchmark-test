export const CHANNELS = {
  ME: 'me',
  OPEN: 'open',
  PING: 'ping',
  JOIN: 'join',
  ECHO: 'echo',
  ERROR: 'error',
  LEAVE: 'leave',
  CLOSE: 'close',
  CONNECT: 'connect',
  MESSAGE: 'message',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
};

export type CHANNELS_KEYS = keyof typeof CHANNELS;
export type CHANNELS_VALUES = (typeof CHANNELS)[CHANNELS_KEYS];