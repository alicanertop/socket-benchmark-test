import fs from 'node:fs';
import { join } from 'node:path';

import type { IMessage } from '../@types/message.ts';
import { ENGINE, ENGINE_KEY, type ENGINE_VALUES } from '../constants/engine.ts';
import {
  logsFolderPath,
  resultLogFolderPath,
  resultLogPath,
} from '../constants/file.ts';
import { jsonParse } from '../helpers/jsonParse.ts';
import { calculateStats } from '../helpers/stats.ts';

export class LogAnalyzer {
  analyze() {
    if (!fs.existsSync(logsFolderPath)) {
      fs.mkdirSync(logsFolderPath);
    }

    if (!fs.existsSync(resultLogFolderPath)) {
      fs.mkdirSync(resultLogFolderPath);
    }

    const serverToClient: number[] = [];
    const clientToServer: number[] = [];

    let engine: ENGINE_VALUES = ENGINE[ENGINE_KEY.default];
    const logList = fs.readdirSync(logsFolderPath);
    const logSize = logList.length;

    logList.forEach((itemName) => {
      const itemPath = join(logsFolderPath, itemName);
      const content = fs.readFileSync(itemPath, {
        flag: 'r',
        encoding: 'utf-8',
      });

      content.split('\n').forEach((line) => {
        if (!line.trim()) return;

        const parsed = jsonParse<Partial<IMessage>>(line);
        if (!parsed) return;

        engine = parsed.server_engine || ENGINE[ENGINE_KEY.default];
        const serverRecievedTime = Number(parsed.server_recieved_time);
        const serverMessageCreatedAt = Number(parsed.server_message_created_at);
        const clientRecievedAt = Number(parsed.client_recieved_at);

        if (parsed.server_recieved_time) {
          const c2sLatency = serverMessageCreatedAt - serverRecievedTime;
          clientToServer.push(Math.max(0, c2sLatency));
        }

        const s2cLatency = clientRecievedAt - serverMessageCreatedAt;
        serverToClient.push(Math.max(0, s2cLatency));
      });

      fs.rmSync(itemPath);
    });

    const clientToServerStat = calculateStats(clientToServer);
    const serverToClientStat = calculateStats(serverToClient);

    const data = [
      `Engine: ${engine}`,
      `LogCount: ${logSize}`,
      `---`,
      `ClientToServer (HTTP to Socket Server) ms`,
      JSON.stringify(clientToServerStat, null, 2),
      `---`,
      `ServerToClient (Socket Server to Client) ms`,
      JSON.stringify(serverToClientStat, null, 2),
    ].join('\n');

    fs.writeFileSync(resultLogPath(engine), data, {
      encoding: 'utf-8',
      flag: 'w',
    });
  }
}
