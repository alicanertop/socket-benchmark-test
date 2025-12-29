import { ROUTES } from './routes.ts';

export const APP_HOST_URL = process.env.APP_HOST_URL;

export const BASE_PORT = {
  HTTP_DEFAULT: Number(process.env.BASE_PORT_HTTP_DEFAULT),
  WS_DEFAULT: Number(process.env.BASE_PORT_WS_DEFAULT),
  WS_EXPRESS: Number(process.env.BASE_PORT_WS_EXPRESS),
  WS_U_WEBSOCKET: Number(process.env.BASE_PORT_WS_U_WEBSOCKET),
  WS_IO_EXPESS: Number(process.env.BASE_PORT_WS_IO_EXPESS),
  WS_IO_U_WEBSOCKET: Number(process.env.BASE_PORT_WS_IO_U_WEBSOCKET),
};

export const HTTP_INFO = {
  WS_INFO_ROUTE: ROUTES.wsinfo,
  PORT: BASE_PORT.HTTP_DEFAULT,
  URL: `http://${APP_HOST_URL}:${BASE_PORT.HTTP_DEFAULT}`,
};
