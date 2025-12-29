import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const srcFilePath = join(fileURLToPath(import.meta.url), '../..');

export const htmlFilePath = join(srcFilePath, 'html', 'html.html');
export const logsFolderPath = join(srcFilePath, '..', 'socketbenchmarklogs');
export const resultLogFolderPath = join(srcFilePath, '..', 'result');

export const resultLogPath = (engine: string) =>
  join(resultLogFolderPath, `${engine}_result.log`);
