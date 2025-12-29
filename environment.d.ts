declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SOCKET_IO_URL: string;
      SOCKET_IO_PORT: string;
    }
  }
}

export {};
