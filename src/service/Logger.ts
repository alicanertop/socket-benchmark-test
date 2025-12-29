import fs from 'node:fs';
import fsPromise from 'node:fs/promises';

import {
  type BenchmarkRoomMessage,
  type MessageRoomMessage,
  type ServerLogMessage,
} from '../class/index.ts';
import {
  clientLogsFolderPath,
  serverLogsFolderPath,
} from '../constants/file.ts';

class Logger {
  private checkClientFolder() {
    if (!fs.existsSync(clientLogsFolderPath)) {
      fs.mkdirSync(clientLogsFolderPath);
    }
  }

  private checkServerFolder() {
    if (!fs.existsSync(serverLogsFolderPath)) {
      fs.mkdirSync(serverLogsFolderPath);
    }
  }

  constructor() {
    this.checkClientFolder();
    this.checkServerFolder();
  }

  async serverLog(data: ServerLogMessage) {
    this.checkServerFolder();

    fsPromise.writeFile(
      `${serverLogsFolderPath}/${data.server_engine}_${data.server_id}.log`,
      `${data.stringified}\n`,
      {
        encoding: 'utf-8',
        flag: 'a',
      }
    );
  }

  async clientLog(data: BenchmarkRoomMessage | MessageRoomMessage) {
    this.checkClientFolder();

    fsPromise.writeFile(
      `${clientLogsFolderPath}/${data.server_engine}_${data.server_id}_${data.client_id}.log`,
      `${data.stringified}\n`,
      {
        encoding: 'utf-8',
        flag: 'a',
      }
    );
  }
}

export const LoggerInstance = new Logger();
