type EnvBase = {
  //# PostgreSQL Configuration
  MYSQL_USER: string;
  MYSQL_ROOT_PASSWORD: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;
  MYSQL_PORT: string;
  MYSQL_HOST: string;

  APP_HOST_URL: string;

  BASE_PORT_HTTP_DEFAULT: string;
  BASE_PORT_WS_DEFAULT: string;
  BASE_PORT_WS_EXPRESS: string;
  BASE_PORT_WS_U_WEBSOCKET: string;
  BASE_PORT_WS_IO_EXPESS: string;
  BASE_PORT_WS_IO_U_WEBSOCKET: string;
};

export interface Environment extends EnvBase {
  //# Shared Environment
  DATABASE_URL: `mysql://${EnvBase['MYSQL_USER']}:${EnvBase['MYSQL_PASSWORD']}@${EnvBase['MYSQL_HOST']}:${EnvBase['MYSQL_PORT']}/${EnvBase['MYSQL_DATABASE']}`;
}
