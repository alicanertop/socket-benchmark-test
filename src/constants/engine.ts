export const BASE_ENGINE_KEY = {
  default: 'default',
  io: 'io',
  ws: 'ws',
} as const;

export const ENGINE_KEY = {
  ...BASE_ENGINE_KEY,
  iouWebSocket: 'iouWebSocket',
  wsuWebSocket: 'wsuWebSocket',
} as const;

export const ENGINE = {
  [ENGINE_KEY.io]: 'SocketIO',
  [ENGINE_KEY.default]: 'EngineNotSet',
  [ENGINE_KEY.ws]: 'NativeWebsocket',
  [ENGINE_KEY.iouWebSocket]: 'SocketIO_uWebSocket',
  [ENGINE_KEY.wsuWebSocket]: 'NativeWebsocket_uWebSocket',
} as const;

export type ENGINE_KEYS = keyof typeof ENGINE_KEY;
export type ENGINE_VALUES = (typeof ENGINE)[ENGINE_KEYS];

const IO_ENGINES_LIST = [ENGINE_KEY.io, ENGINE_KEY.iouWebSocket] as const;
const WS_ENGINES_LIST = [ENGINE_KEY.ws, ENGINE_KEY.wsuWebSocket] as const;

export const getEngineFromValue = (val: ENGINE_VALUES) => {
  if (!val) return undefined;
  
  const [engineKey] =
    Object.entries(ENGINE).find(([key, value]) => value === val) ?? [];

  if (!engineKey) return undefined;

  if (IO_ENGINES_LIST.some((e) => e === engineKey)) {
    return BASE_ENGINE_KEY.io;
  } else if (WS_ENGINES_LIST.some((e) => e === engineKey)) {
    return BASE_ENGINE_KEY.ws;
  }

  return BASE_ENGINE_KEY.default;
};
