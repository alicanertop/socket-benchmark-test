import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const srcFilePath = join(fileURLToPath(import.meta.url), '../..');

export const htmlFilePath = join(srcFilePath, 'html', 'html.html');
export const clientLogsFolderPath = join(srcFilePath, '..', 'clientlogs');
export const serverLogsFolderPath = join(srcFilePath, '..', 'serverlogs');
export const resultLogFolderPath = join(srcFilePath, '..', 'result');

export const resultLogPath = (prefix: string) =>
  join(resultLogFolderPath, `${prefix}_result.log`);
