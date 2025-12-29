import uWS from 'uWebSockets.js';

export const setHeaderContentToJson = (res: uWS.HttpResponse) => {
  res.writeHeader('content-type', 'application/json');
};

export const readString = (res: uWS.HttpResponse) =>
  new Promise<string>((resolve, reject) => {
    let buffer: Buffer<ArrayBuffer> = Buffer.alloc(0);

    res.onData((ab: ArrayBuffer, isLast: boolean) => {
      const chunk = Buffer.from(ab);
      buffer = Buffer.concat([buffer, chunk]);

      if (isLast) {
        resolve(String(buffer));
      }
    });

    res.onAborted(() => {
      reject(new Error('Request aborted'));
    });
  });
