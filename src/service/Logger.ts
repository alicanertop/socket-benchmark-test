import fs from 'node:fs';
import fsPromise from 'node:fs/promises';

import {
  type BenchmarkRoomMessage,
  type MessageRoomMessage,
} from '../class/index.ts';
import { logsFolderPath } from '../constants/file.ts';

class Logger {
  private filePath: string;

  private checkFolder() {
    if (!fs.existsSync(logsFolderPath)) {
      fs.mkdirSync(logsFolderPath);
    }
  }

  constructor() {
    this.checkFolder();
  }

  async log(data: BenchmarkRoomMessage | MessageRoomMessage) {
    this.checkFolder();
    this.filePath = `${logsFolderPath}/${data.server_engine}_${data.server_id}_${data.client_id}.log`;

    if (!this.filePath) return;
    fsPromise.writeFile(this.filePath, `${data.stringified}\n`, {
      encoding: 'utf-8',
      flag: 'a',
    });
  }
}

export const LoggerInstance = new Logger();
