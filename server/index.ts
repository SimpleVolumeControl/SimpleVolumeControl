// Custom Server for next.js
// Based on https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c

import express, { Request, Response } from 'express';
const server = express();
import next from 'next';
import App from '../model/app';
import { apiRouter, wss } from './api';
import { homedir } from 'os';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

const configDir = process.env.CONFIG_DIR || homedir();
export const configFile = `${configDir}/.simplevolumecontrol_config.json`;

App.getInstance().loadConfig(configFile);

App.getInstance().registerConfigChangeListener(() =>
  App.getInstance().saveConfig(configFile),
);

(async () => {
  try {
    await app.prepare();

    // Delegate all api paths to a dedicated router.
    // This dedicated router does not handle WebSockets.
    // For these, see the upgrade handler below and the WebSocketServer `wss`.
    server.use('/api', apiRouter);

    // Everything else should be handled by next.js.
    server.all('{*path}', (req: Request, res: Response) => handle(req, res));

    // Start listening and print the connection details on the console.
    const srv = server.listen(port, (err?: Error) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });

    // The upgrade listener must be redefined with a custom implementation
    // in order to avoid conflicts with next's HMR websockets in dev mode.
    // Solution inspired by https://stackoverflow.com/a/69846167
    srv.on('upgrade', function (req, socket, head) {
      try {
        const { pathname } = new URL(`http://localhost${req.url}`);
        if (pathname?.startsWith('/api/')) {
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
          });
        }
      } catch (e) {
        console.error(e);
      }
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
