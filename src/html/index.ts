import fs from 'node:fs';

import { htmlFilePath } from '../constants/file.ts';
import { ROUTES } from '../constants/routes.ts';

export const getContent = (wsInfo: any) => {
  let html = fs
    .readFileSync(htmlFilePath, 'utf-8')
    .replace(':ROUTES_TEMPLATE_KEY:', JSON.stringify(ROUTES))
    .replace(':WS_STATUS_INFO:', JSON.stringify(wsInfo));

  return html;
};
