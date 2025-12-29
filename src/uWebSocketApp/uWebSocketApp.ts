import uWS from 'uWebSockets.js';

import { ROUTES } from '../constants/routes.ts';
import { getContent } from '../html/index.ts';
import { SocketServerManager } from '../service/SocketServerManager.ts';
import { readString, setHeaderContentToJson } from './helpers/requestHelper.ts';

const uWebSocketApp = uWS.App();
const socketServerManager = new SocketServerManager();
socketServerManager.manager.uWebSocketServerGenerate(uWebSocketApp);

uWebSocketApp.get(ROUTES.home, (res, req) => {
  res.writeHeader('content-type', 'text/html');
  res.end(getContent(socketServerManager.manager.wsInfo));
});

uWebSocketApp.get(ROUTES.wsinfo, (res, req) => {
  setHeaderContentToJson(res);
  res.end(JSON.stringify(socketServerManager.manager.wsInfo));
});

uWebSocketApp.get(ROUTES.benchmarkon, (res, req) => {
  setHeaderContentToJson(res);
  socketServerManager.manager.startBenchmark();
  res.end('Benchmark Started');
});

uWebSocketApp.get(ROUTES.benchmarkoff, (res, req) => {
  setHeaderContentToJson(res);
  socketServerManager.manager.stopBenchmark();
  res.end('Benchmark Stopped');
});

uWebSocketApp.get(ROUTES.benchmarkmatch, (res, req) => {
  setHeaderContentToJson(res);
  socketServerManager.manager.benchmark.setMessageToMatch();
  res.end('Benchmark message is match data now');
});

uWebSocketApp.get(ROUTES.benchmarksinglechar, (res, req) => {
  setHeaderContentToJson(res);
  socketServerManager.manager.benchmark.setMessageToSingleChar();
  res.end('Benchmark message benchmarksinglechar now');
});

uWebSocketApp.get(ROUTES.benchmarktimeupdate_time, (res, req) => {
  setHeaderContentToJson(res);
  socketServerManager.manager.benchmark.updateTimeoutTime(
    req.getParameter('time')
  );
  res.end(JSON.stringify(socketServerManager.manager.benchmark.info));
});

uWebSocketApp.post(ROUTES.message, async (res, req) => {
  res.onAborted(() => {
    res.aborted = true;
  });

  const body = await readString(res);

  try {
    const parsedBody = JSON.parse(body);
    if (res.aborted) return;
    setHeaderContentToJson(res);
    if (typeof parsedBody.data === 'string') {
      socketServerManager.manager.sendMessageRoomToMessage(
        parsedBody.data,
        Date.now()
      );
    } else {
      socketServerManager.manager.sendMessageRoomToMessage(
        JSON.stringify(parsedBody.data),
        Date.now()
      );
    }

    res.end('sent');
  } catch (err) {
    if (res.aborted) return;
    res
      .writeStatus('500')
      .end(JSON.stringify({ error: String(err), message: 'Invalid JSON' }));
  }
});
