// Custom Server for next.js
// Based on https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c

import express, { Request, Response } from 'express';
import expressWs from 'express-ws';
const { app: server, getWss } = expressWs(express());
import next from 'next';
import App from '../model/app';
import api from './api';
import { parse } from 'url';
import { Socket } from 'net';
import WebSocket from 'ws';
import { homedir } from 'os';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

export const configFile = `${homedir()}/.simplevolumecontrol_config.json`;

App.getInstance().loadConfig(configFile);
App.getInstance().saveConfig(configFile); // TODO Remove

(async () => {
  try {
    await app.prepare();
    server.use('/api', api);
    server.all('*', (req: Request, res: Response) => handle(req, res));
    const srv = server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });

    // The upgrade listener must be redefined with a custom implementation
    // in order to avoid conflicts with next's HMR websockets in dev mode.
    // Solution inspired by https://stackoverflow.com/a/69846167
    // All upgrade requests are handled normally, except for those handled by next.
    if (dev) {
      srv.removeListener(
        'upgrade',
        srv.listeners('upgrade')?.[0] as (...args: any[]) => void,
      );
      srv.on('upgrade', function (req, socket, head) {
        const { pathname } = parse(req.url ?? '', true);
        if (pathname !== '/_next/webpack-hmr') {
          const wss = getWss();
          wss.handleUpgrade(req, socket as Socket, head, (ws: WebSocket) => {
            wss.emit('connection', ws, req);
          });
        }
      });
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
