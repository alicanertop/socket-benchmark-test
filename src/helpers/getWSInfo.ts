import type { WS_INFO } from '../@types/wsinfo.ts';
import { HTTP_INFO } from '../constants/envtouse.ts';

const fetchFailMessages = ['fetch failed', 'Failed to fetch'];

export const getWSInfo = async () => {
  try {
    return await fetch(`${HTTP_INFO.URL}${HTTP_INFO.WS_INFO_ROUTE}`).then(
      (res) => res.json() as unknown as WS_INFO
    );
  } catch (error) {
    if (fetchFailMessages.includes(error.message)) {
      console.error('Socket & HTTP Server not running');
    } else {
      throw Error(error);
    }
  }
};
