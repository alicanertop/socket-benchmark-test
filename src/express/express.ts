import express from 'express';
import { createServer } from 'http';

import { ROUTES } from '../constants/routes.ts';
import { getContent } from '../html/index.ts';
import { SocketServerManager } from '../service/SocketServerManager.ts';

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

const httpServer = createServer(expressApp);

const socketServerManager = new SocketServerManager();
socketServerManager.manager.expressServerGenerate(httpServer);

expressApp.get(ROUTES.home, (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.send(getContent(socketServerManager.manager.wsInfo));
});

expressApp.get(ROUTES.wsinfo, (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(socketServerManager.manager.wsInfo));
});

expressApp.get(ROUTES.benchmarkon, (req, res) => {
  res.setHeader('content-type', 'application/json');
  socketServerManager.manager.startBenchmark();
  res.send('Benchmark Started');
});

expressApp.get(ROUTES.benchmarkoff, (req, res) => {
  res.setHeader('content-type', 'application/json');
  socketServerManager.manager.stopBenchmark();
  res.send('Benchmark Stopped');
});

expressApp.get(ROUTES.benchmarkmatch, (req, res) => {
  res.setHeader('content-type', 'application/json');
  socketServerManager.manager.benchmark.setMessageToMatch();
  res.send('Benchmark message is match data now');
});

expressApp.get(ROUTES.benchmarksinglechar, (req, res) => {
  res.setHeader('content-type', 'application/json');
  socketServerManager.manager.benchmark.setMessageToSingleChar();
  res.send('Benchmark message benchmarksinglechar now');
});

expressApp.get(ROUTES.benchmarktimeupdate_time, (req, res) => {
  res.setHeader('content-type', 'application/json');
  socketServerManager.manager.benchmark.updateTimeoutTime(req.params?.['time']);
  res.send(JSON.stringify(socketServerManager.manager.benchmark.info));
});

expressApp.post(ROUTES.message, (req, res) => {
  res.setHeader('content-type', 'application/json');
  if (typeof req.body.data === 'string') {
    socketServerManager.manager.sendMessageRoomToMessage(
      req.body.data,
      Date.now()
    );
  } else {
    socketServerManager.manager.sendMessageRoomToMessage(
      JSON.stringify(req.body.data),
      Date.now()
    );
  }

  res.send('sent');
});
